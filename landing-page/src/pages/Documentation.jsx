import React from 'react';

const Documentation = () => {
  return (
    <div className="container mt-24 mb-24">
      <div className="hero-wrapper text-center" style={{ padding: '64px 24px', borderRadius: '32px', marginBottom: '64px', minHeight: 'auto' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>Documentation</h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
          Learn how to deploy and configure the SentinelTrace pipeline.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '48px', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>1. System Architecture</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          SentinelTrace is built on a high-throughput, dual-stage pipeline designed to secure agentic workflows with zero trust and zero runtime latency. By decoupling the detection engine from the agent via a durable Kafka event bus, we ensure that security does not block agent reasoning.
        </p>
        
        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '48px', marginBottom: '24px', color: 'var(--text-primary)' }}>2. Threat Coverage (T1 - T5)</h2>
        <ul style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px', paddingLeft: '24px' }}>
          <li><strong>T1: Privilege Escalation</strong> - Chained tool sequences to elevate access.</li>
          <li><strong>T2: Data Exfiltration</strong> - Reading and sending data externally.</li>
          <li><strong>T3: Latency Side Channel</strong> - Repeated probing with abnormal latency variance.</li>
          <li><strong>T4: Context Flooding</strong> - Massive context deltas designed to bury malicious injections.</li>
          <li><strong>T5: Argument Entropy</strong> - Highly entropic payload signatures masking encoded shells.</li>
        </ul>
      </div>
    </div>
  );
};

export default Documentation;
