import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Globe, Video, MessageSquare, Bot, Sparkles, Cpu, Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-section mt-24">
      {/* Background with Large Text */}
      <div className="footer-bg-container">
        
        {/* Floating White Card */}
        <div className="footer-card container glass-panel" style={{ background: '#ffffff', borderRadius: '32px', padding: '64px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
          
          {/* Top Row: Logo, Links, Socials */}
          <div className="flex" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px', marginBottom: '80px' }}>
            
            {/* Logo */}
            <div style={{ fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.02em', color: 'var(--text-primary)', alignSelf: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '8px' }}></div>
              SentinelTrace
            </div>

            {/* Links */}
            <div className="flex" style={{ flexWrap: 'wrap', gap: '64px' }}>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '20px', color: '#111', fontSize: '0.95rem' }}>Product</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: '#666', fontSize: '0.85rem' }}>
                  <li><a href="https://github.com/Mayank-iitj/SentinelTrace" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a></li>
                  <li><Link to="/active-defense" style={{ color: 'inherit', textDecoration: 'none' }}>Active Defense</Link></li>
                  <li><Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '20px', color: '#111', fontSize: '0.95rem' }}>Resources</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: '#666', fontSize: '0.85rem' }}>
                  <li><Link to="/docs" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</Link></li>
                  <li><Link to="/api" style={{ color: 'inherit', textDecoration: 'none' }}>API Spec</Link></li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '20px', color: '#111', fontSize: '0.95rem' }}>Company</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: '#666', fontSize: '0.85rem' }}>
                  <li><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link></li>
                  <li><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>

            {/* Socials */}
            {/* Removed social icons per request */}
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col items-center justify-center text-center">
            <h4 style={{ fontWeight: 600, marginBottom: '16px', color: '#111', fontSize: '0.95rem' }}>
              Request an AI summary of SentinelTrace
            </h4>
            {/* Removed AI icons per request */}
            <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 500 }}>
              ©SentinelTrace 2026. All rights reserved.
            </p>
          </div>
        </div>

        <div className="footer-large-text">SentinelTrace</div>
      </div>
    </footer>
  );
};

export default Footer;
