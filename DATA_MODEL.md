# SentinelTrace — Data Model

## 1. Trace Event Schema

```json
{
  "trace_id": "uuid",
  "session_id": "uuid",
  "ts": "epoch_ms",
  "actor": "agent | subagent_id",
  "event_type": "tool_call | reasoning_step | output",
  "tool_name": "string",
  "tool_args_shape": {
    "type_signature": "string",
    "size_bytes": "int",
    "entropy": "float"
  },
  "latency_ms": "int",
  "prev_tool": "string | null",
  "context_window_delta": "int",
  "risk_labels": ["T1", "T2", "..."]
}
```
**Hard constraint:** `tool_args_shape` never contains raw argument values — type, size, and entropy only. This is enforced at the Trace Normalizer, not left to convention.

## 2. Detection Result Schema

```json
{
  "flag_id": "uuid",
  "session_id": "uuid",
  "technique_id": "T1 | T2 | T3 | T4 | T5",
  "severity": "low | medium | high",
  "confidence": "float (0-1, from classifier)",
  "triggering_events": ["trace_id_a", "trace_id_b"],
  "detected_at": "epoch_ms",
  "latency_to_detect_ms": "int",
  "stage": "moss_fastpath | classifier_confirmed"
}
```

## 3. Taxonomy Reference Table

| ID | Name | Trigger signal | Fields used |
|---|---|---|---|
| T1 | Privilege-escalation chaining | Tool sequence matches known escalation pattern | `tool_name`, `prev_tool` sequence window |
| T2 | Data exfil via tool combo | Read-type → outbound-type with no reasoning justification | `tool_name` pair, `event_type: reasoning_step` context |
| T3 | Latency side-channel probing | Timing variance above session baseline on repeated calls | `latency_ms` series |
| T4 | Context-window flooding | Abnormal token delta spike | `context_window_delta` |
| T5 | Argument entropy anomaly | Shape deviates from tool's session baseline | `tool_args_shape.entropy` |

## 4. Moss Index Structure

- **Signature index (seeded, static per run):** embeddings of known T1–T5 sequence patterns, built once at startup
- **Per-session baseline index (dynamic):** incrementally updated embeddings of each session's own tool-usage shape, used for T5 deviation matching — scoped per `session_id`, discarded at session end (no cross-session persistence in v1)

## 5. Kafka Topics

| Topic | Producer | Consumer |
|---|---|---|
| `agent.traces.raw` | Instrumented agent | Trace Normalizer |
| `agent.traces.normalized` | Trace Normalizer | Moss Fast-Path Filter |
| `agent.traces.flagged` | Moss Fast-Path Filter | ONNX Classifier |
| `agent.detections.confirmed` | ONNX Classifier | Dashboard, SIEM adapter |
