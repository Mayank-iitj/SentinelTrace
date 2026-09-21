import json
import logging
from confluent_kafka import Producer
from src.schema.trace import TraceEvent

logger = logging.getLogger(__name__)

class TraceProducer:
    def __init__(self, bootstrap_servers: str = "localhost:9092", topic: str = "agent.traces.raw"):
        self.topic = topic
        conf = {
            'bootstrap.servers': bootstrap_servers,
            'client.id': 'synthetic-agent-harness'
        }
        self.producer = Producer(conf)

    def delivery_report(self, err, msg):
        """ Called once for each message produced to indicate delivery result.
            Triggered by poll() or flush(). """
        if err is not None:
            logger.error(f'Message delivery failed: {err}')
        else:
            logger.debug(f'Message delivered to {msg.topic()} [{msg.partition()}]')

    def produce_event(self, event: TraceEvent):
        """Produces a trace event to the Kafka topic."""
        # Serialize Pydantic model to JSON
        event_json = event.model_dump_json()
        
        self.producer.produce(
            self.topic, 
            key=str(event.session_id), 
            value=event_json.encode('utf-8'),
            callback=self.delivery_report
        )
        self.producer.poll(0) # Trigger delivery report callbacks

    def flush(self):
        """Wait for any outstanding messages to be delivered and delivery report callbacks to be triggered."""
        self.producer.flush()
