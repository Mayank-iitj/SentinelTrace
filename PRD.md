# SentinelTrace — Product Requirements Document

**Project:** SentinelTrace (Agent SIEM) — a SentinelNexus product
**Track:** Agent Reliability, Security & Evaluation
**Owner:** Mayank Sharma
**Status:** Hackathon build

---

## 1. Problem

Agent traces — tool calls, reasoning steps, latency, argument shapes — are logged today but nobody runs detection on them the way a SOC runs detection on network logs. Every guardrail on the market inspects a single input/output pair. None correlate a *sequence* of actions across a session to catch a kill chain in progress.

Attacks that fall through this gap:
- Privilege escalation via chained, individually-benign tool calls
- Data exfiltration via unexpected tool combinations
- Latency-based side-channel probing
- Context-window flooding to bury an injection
- Argument-shape anomalies signaling encoded payloads

## 2. Goal

Ship a runtime detection layer that watches agent execution traces the way a SIEM watches network flow — correlating sequences, not single events — and flags known attack patterns in real time, with near-zero false positives on legitimate multi-tool workflows.

## 3. Non-Goals

- Not a prompt-injection text classifier (that's the crowded lane — explicitly avoided)
- Not a general-purpose observability/logging platform (traces are a means, not the product)
- Not model-agnostic guardrailing of model *outputs* — this watches *actions*, not text content
- No claim of catching zero-day attack patterns in v1 — detection is signature/sequence-based, not fully generalized anomaly detection

## 4. Users

| Persona | Need |
|---|---|
| AI platform security engineer | Needs to know when an agent deployed in production is being manipulated into an unintended action sequence |
| Agent framework maintainer | Wants a drop-in detection layer to offer users as a trust signal |
| Hackathon judge (YC track) | Needs to see a robust, differentiated, demoable security system in 24h |

## 5. Core Features (MoSCoW)

**Must have**
- Trace ingestion pipeline (tool call, timing, argument shape, reasoning-step metadata)
- Detection taxonomy: T1–T3 minimum (privilege escalation chaining, exfil combo, latency probing)
- Two-stage detection: Moss sequence-match (fast path) → classifier (slow path, selective)
- Live dashboard: real-time flagged-event feed with technique + severity + latency-to-detect
- Demo harness: scripted legit + attack agent workflows

**Should have**
- T4 (context flooding), T5 (argument entropy anomaly)
- SIEM export adapter (reuse existing Splunk/Elasticsearch adapter)
- False-positive rate displayed live against clean-run baseline

**Could have**
- Multi-agent (A2A) trace correlation, not just single-agent sessions
- Historical trace replay/search in dashboard
- Configurable severity thresholds per deployment

**Won't have (this cycle)**
- Fully generalized/unsupervised anomaly detection
- Production multi-tenant deployment
- Auto-remediation (blocking the agent action) — detection only, no enforcement, for v1

## 6. User Stories

- As a security engineer, I want to see which two tool calls triggered a flag, so I can verify the detection isn't a false positive in one glance.
- As a judge, I want to watch a live attack get caught with a visible latency number, so the "robust" claim is falsifiable in front of me.
- As a platform maintainer, I want the detector to run inline without materially slowing the agent loop, so adoption cost is near zero.

## 7. Success Metrics

| Metric | Target |
|---|---|
| Detection latency (flag to trace) | < 50 ms end-to-end (Moss fast path) |
| False positive rate on clean workflows | 0% across 3 scripted legit sessions |
| Attack techniques demoed live | ≥ 3 (T1–T3) |
| Classifier inference cost | Only triggered on Moss-flagged traces (not every event) |

## 8. Assumptions & Risks

| Assumption/Risk | Mitigation |
|---|---|
| No public malicious-agent-trace dataset exists | Synthesize via scripted injection into legit workflows — documented as a deliberate design choice, not a gap |
| Classifier architecture transfer from log classifier may not map 1:1 to trace schema | Budget re-training time in build order; fall back to rule-based T1–T3 matching if classifier slips |
| Demo depends on live injection working reliably | Rehearse the 3-min script end to end before pitch; have a recorded fallback |

## 9. Timeline

See `ROADMAP.md` for the hour-by-hour hackathon build order and post-hackathon plan.
