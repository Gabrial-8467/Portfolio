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

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'login' | 'register'

  const openRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  // Sync token if redirected to landing with ?token=... or ?oauth_token=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const incomingToken = params.get('token') || params.get('oauth_token');
      if (incomingToken) {
        setStoredToken(incomingToken);
        params.delete('token');
        params.delete('oauth_token');
        params.delete('provider');
        const cleanSearch = params.toString() ? `?${params.toString()}` : '';
        window.history.replaceState({}, document.title, window.location.pathname + cleanSearch);
      }
    } catch {
      /* ignore */
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
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}