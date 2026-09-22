import React from 'react';
import { motion } from 'framer-motion';

const Statement = () => {
  return (
    <section className="container text-center mt-24 mb-24" style={{ maxWidth: '900px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 style={{ fontSize: '3rem', fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--text-secondary)' }}>
          Agentic workflows operate at machine speed. 
          <br/>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>If you wait for logs to index, you've already lost the data.</span>
        </h2>
      </motion.div>
    </section>
  );
};

export default Statement;
