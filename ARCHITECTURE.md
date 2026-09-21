# SentinelTrace — Architecture

SentinelTrace is built on a high-throughput, dual-stage pipeline designed to secure agentic workflows with **zero trust** and **zero runtime latency**. By decoupling the detection engine from the agent via a durable event bus, we ensure that security does not block agent reasoning.

## 1. System Diagram

```mermaid
flowchart TD
    classDef agent fill:#1a1a1a,stroke:#333,stroke-width:2px,color:#fff
    classDef pipeline fill:#1f6feb,stroke:#000,stroke-width:2px,color:#fff
    classDef detection fill:#ff3333,stroke:#000,stroke-width:2px,color:#fff
    classDef dashboard fill:#2ea043,stroke:#000,stroke-width:2px,color:#fff

    subgraph Agent Runtime
        A[Instrumented AI Agent\n(Tool Calls, Reasoning, Output)]:::agent
    end

    subgraph Streaming Ingest
        K[(Kafka Event Bus\nagent.traces.raw)]:::pipeline
    end

    subgraph Pipeline Services
        N[Trace Normalizer\n(Schema Enforce, Hash Args)]:::pipeline
        M{Moss Fast-Path Filter\n(Pseudo-Vector Sequence Match\n<10ms Latency)}:::detection
        C[ONNX PyTorch Classifier\n(Multi-Task: Technique + Severity)]:::detection
    end

    subgraph Security Operations
        D[Framer-Style Dashboard\n(React/FastAPI WebSockets)]:::dashboard
        S[SIEM / Splunk Export]:::dashboard
        LLM[LLM Analyst\n(Automated Threat Summaries)]:::dashboard
    end

    A -- "Raw JSON Traces" --> K
    K --> N
    N -- "Normalized JSON" --> M
    M -- "If Flagged (Clean Dropped)" --> C
    C -- "Confirmed Alert JSON" --> D
    D -- "Live Render" --> LLM
    D -. "Manual/Auto Export" .-> S
```

## 2. Component Breakdown

| Component | Responsibility | Technical Implementation |
|---|---|---|
| **Trace Normalizer** | Enforce schema, strip raw argument values, compute shape/entropy. | FastAPI / Python Pydantic |
| **Kafka Pipeline** | Durable ingest, decouples agent runtime from detection. | Confluent Kafka & Zookeeper (Docker) |
| **Moss Filter** | Seeded signature index + pseudo-vector embeddings for sub-10ms sequence matching. | Python + NumPy Hashing Vectors |
| **ONNX Classifier** | Selective severity/technique confirmation. | PyTorch Multi-Task Neural Net (`.onnx`) |
| **Dashboard** | Live flagged-event feed, Live Chart.js metrics, Kill-Switch API. | FastAPI + WebSockets + Vanilla HTML/CSS/JS |
| **SIEM Adapter** | Push flagged events to Splunk/Elasticsearch. | REST HTTP Post Endpoint |

## 3. Two-Stage Detection Rationale

> [!TIP]
> **Why Two Stages?** Running a deep learning classifier (or an LLM) on every single tool call is wasteful and adds unacceptable latency/cost to the agent loop. 

Moss’s job is to cheaply eliminate the ~90%+ of traces that are obviously clean using ultra-fast vector math (`sub-10ms`). This guarantees the expensive ONNX PyTorch Classifier only spends compute on the ambiguous minority. This mirrors the design principle of a Tier 1 SOC (cheap signature match before expensive behavioral analysis).

## 4. Threat Coverage (T1 - T5)

The pipeline is mathematically verified against 5 distinct agentic threat vectors:

1. **T1: Privilege Escalation**: Chained tool sequences to elevate access (`list_users -> assume_role`).
2. **T2: Data Exfiltration**: Reading and sending data externally without reasoning.
3. **T3: Latency Side Channel**: Repeated probing with abnormal latency variance (`> 5000ms`).
4. **T4: Context Flooding**: Massive context deltas (`> 50,000 chars`) designed to bury malicious injections.
5. **T5: Argument Entropy**: Highly entropic payload signatures masking Base64 encoded shells.

## 5. Failure Modes & Resilience

> [!WARNING]
> **Known Limitations (Hackathon Scope)**
> - **Kafka lag/backpressure**: Acceptable for demo scope — not solved in v1.
> - **Zero-Day Novel Attacks**: Moss is a signature/sequence-based detection engine. Truly novel sequences require classifier updates.
> - **False Positives**: Dashboard shows classifier confidence, not just binary flags, so an operator can triage effectively.
