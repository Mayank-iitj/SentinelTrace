import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const IntegrationSnippet = () => {
  const code = `
import { Agent } from 'langchain/agents';
import { SentinelTraceObserver } from '@sentineltrace/sdk';

// 1. Initialize the non-blocking observer
const sentinel = new SentinelTraceObserver({
  broker: 'kafka://internal-cluster:9092',
  clientId: 'agent-prod-1'
});

// 2. Attach to your agent framework
const agent = await Agent.initialize({
  llm: model,
  tools: tools,
  callbacks: [sentinel.getCallbackHandler()]
});

// The agent runs at full speed.
// Traces are routed to the pipeline asynchronously.
`.trim();

  return (
    <section className="container mt-24 mb-24">
      <div className="flex" style={{ gap: '64px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '24px' }}>
            Two lines of code. <br/> <span className="serif-italic" style={{ color: 'var(--accent)' }}>End-to-end security.</span>
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            We provide drop-in callback handlers for LangChain, LlamaIndex, and AutoGen. The integration sits completely out-of-band so your production workloads never experience a latency penalty.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ flex: '1 1 500px' }}>
          <div style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 24px', background: '#1a1a1a', borderBottom: '1px solid #333' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              <div style={{ marginLeft: '12px', color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={14} /> integration.ts
              </div>
            </div>
            <div style={{ padding: '32px 24px', overflowX: 'auto' }}>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: 1.6, color: '#e6e6e6' }}>
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default IntegrationSnippet;
