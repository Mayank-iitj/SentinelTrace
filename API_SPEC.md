# SentinelTrace — API Specification

## 1. Ingestion API

### `POST /v1/traces`
Ingest a single trace event (or batch) from an instrumented agent. Typically called via the Kafka producer SDK rather than direct HTTP in production, but exposed as REST for hackathon demo/testing convenience.

**Request body:** array of Trace Event objects (see `DATA_MODEL.md` §1)

**Response:** `202 Accepted`
```json
{ "accepted": 3, "session_id": "uuid" }
```

## 2. Detection Query API

### `GET /v1/sessions/{session_id}/status`
Returns current status of a session.
```json
{
  "session_id": "uuid",
  "status": "clean | flagged",
  "events_processed": 42,
  "flags": ["flag_id", "..."]
}
```

### `GET /v1/flags/{flag_id}`
Returns full detail of a single detection result (Detection Result schema, `DATA_MODEL.md` §2).

### `GET /v1/metrics`
Returns live aggregate metrics for the dashboard metrics strip.
```json
{
  "false_positive_rate": 0.0,
  "avg_detection_latency_ms": 38,
  "sessions_monitored": 4,
  "events_processed": 1204
}
```

## 3. Real-Time Feed (WebSocket)

### `WS /v1/feed`
Pushes detection events to the dashboard as they're confirmed by the classifier.

**Message format:**
```json
{
  "type": "flag_confirmed",
  "payload": { /* Detection Result object */ }
}
```
```json
{
  "type": "session_update",
  "payload": { "session_id": "uuid", "status": "clean" }
}
```

## 4. SIEM Export (stretch)

### `POST /v1/export/splunk` / `POST /v1/export/elastic`
Forwards a Detection Result to the configured SIEM adapter. Reuses existing adapter implementations from `soc-log-classifier` — same payload contract, new source tag (`sentineltrace-agent`).

## 5. Auth

Out of scope for hackathon build (per `ARCHITECTURE.md` §5 deployment scope) — noted here as a known gap for the post-hackathon roadmap, not silently omitted.
