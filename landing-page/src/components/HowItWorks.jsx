import React from 'react';
import { motion } from 'framer-motion';
import { Download, Server, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: <Download size={24} color="var(--accent)" />,
    title: "1. Install the Pipeline",
    description: "Deploy the SentinelTrace ONNX model and Kafka event bus alongside your existing agentic infrastructure."
  },
  {
    icon: <Server size={24} color="var(--accent)" />,
    title: "2. Route Agent Events",
    description: "Configure your LLM agents to broadcast their reasoning steps and action payloads to the SentinelTrace bus."
  },
  {
    icon: <ShieldCheck size={24} color="var(--accent)" />,
    title: "3. Active Defense",
    description: "The Moss filter and PyTorch classifier analyze every payload in < 10ms, blocking threats before execution."
  }
];

const HowItWorks = () => {
  return (
    <section className="container mt-24 mb-24">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Deployment in <span style={{ color: 'var(--accent)' }}>3 simple steps</span>
        </h2>
      </div>

      <div className="flex flex-col gap-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-panel flex items-center gap-6"
            style={{ padding: '32px' }}
          >
            <div style={{ minWidth: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {step.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
