import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Shield, Eye } from 'lucide-react';

const features = [
  {
    title: "Zero-Latency Agent Monitoring",
    description: "Secures workflows via a decoupled Kafka event bus. Detection never blocks your agent's reasoning.",
    icon: <Zap size={24} color="var(--accent)" />,
    colSpan: 8,
  },
  {
    title: "Moss Vector Filter",
    description: "Sub-10ms filter that hashes and drops 90%+ of clean traces mathematically.",
    icon: <Activity size={24} color="#ff3366" />,
    colSpan: 4,
  },
  {
    title: "PyTorch ONNX Classifier",
    description: "Multi-task neural network identifies Technique ID and Threat Severity simultaneously.",
    icon: <Eye size={24} color="#00e676" />,
    colSpan: 5,
  },
  {
    title: "Auto-Remediation Kill Switch",
    description: "Isolate rogue sessions instantly from the live dashboard to stop Exfiltration in its tracks.",
    icon: <Shield size={24} color="#e65100" />,
    colSpan: 7,
  }
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="container mt-24 mb-24">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '16px' }} className="text-gradient">Engineered to perform.</h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
          A dual-stage detection engine that shifts the paradigm to active defense.
        </p>
      </div>

      <div className="bento-grid">
        {features.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            className="glass-panel bento-item"
            style={{ gridColumn: `span ${feature.colSpan}` }}
          >
            <div style={{ background: 'var(--bg-base)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
