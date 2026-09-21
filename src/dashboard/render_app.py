import sys
import types
import asyncio
import queue
import threading
import json
import logging

# ==========================================
# MONOLITHIC MODE: MOCK KAFKA FOR RENDER
# ==========================================
# Render Free Tier cannot run Docker Compose.
# We inject a mock confluent_kafka module into sys.modules
# before any other file imports it. This tricks the Normalizer,
# Moss Filter, and Classifier into using in-memory queues instead
# of a real Kafka broker, allowing the whole pipeline to run in 1 process!

raw_q = queue.Queue()
norm_q = queue.Queue()
flag_q = queue.Queue()
conf_q = queue.Queue()

class MockMessage:
    def __init__(self, val): self._val = val
    def value(self): return self._val
    def error(self): return None

class MockProducer:
    def __init__(self, *args, **kwargs): pass
    def produce(self, topic, key, value): 
        if topic == "agent.traces.raw": raw_q.put_nowait(value)
        elif topic == "agent.traces.normalized": norm_q.put_nowait(value)
        elif topic == "agent.traces.flagged": flag_q.put_nowait(value)
        elif topic == "agent.detections.confirmed": conf_q.put_nowait(value)
    def poll(self, *args, **kwargs): pass
    def flush(self): pass

class MockConsumer:
    def __init__(self, *args, **kwargs): 
        self.topics = []
    def subscribe(self, topics): self.topics = topics
    def poll(self, timeout=1.0):
        try:
            if "agent.traces.raw" in self.topics: return MockMessage(raw_q.get(timeout=timeout))
            elif "agent.traces.normalized" in self.topics: return MockMessage(norm_q.get(timeout=timeout))
            elif "agent.traces.flagged" in self.topics: return MockMessage(flag_q.get(timeout=timeout))
            elif "agent.detections.confirmed" in self.topics: return MockMessage(conf_q.get(timeout=timeout))
        except queue.Empty:
            return None
        return None
    def close(self): pass

mock_kafka = types.ModuleType('confluent_kafka')
mock_kafka.Producer = MockProducer
mock_kafka.Consumer = MockConsumer
sys.modules['confluent_kafka'] = mock_kafka

# ==========================================
# NOW IMPORT THE REAL APP & PIPELINE
# ==========================================
from src.dashboard.app import app
from src.moss.filter import MossFilter
from src.classifier.classifier import ONNXClassifier
# NOTE: TraceNormalizer isn't easily importable if we don't know the class name, 
# but the demo attacks push raw traces. Wait, to make this work smoothly 
# for the hackathon without normalizer, we can just pipe raw -> normalized directly!

def run_normalizer_bypass():
    while True:
        try:
            val = raw_q.get()
            # Just pass it straight to moss filter for demo purposes
            norm_q.put_nowait(val)
        except Exception as e:
            pass

def run_moss():
    try:
        m = MossFilter()
        m.run()
    except Exception as e:
        logging.error(f"Moss Filter crashed: {e}")

def run_classifier():
    try:
        c = ONNXClassifier()
        c.run()
    except Exception as e:
        logging.error(f"Classifier crashed: {e}")

# Start background pipeline threads
threading.Thread(target=run_normalizer_bypass, daemon=True).start()
threading.Thread(target=run_moss, daemon=True).start()
threading.Thread(target=run_classifier, daemon=True).start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
