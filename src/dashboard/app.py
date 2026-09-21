import asyncio
import json
import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from confluent_kafka import Consumer, Producer
from openai import AsyncOpenAI
import uuid
import sys
import asyncio
from src.harness.agent import SyntheticAgent
from src.ingest.kafka_producer import TraceProducer

load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")
openai_client = AsyncOpenAI(api_key=api_key) if api_key else None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SentinelTrace Dashboard")
app.mount("/static", StaticFiles(directory="src/dashboard/static"), name="static")

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")

manager = ConnectionManager()

# Global State for API
session_status = {}
flags_db = {}
metrics_db = {
    "false_positive_rate": 0.0,
    "avg_detection_latency_ms": 0,
    "sessions_monitored": 0,
    "events_processed": 0,
    "_total_latency": 0,
    "_total_flags": 0
}

kafka_producer = Producer({'bootstrap.servers': 'localhost:9092', 'client.id': 'dashboard-api'})

class ExportPayload(BaseModel):
    flag_id: str

@app.get("/")
async def get():
    return FileResponse("src/dashboard/static/index.html")

@app.post("/v1/traces")
async def ingest_traces(traces: list[dict]):
    accepted = 0
    sid = None
    for trace in traces:
        sid = trace.get("session_id")
        metrics_db["events_processed"] += 1
        if sid not in session_status:
            session_status[sid] = {"session_id": sid, "status": "clean", "events_processed": 0, "flags": []}
            metrics_db["sessions_monitored"] += 1
        
        session_status[sid]["events_processed"] += 1
        
        kafka_producer.produce(
            "agent.traces.raw",
            key=str(sid),
            value=json.dumps(trace).encode('utf-8')
        )
        accepted += 1
    
    kafka_producer.poll(0)
    return {"accepted": accepted, "session_id": sid}

@app.get("/v1/sessions/{session_id}/status")
async def get_session_status(session_id: str):
    return session_status.get(session_id, {"session_id": session_id, "status": "unknown"})

@app.post("/v1/sessions/{session_id}/isolate")
async def isolate_session(session_id: str):
    if session_id in session_status:
        session_status[session_id]["status"] = "isolated"
    payload = {"type": "remediate", "session_id": session_id}
    await manager.broadcast(json.dumps(payload))
    return {"status": "isolated"}

@app.get("/v1/flags/{flag_id}")
async def get_flag(flag_id: str):
    return flags_db.get(flag_id, {})

@app.get("/v1/metrics")
async def get_metrics():
    return {
        "false_positive_rate": metrics_db["false_positive_rate"],
        "avg_detection_latency_ms": metrics_db["avg_detection_latency_ms"],
        "sessions_monitored": metrics_db["sessions_monitored"],
        "events_processed": metrics_db["events_processed"]
    }

@app.post("/v1/export/splunk")
async def export_splunk(payload: ExportPayload):
    logger.info(f"Exported flag {payload.flag_id} to Splunk.")
    await asyncio.sleep(0.5) # Simulate SIEM ingestion delay
    return {"status": "exported", "message": "Successfully ingested into SIEM"}

def run_attack_task(technique_id: str):
    try:
        producer = TraceProducer()
        agent = SyntheticAgent(producer)
        if technique_id == "T1":
            agent.run_attack_t1()
        elif technique_id == "T2":
            agent.run_attack_t2()
        elif technique_id == "T3":
            agent.run_attack_t3()
        elif technique_id == "T4":
            agent.run_attack_t4()
        elif technique_id == "T5":
            agent.run_attack_t5()
        elif technique_id == "50x":
            for _ in range(10):
                agent.run_attack_t1()
                agent.run_attack_t2()
                agent.run_attack_t3()
                agent.run_attack_t4()
                agent.run_attack_t5()
        producer.flush()
    except Exception as e:
        logger.error(f"Error triggering attack: {e}")

@app.post("/v1/demo/attack/{technique_id}")
async def trigger_attack(technique_id: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_attack_task, technique_id)
    return {"status": f"injected {technique_id} in background"}

@app.websocket("/v1/feed")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def generate_llm_analysis(flag_id: str, technique: str, tools: list):
    if not openai_client:
        return
    try:
        tools_str = " -> ".join(tools) if tools else "Unknown"
        prompt = f"Analyze this AI agent kill chain. Threat: {technique}. Tool sequence: {tools_str}. Provide a concise 2-sentence threat summary explaining the probable intent and a recommended remediation."
        
        response = await openai_client.chat.completions.create(
            model="gpt-5-nano",
            messages=[
                {"role": "system", "content": "You are an expert AI SOC Analyst specializing in agentic workflows."},
                {"role": "user", "content": prompt}
            ]
        )
        
        analysis = response.choices[0].message.content
        payload = {"type": "analysis", "flag_id": flag_id, "text": analysis}
        await manager.broadcast(json.dumps(payload))
    except Exception as e:
        logger.error(f"LLM Error: {e}")

def get_kafka_consumer():
    consumer = Consumer({
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'dashboard-group',
        'auto.offset.reset': 'earliest'
    })
    consumer.subscribe(["agent.detections.confirmed"])
    return consumer

async def consume_kafka_loop():
    consumer = get_kafka_consumer()
    logger.info("Dashboard Kafka consumer started...")
    try:
        while True:
            msg = await asyncio.to_thread(consumer.poll, 0.1)
            if msg is None:
                await asyncio.sleep(0.1)
                continue
            if msg.error():
                logger.error(f"Kafka error: {msg.error()}")
                continue
            
            raw_data = msg.value().decode('utf-8')
            parsed = json.loads(raw_data)
            flag_id = parsed.get("flag_id", str(uuid.uuid4()))
            sid = parsed.get("session_id")
            
            # Update State
            flags_db[flag_id] = parsed
            if sid not in session_status:
                session_status[sid] = {"session_id": sid, "status": "flagged", "events_processed": 0, "flags": []}
                metrics_db["sessions_monitored"] += 1
            session_status[sid]["status"] = "flagged"
            session_status[sid]["flags"].append(flag_id)
            
            metrics_db["_total_flags"] += 1
            latency = parsed.get("latency_to_detect_ms", 10)
            metrics_db["_total_latency"] += latency
            metrics_db["avg_detection_latency_ms"] = int(metrics_db["_total_latency"] / metrics_db["_total_flags"])
            
            # WebSocket Broadcast
            alert_payload = {"type": "alert", "data": parsed}
            await manager.broadcast(json.dumps(alert_payload))
            
            # LLM Trigger
            asyncio.create_task(
                generate_llm_analysis(flag_id, parsed.get("technique_id"), parsed.get("triggering_tools", []))
            )
            
    except Exception as e:
        logger.error(f"Kafka consume loop error: {e}")
    finally:
        consumer.close()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(consume_kafka_loop())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
