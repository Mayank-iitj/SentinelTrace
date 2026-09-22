import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "SentinelTrace completely transformed how we handle agent security. We caught a context flooding attempt within minutes of deployment.",
    author: "Security Lead, Enterprise AI"
  },
  {
    quote: "The sub-10ms latency is real. Our agents don't even notice the pipeline is there, but we sleep much better at night knowing we're protected.",
    author: "VP Engineering, YC Startup"
  }
];

const Testimonials = () => {
  return (
    <section className="container mt-24 mb-24">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Trusted by <span className="serif-italic" style={{ color: 'var(--accent)' }}>top teams</span>
        </h2>
      </div>
      
      <div className="flex gap-6" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        {testimonials.map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="glass-panel"
            style={{ flex: '1 1 400px', maxWidth: '500px' }}
          >
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.6 }}>
              "{t.quote}"
            </p>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              — {t.author}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
