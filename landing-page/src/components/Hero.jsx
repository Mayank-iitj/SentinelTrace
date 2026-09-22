import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="container mt-6 mb-24">
      <div className="hero-wrapper flex-center flex-col text-center" style={{ minHeight: '75vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '800px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h1 style={{ fontSize: '5.5rem', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '24px', textAlign: 'center', width: '100%' }}>
            <span className="text-gradient">Secure your</span> <span className="serif-italic" style={{ color: '#ffb3ff' }}>best agents</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            The top 1% of AI deployments don't rely on passive logging. They use an <strong style={{ color: '#fff', fontWeight: 600 }}>Active Defense Pipeline</strong>. SentinelTrace catches rogue agents before they act.
          </p>

          <div className="flex gap-4 items-center justify-center">
            <a href="https://github.com/Mayank-iitj/SentinelTrace" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ color: '#000' }}>
              GitHub <Play size={16} fill="currentColor" />
            </a>
            <a href="#features" className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              See how it works
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
