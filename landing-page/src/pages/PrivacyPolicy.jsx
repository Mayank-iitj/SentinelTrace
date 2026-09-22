import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mt-24 mb-24">
      <div className="glass-panel" style={{ padding: '64px', borderRadius: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '32px', color: 'var(--text-primary)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>Last updated: September 2026</p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          At SentinelTrace, accessible from localhost, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SentinelTrace and how we use it.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>Information we collect</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
