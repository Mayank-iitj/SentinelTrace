import logging
import json
import math
from confluent_kafka import Consumer, Producer
from src.schema.trace import TraceEvent, ToolArgsShape

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TraceNormalizer:
    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self.consumer = Consumer({
            'bootstrap.servers': bootstrap_servers,
            'group.id': 'trace-normalizer-group',
            'auto.offset.reset': 'earliest'
        })
        self.producer = Producer({
            'bootstrap.servers': bootstrap_servers,
            'client.id': 'trace-normalizer-producer'
        })
        self.in_topic = "agent.traces.raw"
        self.out_topic = "agent.traces.normalized"

    def run(self):
        self.consumer.subscribe([self.in_topic])
        logger.info(f"Trace Normalizer started. Listening on {self.in_topic}...")
        
        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    logger.error(f"Consumer error: {msg.error()}")
                    continue

                try:
                    # Parse and validate via Pydantic schema
                    raw_data = json.loads(msg.value().decode('utf-8'))
                    event = TraceEvent(**raw_data)
                    
                    if event.raw_args is not None:
                        # Calculate real shape and entropy
                        arg_str = json.dumps(event.raw_args)
                        size = len(arg_str.encode('utf-8'))
                        
                        # Shannon entropy
                        prob = [ float(arg_str.count(c)) / len(arg_str) for c in set(arg_str) ]
                        entropy = -sum(p * math.log2(p) for p in prob)
                        
                        event.tool_args_shape = ToolArgsShape(
                            type_signature="dict",
                            size_bytes=size,
                            entropy=entropy
                        )
                        
                        # Strip raw arguments!
                        event.raw_args = None
                    
                    self.producer.produce(
                        self.out_topic,
                        key=str(event.session_id),
                        value=event.model_dump_json().encode('utf-8')
                    )
                    self.producer.poll(0)
                    logger.debug(f"Normalized and forwarded trace {event.trace_id}")
                    
                except Exception as e:
                    logger.error(f"Validation/Normalizer error: {e}")

        except KeyboardInterrupt:
            logger.info("Shutting down normalizer...")
        finally:
            self.consumer.close()
            self.producer.flush()

if __name__ == "__main__":
    normalizer = TraceNormalizer()
    normalizer.run()
