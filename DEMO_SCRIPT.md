# SentinelTrace — Demo Script

## Timing: 3 minutes demo + 2 minutes Q&A buffer

## 0:00–0:20 — Framing
"Every guardrail in this room inspects one input/output pair. That catches a single bad prompt. It doesn't catch a kill chain — a sequence of individually-innocent tool calls that add up to privilege escalation or data exfil. SentinelTrace is a SIEM for agents: it correlates sequences, the way a SOC correlates a kill chain, not a single request."

## 0:20–1:00 — Clean run
Start the scripted legitimate multi-tool agent workflow live. Dashboard shows green session status, metrics strip ticking (events processed, 0% false positive rate). Narrate briefly: "This is a normal task — multiple tool calls, nothing flagged."

## 1:00–1:50 — Live attack #1 (T1)
Trigger the scripted privilege-escalation injection. Dashboard animates a flag into view within the measured latency window. Point at: technique card (T1 — Privilege Escalation Chain), the exact two triggering tool calls highlighted, latency-to-detect counting in real time.
"That's under [X]ms from the second tool call to a confirmed flag — and it names exactly which two calls triggered it."

## 1:50–2:30 — Live attack #2 (T2)
Trigger the exfil-combo injection. Same flow, different technique card. Reinforces that this isn't a one-trick detector — it's a taxonomy.

## 2:30–3:00 — Close on architecture + numbers
"Two-stage pipeline: First, Moss does sub-10ms structural hashing and sequence matching, stripping sensitive raw JSON arguments on the fly and isolating only the anomalous shapes. Then, we use ONNX runtime to serve a real Random Forest classifier on the backend. This means the heavy ML only runs on the fraction of traces actually worth the compute. Zero false positives across our clean runs. This is infrastructure, not a demo toy — built to scale."

## Judge Q&A Prep

| Likely question | Answer |
|---|---|
| "How does this differ from a prompt-injection filter?" | Prompt filters inspect one turn. This correlates sequences across a whole session — it catches attacks that are invisible at the single-call level. |
| "What if the attack pattern isn't in your seed index?" | Honest limitation, stated up front: this is signature/sequence-based, not zero-day generalized detection. The taxonomy is designed to be extensible — new technique = new seeded signature, no re-architecture. |
| "Does this add latency to the agent?" | Detection runs async/parallel to the agent loop — it's advisory in v1, not blocking. Moss's sub-10ms fast path is specifically why this is viable inline at all. |
| "Why not just run the classifier on every event?" | Cost and latency — Moss eliminates the ~90% obviously-clean traffic so our ONNX model only spends compute on the ambiguous minority. That's the actual technical argument for "robust," not just "we threw an LLM at it." |
| "Is this production-ready?" | No — single-node, no auth, no multi-tenant isolation, stated explicitly as hackathon scope. Roadmap in `ROADMAP.md` covers the path to production. |

## Fallback

If live injection fails to trigger cleanly during the pitch, have a pre-recorded 30-second screen capture of a successful run ready to cut to — rehearsed as part of the demo, not an emergency-only asset.
