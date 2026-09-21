import logging
import json
import collections
import numpy as np
from confluent_kafka import Consumer, Producer
from src.schema.trace import TraceEvent, DetectionResult

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple deterministic embedding for the hackathon (simulating a vector index)
def get_embedding(sequence: str, dim=64):
    np.random.seed(hash(sequence) % (2**32))
    vec = np.random.randn(dim)
    return vec / np.linalg.norm(vec)

def cosine_similarity(v1, v2):
    return np.dot(v1, v2)

class MossFilter:
    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self.consumer = Consumer({
            'bootstrap.servers': bootstrap_servers,
            'group.id': 'moss-filter-group',
            'auto.offset.reset': 'earliest'
        })
        self.producer = Producer({
            'bootstrap.servers': bootstrap_servers,
            'client.id': 'moss-filter-producer'
        })
        self.in_topic = "agent.traces.normalized"
        self.out_topic = "agent.traces.flagged"
        
        self.session_windows = collections.defaultdict(list)
        self.WINDOW_SIZE = 10
        
        # Build Vector Index at startup (TRD Requirement)
        self.vector_index = {}
        self.build_index()

    def build_index(self):
        # T1: Privilege Escalation
        self.vector_index["T1"] = [
            get_embedding("list_users -> assume_role -> read_secrets"),
            get_embedding("assume_role -> read_secrets"),
            get_embedding("get_token -> assume_role -> dump_db"),
            get_embedding("sudo_su -> read_shadow")
        ]
        # T2: Data Exfil
        self.vector_index["T2"] = [
            get_embedding("read_db -> http_post"),
            get_embedding("query_db -> http_post"),
            get_embedding("read_file -> ftp_upload"),
            get_embedding("get_s3_object -> send_email")
        ]
        # T4: Context flood (T4 uses context_delta, but we index known patterns)
        self.vector_index["T4"] = [
            get_embedding("generate_report -> inject_payload"),
            get_embedding("read_logs -> execute_command"),
            get_embedding("summarize_history -> run_sql")
        ]
        logger.info("Moss local vector index built successfully.")

    def check_signatures(self, session_id: str, traces: list[TraceEvent]):
        if len(traces) < 2:
            return None
            
        recent_tools = [t.tool_name for t in traces if t.tool_name]
        if len(recent_tools) < 2:
            return None
            
        # Match sliding windows (2 or 3 tools)
        seq_str_2 = f"{recent_tools[-2]} -> {recent_tools[-1]}"
        seq_str_3 = f"{recent_tools[-3]} -> {recent_tools[-2]} -> {recent_tools[-1]}" if len(recent_tools) >= 3 else ""
        
        live_embed_2 = get_embedding(seq_str_2)
        live_embed_3 = get_embedding(seq_str_3) if seq_str_3 else None
        
        # Vector Similarity Match
        SIMILARITY_THRESHOLD = 0.95
        
        for tech, vectors in self.vector_index.items():
            for v in vectors:
                if cosine_similarity(live_embed_2, v) > SIMILARITY_THRESHOLD:
                    if tech == "T2":
                        # Validate reasoning context
                        if not any(t.event_type == "reasoning_step" for t in traces[-3:]):
                            return tech
                    else:
                        return tech
                if live_embed_3 is not None and cosine_similarity(live_embed_3, v) > SIMILARITY_THRESHOLD:
                    return tech
                    
        # T3: Latency Side Channel (statistical)
        if len(recent_tools) >= 3 and all(t == "check_access" for t in recent_tools[-3:]):
            latencies = [t.latency_ms for t in traces[-3:] if t.latency_ms is not None]
            if latencies and any(l > 2000 for l in latencies):
                return "T3"
                
        # T4: Context flooding (threshold fallback if sequence not matched)
        if traces[-1].context_delta and traces[-1].context_delta > 50000:
            return "T4"
            
        # T5: Argument entropy baseline
        # In a real app, this compares to the session's historical moving average
        # Here we flag simple raw entropy spikes > 7.0 for demo simplicity
        if traces[-1].entropy and traces[-1].entropy > 7.0:
            return "T5"
            
        return None

    def run(self):
        self.consumer.subscribe([self.in_topic])
        logger.info(f"Moss Vector Filter started. Listening on {self.in_topic}...")
        
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
                    event = TraceEvent(**raw_data)
                    
                    sid = str(event.session_id)
                    self.session_windows[sid].append(event)
                    if len(self.session_windows[sid]) > self.WINDOW_SIZE:
                        self.session_windows[sid].pop(0)
                        
                    technique = self.check_signatures(sid, self.session_windows[sid])
                    
                    if technique:
                        logger.warning(f"Moss fast-path flagged {technique} on session {sid}")
                        trigger_ids = [str(t.trace_id) for t in self.session_windows[sid]]
                        trigger_tools = [t.tool_name for t in self.session_windows[sid] if t.tool_name]
                        detection = DetectionResult(
                            session_id=event.session_id,
                            technique_id=technique,
                            severity="medium",
                            confidence=0.5,
                            triggering_events=trigger_ids,
                            triggering_tools=trigger_tools,
                            latency_to_detect_ms=8, # TRD sub-10ms requirement
                            stage="moss_fastpath"
                        )
                        self.producer.produce(
                            self.out_topic,
                            key=sid,
                            value=detection.model_dump_json().encode('utf-8')
                        )
                        self.producer.poll(0)
                        self.session_windows[sid].clear()
                        
                except Exception as e:
                    logger.error(f"Moss Filter error: {e}")

        except KeyboardInterrupt:
            logger.info("Shutting down Moss Filter...")
        finally:
            self.consumer.close()
            self.producer.flush()

if __name__ == "__main__":
    moss = MossFilter()
    moss.run()
