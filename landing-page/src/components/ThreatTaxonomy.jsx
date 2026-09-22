import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Fingerprint, Clock, Layers, Binary } from 'lucide-react';

const threats = [
  { id: "T1", title: "Privilege Escalation", desc: "Chained tool sequences designed to elevate access (e.g., list_users -> assume_role).", icon: <ShieldAlert size={20} color="#ff3366" /> },
  { id: "T2", title: "Data Exfiltration", desc: "Reading sensitive internal data and transmitting it externally without valid reasoning steps.", icon: <Fingerprint size={20} color="#ff3366" /> },
  { id: "T3", title: "Latency Side Channel", desc: "Repeated API probing with abnormal latency variance (>5000ms) to infer database states.", icon: <Clock size={20} color="#ff3366" /> },
  { id: "T4", title: "Context Flooding", desc: "Massive context deltas (>50k chars) designed to bury malicious prompt injections.", icon: <Layers size={20} color="#ff3366" /> },
  { id: "T5", title: "Argument Entropy", desc: "Highly entropic payload signatures masking Base64 encoded shells or obfuscated code.", icon: <Binary size={20} color="#ff3366" /> }
];

const ThreatTaxonomy = () => {
  return (
    <section className="container mt-24 mb-24">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Mathematically verified against <br/> <span className="serif-italic" style={{ color: 'var(--accent)' }}>5 threat vectors</span>
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0 auto' }}>
          Our classification models are trained to catch specific sequences of malicious behavior.
        </p>
      </div>

      <div className="flex flex-col gap-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {threats.map((threat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-panel flex items-center gap-6"
            style={{ padding: '24px 32px', borderRadius: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 51, 102, 0.05)' }}>
              {threat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--accent)', marginRight: '12px', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(183, 0, 255, 0.1)' }}>{threat.id}</span>
                {threat.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{threat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ThreatTaxonomy;
