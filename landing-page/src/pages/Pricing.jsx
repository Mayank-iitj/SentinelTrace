import React from 'react';

const Pricing = () => {
  return (
    <div className="container mt-24 mb-24">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          Simple, <span className="serif-italic" style={{ color: 'var(--accent)' }}>transparent pricing</span>
        </h1>
      </div>

      <div className="flex gap-6" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Open Source */}
        <div className="glass-panel" style={{ flex: '1 1 300px', padding: '48px', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Open Source</h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px' }}>$0</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Self-hosted community edition.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', color: '#666' }}>
            <li>✓ Moss Filter Engine</li>
            <li>✓ Standard PyTorch Classifier</li>
            <li>✓ Community Support</li>
          </ul>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>View GitHub</button>
        </div>

        {/* Startup */}
        <div className="glass-panel" style={{ flex: '1 1 300px', padding: '48px', borderRadius: '24px', background: 'var(--bg-surface)', border: '2px solid var(--accent)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Most Popular</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--accent)' }}>Startup Cloud</h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px' }}>$99<span style={{ fontSize: '1rem', color: '#888', fontWeight: 400 }}>/mo</span></div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Fully managed infrastructure.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', color: '#666' }}>
            <li>✓ Fully managed Kafka Ingest</li>
            <li>✓ Live Real-Time Dashboard</li>
            <li>✓ 1M Traces / Month</li>
            <li>✓ Email Support</li>
          </ul>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Start Free Trial</button>
        </div>

        {/* Enterprise */}
        <div className="glass-panel" style={{ flex: '1 1 300px', padding: '48px', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Enterprise</h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px' }}>Custom</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>For large scale AI deployments.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', color: '#666' }}>
            <li>✓ VPC Peering & On-Prem</li>
            <li>✓ SIEM Export (Splunk/Elastic)</li>
            <li>✓ Custom Model Fine-Tuning</li>
            <li>✓ Dedicated SLA</li>
          </ul>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
