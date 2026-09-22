import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ActiveDefense from './pages/ActiveDefense';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import ApiSpec from './pages/ApiSpec';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function App() {
  return (
    <>
      <div className="ambient-glow" />
      
      {/* Navbar */}
      <nav className="container flex items-center" style={{ justifyContent: 'space-between', padding: '24px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '8px' }}></div>
            SentinelTrace
          </div>
        </Link>
        <a href="https://github.com/Mayank-iitj/SentinelTrace" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          GitHub
        </a>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/active-defense" element={<ActiveDefense />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/api" element={<ApiSpec />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
