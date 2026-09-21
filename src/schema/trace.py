from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from uuid import UUID, uuid4
import time

class ToolArgsShape(BaseModel):
    type_signature: str
    size_bytes: int
    entropy: float

class TraceEvent(BaseModel):
    trace_id: UUID = Field(default_factory=uuid4)
    session_id: UUID
    ts: int = Field(default_factory=lambda: int(time.time() * 1000))
    actor: str
    event_type: Literal["tool_call", "reasoning_step", "output"]
    tool_name: Optional[str] = None
    raw_args: Optional[dict] = None
    tool_args_shape: Optional[ToolArgsShape] = None
    latency_ms: Optional[int] = None
    prev_tool: Optional[str] = None
    context_window_delta: Optional[int] = None
    risk_labels: List[str] = Field(default_factory=list)

class DetectionResult(BaseModel):
    flag_id: UUID = Field(default_factory=uuid4)
    session_id: UUID
    technique_id: Literal["T1", "T2", "T3", "T4", "T5"]
    severity: Literal["low", "medium", "high"]
    confidence: float
    triggering_events: List[str]
    triggering_tools: List[str] = Field(default_factory=list)
    detected_at: int = Field(default_factory=lambda: int(time.time() * 1000))
    latency_to_detect_ms: int
    stage: Literal["moss_fastpath", "classifier_confirmed"]
