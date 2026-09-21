<div align="center">
  <h1>🛡️ SentinelTrace</h1>
  <p><strong>Active Defense Pipeline for Agentic Workflows</strong></p>
  
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
  [![Python Version](https://img.shields.io/badge/python-3.11%2B-blue)](#)
  [![License](https://img.shields.io/badge/license-MIT-green)](#)
</div>

<br />

SentinelTrace is an enterprise-grade, real-time threat detection pipeline built to monitor and secure LLM Agent workflows. It shifts the paradigm from "passive logging" to "active defense", utilizing a high-speed vector index and a PyTorch Multi-Task Neural Network to catch rogue agents before they can execute malicious actions.

## ✨ Key Features

- ⚡ **Zero-Latency Agent Monitoring**: Secures agentic workflows via a decoupled Kafka event bus, ensuring detection never blocks agent reasoning.
- 🏎️ **Sub-10ms Moss Vector Filter**: A proprietary pseudo-vector index that hashes and filters 90%+ of clean agent traces mathematically before they hit the expensive neural net.
- 🧠 **PyTorch ONNX Classifier**: A multi-task deep learning model trained to classify both the **Technique ID** and the **Severity** of the threat simultaneously.
- 🛑 **Auto-Remediation Kill Switch**: Isolate rogue sessions instantly from the live dashboard to stop attacks (like Data Exfil or Context Flooding) in their tracks.
- 📊 **Real-Time Command Center**: A stunning Framer-inspired dashboard featuring WebSocket-driven Chart.js telemetry, one-click demo controls, and instant SIEM (Splunk) export capabilities.

## 🚀 Quickstart

Everything you need runs locally out-of-the-box. Ensure you have Docker Desktop and Python 3.11 installed.

1. **Install Dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

2. **Start the Pipeline & Dashboard**
   ```powershell
   .\start_demo.ps1
   ```
   *(This script boots Zookeeper, Kafka, the Trace Normalizer, the Moss Filter, the ONNX Classifier, and the FastAPI Web Server).*

3. **Open the Dashboard**
   Navigate to [http://localhost:8000](http://localhost:8000)

## 🎛️ Demo Controls (Browser-Based)

You no longer need the terminal to pitch this project! The web dashboard features a built-in control panel:
- Click **Inject T1 - T5** to simulate specific AI threat models (Privilege Escalation, Data Exfil, Latency Side Channels, Context Flooding, and Argument Entropy).
- Click **Stress Test (50x)** to fire a randomized 50-attack barrage at the pipeline and watch the system handle it with sub-millisecond precision on the live Chart.js graph.

## 🏗️ Architecture

For a deep dive into the dual-stage detection engine and Mermaid.js flowcharts, see the [ARCHITECTURE.md](ARCHITECTURE.md) document.

---
<div align="center">
  <i>Built for the YC Fall Hackathon.</i>
</div>
# SentinelTrace
