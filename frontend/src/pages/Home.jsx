import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../App.css';
import '../animations.css';
import '../mobile.css';

import { SOCIALS, NAV_LINKS, FOOTER_NAV } from '../data';
import { usePortfolioData } from '../hooks/usePortfolioData';

import CustomCursor from '../components/CustomCursor';
import ScrollProgress from '../components/ScrollProgress';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Hackathons from '../components/Hackathons';
import DeveloperSection from '../components/DeveloperSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const [searchParams] = useSearchParams();
  const querySlug = searchParams.get('preview');
  const queryApiKey = searchParams.get('apiKey');

  useEffect(() => {
    if (querySlug) {
      try {
        localStorage.setItem('last_portfolio_slug', querySlug);
      } catch {
        /* ignore storage error */
      }
    }
    if (queryApiKey) {
      try {
        localStorage.setItem('portfolio_api_key', queryApiKey);
      } catch {
        /* ignore storage error */
      }
    }
  }, [querySlug, queryApiKey]);

  let storedSlug = null;
  let storedApiKey = null;
  try {
    storedSlug = typeof localStorage !== 'undefined' ? localStorage.getItem('last_portfolio_slug') : null;
    storedApiKey = typeof localStorage !== 'undefined' ? localStorage.getItem('portfolio_api_key') : null;
  } catch {
    storedSlug = null;
    storedApiKey = null;
  }

  const activeSlug = querySlug || storedSlug || undefined;
  const activeApiKey = queryApiKey || storedApiKey || undefined;
  const data = usePortfolioData(activeSlug, activeApiKey);

  const navLinks = Array.isArray(data.navLinks) && data.navLinks.length ? data.navLinks : NAV_LINKS;
  const footerNav = Array.isArray(data.footerNav) && data.footerNav.length ? data.footerNav : FOOTER_NAV;
  const socials = Array.isArray(data.socials) && data.socials.length ? data.socials : SOCIALS;

  const appData = {
    site: data.site,
    nav: navLinks,
    footerNav: footerNav,
    socials: socials,
    stats: data.stats,
    processSteps: data.processSteps,
    projects: data.projects,
    skills: data.skills,
    services: data.services,
    experience: data.experience,
    education: data.education,
    achievements: data.achievements,
  };

  return (
    <div className="portfolio-app-root">
      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Floating Island Navigation */}
      <Navbar site={appData.site} nav={appData.nav} />

      {/* Main Content Flow */}
      <main>
        <Hero site={appData.site} />
        <About site={appData.site} socials={appData.socials} stats={appData.stats} />
        <Projects projects={appData.projects} />
        <Experience data={appData} />
        <Skills skills={appData.skills} services={appData.services} />
        <Hackathons achievements={appData.achievements} />
        <DeveloperSection site={appData.site} />
        <Contact site={appData.site} />
      </main>

      {/* Minimal Footer */}
      <Footer site={appData.site} nav={appData.footerNav} />
    </div>
  );
}