import React, { useState } from 'react';
import '../landing/landing.css';
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

export default function Landing() {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="land-page">
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