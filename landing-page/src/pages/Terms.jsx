import React from 'react';

const Terms = () => {
  return (
    <div className="container mt-24 mb-24">
      <div className="glass-panel" style={{ padding: '64px', borderRadius: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '32px', color: 'var(--text-primary)' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>Last updated: September 2026</p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          These terms and conditions outline the rules and regulations for the use of SentinelTrace's Website.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>License</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          Unless otherwise stated, SentinelTrace and/or its licensors own the intellectual property rights for all material on SentinelTrace. All intellectual property rights are reserved. You may access this from SentinelTrace for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default Terms;
