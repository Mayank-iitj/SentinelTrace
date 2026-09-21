# SentinelTrace — Technical Requirements Document

## 1. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Trace ingestion | Kafka | Reuses existing pattern from SOC log classifier — zero new infra learning curve |
| Fast-path sequence match | Moss (JS/Python SDK) | Sub-10ms local embed + retrieval, no vector DB round-trip |
| Slow-path classifier | DistilBERT/TinyBERT fine-tune, multi-task head (technique-ID + severity) | Direct transfer from shipped log classifier architecture |
| Model export/runtime | ONNX | Existing pipeline; fast inference, portable |
| Dashboard | Lightweight web frontend (React or plain HTML/WS) | Real-time feed is the core demo surface |
| SIEM export (stretch) | Splunk / Elasticsearch adapter | Reuse existing adapters as-is |

## 2. Detection Taxonomy — Technical Spec

| ID | Technique | Detection signal | Fast path (Moss) | Slow path (classifier) |
|---|---|---|---|---|
| T1 | Privilege-escalation chaining | Tool sequence `A→B→C` matches known escalation pattern | Embed sliding window of last N tool calls, match against seeded escalation-sequence index | Confirms severity/technique-type on flagged window |
| T2 | Data exfil via tool combo | Read-type tool immediately followed by outbound-type tool with no task justification in reasoning trace | Sequence match on read→outbound pairs | Validates against reasoning-step context |
| T3 | Latency side-channel probing | Repeated near-identical calls with timing variance above baseline | Statistical check on `latency_ms` series, not semantic — can run without Moss, but Moss indexes known probing timing signatures for pattern reuse | Classifies probing vs. legitimate retry |
| T4 | Context-window flooding | Abnormal `context_window_delta` spike per step | Threshold check + Moss match against known flood-then-inject patterns | Confirms injection payload presence in flagged step |
| T5 | Argument entropy anomaly | Tool argument shape (type/size/entropy) deviates from session's historical usage for that tool | Moss match against per-session baseline embedding | Classifies encoded-payload likelihood |

## 3. Model Requirements

- **Base:** DistilBERT or TinyBERT (reuse checkpoint/config from `soc-log-classifier` where architecture transfers)
- **Task:** multi-task — technique-ID (T1–T5) + severity (low/med/high), same paradigm as existing classifier
- **Training data:** synthetic — 3–4 scripted legitimate multi-tool agent workflows + programmatic injection of T1–T5 patterns at controlled rates. No public dataset exists for agent-trace attacks (unlike CICIDS/NSL-KDD for network logs), so synthesis is the documented approach, not a shortcut.
- **Export:** ONNX, matching existing pipeline for inference speed

## 4. Moss Integration Requirements

- Index built at startup from seeded T1–T5 signature sequences (embedded once, not per-request)
- Live trace windows embedded and matched sub-10ms per window
- Moss acts as **first-pass filter only** — classifier runs *only* on Moss-flagged traces, not on every tool call, to control inference cost
- Per-session baseline embeddings (for T5) stored/updated incrementally in Moss's local index — no external vector DB round trip

## 5. Trace Schema

See `DATA_MODEL.md` for full schema. Key constraint: tool argument *values* are never logged raw — only hashed/typed shape (type, size, entropy). This is a hard requirement, not optional, for both privacy and to keep embeddings fast and small.

## 6. Performance Requirements

| Requirement | Target |
|---|---|
| Fast-path (Moss) match latency | < 10 ms |
| End-to-end detection latency (ingest → flag) | < 50 ms |
| Classifier invocation rate | Only on Moss-flagged traces (target: <10% of total trace volume in clean sessions) |
| Dashboard update latency | Real-time (WebSocket push, no polling) |

## 7. Non-Functional Requirements

- **Privacy:** no raw tool-argument values logged or embedded — shape only
- **Inline operation:** detection must not materially add latency to the agent's own tool-call loop (target: detection runs async/parallel to agent execution, not blocking)
- **Extensibility:** taxonomy (T1–T5) must be addable-to without re-architecting — new technique = new seeded Moss signature + optional classifier label

## 8. Testing Requirements

- Zero false positives across all 3 scripted legitimate workflows (hard success criterion, not aspirational)
- Each of T1–T3 (minimum) must trigger correctly on injected test cases, with the exact triggering tool-call pair surfaced in the flag
- Latency-to-detect must be measured and displayed, not estimated, in the demo
