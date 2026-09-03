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
  const [registerOpen, setRegisterOpen] = useState(false);

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

      <Navbar onOpenRegister={() => setRegisterOpen(true)} />
      <main>
        <Hero onOpenRegister={() => setRegisterOpen(true)} />
        <CmsDemo />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <DeveloperSection />
        <ApiDocsSection />
        <ApiPlayground />
        <ResponseExplorer />
        <Pricing onOpenRegister={() => setRegisterOpen(true)} />
        <FaqSection />
      </main>
      <Footer onOpenRegister={() => setRegisterOpen(true)} />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </div>
  );
}