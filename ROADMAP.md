# SentinelTrace — Roadmap

## Hackathon Build Order (24h)

| Hours | Milestone |
|---|---|
| 0–2 | Trace schema finalized; synthetic multi-tool agent harness with 3 scripted legit workflows |
| 2–5 | T1–T3 attack sequences scripted and injectable into the harness; raw traces flowing through Kafka |
| 5–9 | Moss index built and seeded with T1–T5 signatures; fast-path matching wired to live trace stream |
| 9–14 | Classifier ported/fine-tuned from `soc-log-classifier` checkpoint where architecture transfers; ONNX export; slow-path wired to Moss-flagged traces only |
| 14–18 | Dashboard built — live feed, technique cards, metrics strip, WebSocket push |
| 18–22 | Polish: add T4/T5 if time allows; stress-test false-positive rate across all 3 clean workflows; confirm zero false positives before freezing the build |
| 22–24 | Demo script rehearsal end-to-end (see `DEMO_SCRIPT.md`); record fallback capture; buffer |

## Post-Hackathon Roadmap (if pursued further)

**v1.1 — Hardening**
- Auth layer on dashboard/API
- Multi-tenant trace isolation
- Persistent Moss index sync via managed data layer (usemoss.dev) instead of local-only index

**v1.2 — Detection depth**
- Full T1–T5 coverage plus community-contributed technique signatures
- Multi-agent (A2A protocol) trace correlation, not just single-agent sessions
- Configurable enforcement mode (auto-block on high-severity flag, opt-in — currently advisory-only by design)

**v1.3 — Ecosystem**
- Drop-in SDK for common agent frameworks (LangChain, Claude Code, Mastra) — instrumentation as a one-line wrapper, not custom integration
- Public technique-signature registry (open, versioned) so the taxonomy grows the way MITRE ATT&CK does
- SIEM adapter parity: Splunk, Elasticsearch, QRadar (reusing existing SentinelNexus adapters), plus native export formats for common SOAR tools

## Explicit Non-Goals (carried forward from PRD)

Generalized zero-day anomaly detection, auto-remediation by default, and full production multi-tenancy remain out of scope until the roadmap items above are complete — stated here so scope doesn't silently creep mid-build.
