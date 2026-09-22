import React from 'react';

const ActiveDefense = () => {
  return (
    <div className="container mt-24 mb-24">
      <div className="hero-wrapper text-center" style={{ padding: '64px 24px', borderRadius: '32px', marginBottom: '64px', minHeight: 'auto' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>Active Defense</h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
          Stop relying on passive logging. Move to real-time agentic security.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '48px', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>The Moss Vector Filter</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          Traditional detection engines run deep learning models on every request, adding unacceptable latency to your agent loop. SentinelTrace solves this with the <strong>Moss Vector Filter</strong>.
        </p>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          By creating pseudo-vector embeddings of action sequences, Moss can mathematically verify and drop 90% of clean traces in under 10ms. Only ambiguous or anomalous sequences are forwarded to the heavy ONNX PyTorch classifier.
        </p>
        
        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '48px', marginBottom: '24px', color: 'var(--text-primary)' }}>ONNX PyTorch Classifier</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Our multi-task neural network doesn't just flag a binary "threat". It outputs the specific T1-T5 technique ID and a confidence severity score, giving your SOC operators exactly what they need to triage effectively.
        </p>
      </div>
    </div>
  );
};

export default ActiveDefense;
