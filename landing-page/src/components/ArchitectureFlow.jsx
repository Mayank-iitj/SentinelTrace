import React from 'react';
import { motion } from 'framer-motion';

const ArchitectureFlow = () => {
  return (
    <section className="container mt-24 mb-24 text-center">
      <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Zero trust. <span className="serif-italic" style={{ color: 'var(--accent)' }}>Zero latency.</span>
      </h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '64px', maxWidth: '700px', margin: '0 auto 64px auto' }}>
        Security shouldn't block reasoning. We decouple detection from the agent loop via a high-speed event bus.
      </p>

      <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.03)' }}>
        
        <div className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
          
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="glass-panel" style={{ flex: 1, minWidth: '200px', padding: '24px' }}>
            <h4 style={{ fontWeight: 600, color: '#111' }}>Agent Runtime</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>Broadcasts raw JSON tool calls and reasoning steps asynchronously.</p>
          </motion.div>

          <div className="flex-center" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>→</div>

          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-panel" style={{ flex: 1, minWidth: '200px', padding: '24px', background: 'rgba(183, 0, 255, 0.03)' }}>
            <h4 style={{ fontWeight: 600, color: 'var(--accent)' }}>Moss Fast-Filter</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>Pseudo-vector sequence match. Drops 90% of clean traces in &lt;10ms.</p>
          </motion.div>

          <div className="flex-center" style={{ color: '#ff3366', fontWeight: 'bold' }}>→</div>

          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="glass-panel" style={{ flex: 1, minWidth: '200px', padding: '24px', background: 'rgba(255, 51, 102, 0.03)' }}>
            <h4 style={{ fontWeight: 600, color: '#ff3366' }}>ONNX Classifier</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>Multi-task PyTorch Neural Net confirms threat severity and technique ID.</p>
          </motion.div>

        </div>

        <motion.div 
          style={{ height: '4px', background: 'linear-gradient(90deg, #eaeaea 0%, var(--accent) 50%, #ff3366 100%)', marginTop: '40px', borderRadius: '4px' }}
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </section>
  );
};

export default ArchitectureFlow;
