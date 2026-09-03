import React, { useState, useEffect } from 'react';
import '../landing/landing.css';
import CustomCursor from '../components/CustomCursor';
import ScrollProgress from '../components/ScrollProgress';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CmsDemo from '../components/CmsDemo';
import ProblemSolution from '../components/ProblemSolution';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import DeveloperSection from '../components/DeveloperSection';
import ApiDocsSection from '../components/ApiDocsSection';
import ApiPlayground from '../components/ApiPlayground';
import ResponseExplorer from '../components/ResponseExplorer';
import Pricing from '../components/Pricing';
import FaqSection from '../components/FaqSection';
import RegisterModal from '../components/RegisterModal';
import Footer from '../components/Footer';
import { setStoredToken } from '../api/client';

// Store OAuth token from URL before first render so useLandingAuth picks it up
let _preloadedApiKey = null;
let _preloadedIsNew = false;
try {
  const _params = new URLSearchParams(window.location.search);
  const _token = _params.get('token') || _params.get('oauth_token');
  if (_token) {
    setStoredToken(_token);
    _preloadedIsNew = _params.get('is_new') === 'true';
    _preloadedApiKey = _preloadedIsNew ? _params.get('api_key') : null;
    _params.delete('token');
    _params.delete('oauth_token');
    _params.delete('provider');
    _params.delete('is_new');
    _params.delete('api_key');
    const _clean = _params.toString() ? `?${_params.toString()}` : '';
    window.history.replaceState({}, document.title, window.location.pathname + _clean);
  }
} catch {
  /* ignore */
}

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'login' | 'register'
  const [oauthApiKey, setOauthApiKey] = useState(_preloadedApiKey);
  const [oauthIsNew, setOauthIsNew] = useState(_preloadedIsNew);

  const openRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  // Open modal for new OAuth users who just signed up
  useEffect(() => {
    if (_preloadedIsNew && _preloadedApiKey) {
      setAuthModalOpen(true);
    }
  }, []);

  return (
    <div className="land-page">
      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      <Navbar onOpenRegister={openRegister} onOpenLogin={openLogin} />
      <main>
        <Hero onOpenRegister={openRegister} />
        <CmsDemo />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <DeveloperSection />
        <ApiDocsSection />
        <ApiPlayground />
        <ResponseExplorer />
        <Pricing onOpenRegister={openRegister} />
        <FaqSection />
      </main>
      <Footer onOpenRegister={openRegister} />

      <RegisterModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => { setAuthModalOpen(false); setOauthApiKey(null); setOauthIsNew(false); }}
        oauthApiKey={oauthApiKey}
        isNewUser={oauthIsNew}
      />
    </div>
  );
}