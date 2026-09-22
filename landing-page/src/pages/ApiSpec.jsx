import React from 'react';

const ApiSpec = () => {
  return (
    <div className="container mt-24 mb-24">
      <div className="hero-wrapper text-center" style={{ padding: '64px 24px', borderRadius: '32px', marginBottom: '64px', minHeight: 'auto' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>API Specification</h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
          REST and WebSocket endpoints for SentinelTrace.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '48px', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Ingestion API</h2>
        <div style={{ background: '#111', color: '#fff', padding: '16px 24px', borderRadius: '8px', marginBottom: '16px', fontFamily: 'monospace' }}>POST /v1/traces</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Ingest a single trace event (or batch) from an instrumented agent.</p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Detection Query API</h2>
        <div style={{ background: '#111', color: '#fff', padding: '16px 24px', borderRadius: '8px', marginBottom: '16px', fontFamily: 'monospace' }}>GET /v1/sessions/{'{'}session_id{'}'}/status</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Returns current status of a session.</p>

        <div style={{ background: '#111', color: '#fff', padding: '16px 24px', borderRadius: '8px', marginBottom: '16px', fontFamily: 'monospace' }}>GET /v1/metrics</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Returns live aggregate metrics for the dashboard metrics strip.</p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Real-Time Feed (WebSocket)</h2>
        <div style={{ background: '#111', color: '#fff', padding: '16px 24px', borderRadius: '8px', marginBottom: '16px', fontFamily: 'monospace' }}>WS /v1/feed</div>
        <p style={{ color: 'var(--text-secondary)' }}>Pushes detection events to the dashboard as they're confirmed by the classifier.</p>
      </div>
    </div>
  );
};

export default ApiSpec;
