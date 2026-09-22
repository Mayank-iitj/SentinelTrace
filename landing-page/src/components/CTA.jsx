import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const CTA = () => {
  return (
    <section className="container mt-24 mb-24">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="hero-wrapper text-center flex-col flex-center" 
        style={{ padding: '64px 40px', minHeight: 'auto', borderRadius: '32px' }}
      >
        <h2 style={{ fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Ready to secure your agents?
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px auto' }}>
          Deploy SentinelTrace today and shift your paradigm to active defense.
        </p>
        <a href="https://github.com/Mayank-iitj/SentinelTrace" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ color: '#000' }}>
          GitHub <Play size={16} fill="currentColor" />
        </a>
      </motion.div>
    </section>
  );
};

export default CTA;
