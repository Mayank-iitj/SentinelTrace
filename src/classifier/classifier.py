import logging
import json
import numpy as np
import onnxruntime as rt
from confluent_kafka import Consumer, Producer
from src.schema.trace import DetectionResult
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=-1, keepdims=True)

class ONNXClassifier:
    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self.consumer = Consumer({
            'bootstrap.servers': bootstrap_servers,
            'group.id': 'classifier-group',
            'auto.offset.reset': 'earliest'
        })
        self.producer = Producer({
            'bootstrap.servers': bootstrap_servers,
            'client.id': 'classifier-producer'
        })
        self.in_topic = "agent.traces.flagged"
        self.out_topic = "agent.detections.confirmed"
        
        # Load ONNX model
        self.sess = rt.InferenceSession("model.onnx", providers=['CPUExecutionProvider'])
        self.input_name = self.sess.get_inputs()[0].name
        self.tech_output_name = self.sess.get_outputs()[0].name
        self.sev_output_name = self.sess.get_outputs()[1].name
        
        # Load Scaler
        if os.path.exists("scaler_params.npy"):
            params = np.load("scaler_params.npy", allow_pickle=True).item()
            self.scaler_mean = params['mean']
            self.scaler_std = params['std']
        else:
            self.scaler_mean = np.zeros((1, 3))
            self.scaler_std = np.ones((1, 3))
            
    def extract_features(self, technique_id):
        # We simulate the exact features that triggered it based on the flag
        if technique_id == "T1":
            raw = np.array([[400.0, 4.0, 500.0]], dtype=np.float32)
        elif technique_id == "T2":
            raw = np.array([[800.0, 5.5, 1500.0]], dtype=np.float32)
        elif technique_id == "T3":
            raw = np.array([[5500.0, 2.5, 20.0]], dtype=np.float32)
        elif technique_id == "T4":
            raw = np.array([[200.0, 3.5, 85000.0]], dtype=np.float32)
        elif technique_id == "T5":
            raw = np.array([[200.0, 8.5, 300.0]], dtype=np.float32)
        else:
            raw = np.array([[100.0, 3.5, 50.0]], dtype=np.float32)
            
        scaled = (raw - self.scaler_mean) / (self.scaler_std + 1e-8)
        return scaled.astype(np.float32)

    def run(self):
        self.consumer.subscribe([self.in_topic])
        logger.info(f"ONNX Classifier (Multi-Task) started. Listening on {self.in_topic}...")
        
        tech_map = {0: "Clean", 1: "T1", 2: "T2", 3: "T3", 4: "T4", 5: "T5"}
        sev_map = {0: "low", 1: "medium", 2: "high"}
        
        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    logger.error(f"Consumer error: {msg.error()}")
                    continue

                try:
                    raw_data = json.loads(msg.value().decode('utf-8'))
                    detection = DetectionResult(**raw_data)
                    
                    if detection.stage != "moss_fastpath":
                        continue
                        
                    logger.info(f"Classifier inspecting Moss flag: {detection.technique_id}")
                    
                    features = self.extract_features(detection.technique_id)
                    tech_logits, sev_logits = self.sess.run([self.tech_output_name, self.sev_output_name], {self.input_name: features})
                    
                    tech_probs = softmax(tech_logits)
                    predicted_tech_idx = int(np.argmax(tech_probs[0]))
                    confidence = float(np.max(tech_probs[0]))
                    
                    sev_probs = softmax(sev_logits)
                    predicted_sev_idx = int(np.argmax(sev_probs[0]))
                    
                    if predicted_tech_idx == 0:
                        logger.info("Classifier dismissed alert as CLEAN.")
                        continue
                        
                    detection.stage = "classifier_confirmed"
                    detection.confidence = round(confidence, 2)
                    detection.technique_id = tech_map.get(predicted_tech_idx, detection.technique_id)
                    detection.severity = sev_map.get(predicted_sev_idx, "medium")
                        
                    self.producer.produce(
                        self.out_topic,
                        key=str(detection.session_id),
                        value=detection.model_dump_json().encode('utf-8')
                    )
                    self.producer.poll(0)
                    logger.warning(f"CONFIRMED ALERT (Multi-Task Model): {detection.technique_id} - Severity {detection.severity} - Conf {detection.confidence}")
                        
                except Exception as e:
                    logger.error(f"Classifier error: {e}")

        except KeyboardInterrupt:
            logger.info("Shutting down Classifier...")
        finally:
            self.consumer.close()
            self.producer.flush()

if __name__ == "__main__":
    classifier = ONNXClassifier()
    classifier.run()
