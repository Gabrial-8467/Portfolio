import { useSearchParams } from 'react-router-dom';
import '../App.css';
import '../animations.css';
import '../mobile.css';

import { SOCIALS, NAV_LINKS, FOOTER_NAV } from '../data';
import { usePortfolioData } from '../hooks/usePortfolioData';

import CustomCursor from '../components/CustomCursor';
import ScrollProgress from '../components/ScrollProgress';
import Navbar from '../components/Navbar';
import SideRails from '../components/SideRails';
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
  const previewSlug = searchParams.get('preview');
  const previewApiKey = searchParams.get('apiKey');

  const data = usePortfolioData(previewSlug || undefined, previewApiKey || undefined);

  const navLinks = Array.isArray(data.navLinks) && data.navLinks.length ? data.navLinks : NAV_LINKS;
  const footerNav = Array.isArray(data.footerNav) && data.footerNav.length ? data.footerNav : FOOTER_NAV;
  const socials = Array.isArray(data.socials) && data.socials.length ? data.socials : SOCIALS;

  const isPreview = Boolean(previewSlug || previewApiKey);
  const previewFailed = isPreview && data.source === 'local' && Boolean(data.error);

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

  const SECTION_REGISTRY = {
    hero: () => <Hero key="hero" site={appData.site} />,
    site: () => <Hero key="site" site={appData.site} />,
    about: () => <About key="about" site={appData.site} socials={appData.socials} stats={appData.stats} />,
    projects: () => <Projects key="projects" projects={appData.projects} />,
    experience: () => <Experience key="experience" data={appData} />,
    skills: () => <Skills key="skills" skills={appData.skills} services={appData.services} />,
    hackathons: () => <Hackathons key="hackathons" achievements={appData.achievements} />,
    achievements: () => <Hackathons key="achievements" achievements={appData.achievements} />,
    developer: () => <DeveloperSection key="developer" site={appData.site} />,
    contact: () => <Contact key="contact" site={appData.site} />,
  };

  // Build rendered sections list based on admin panel's dynamic order
  const renderDynamicSections = () => {
    const rawSections = Array.isArray(data.sections) ? data.sections : [];

    // Filter to sections that have a matching visual component
    const matchedKeys = new Set();
    const orderedElements = [];

    rawSections.forEach((sec) => {
      const key = sec.key ? sec.key.toLowerCase() : '';
      if (SECTION_REGISTRY[key] && !matchedKeys.has(key)) {
        // Special case: if key is 'site', avoid rendering both 'site' and 'hero' duplicates
        if (key === 'site' && matchedKeys.has('hero')) return;
        if (key === 'hero' && matchedKeys.has('site')) return;
        // Special case: hackathons vs achievements
        if (key === 'achievements' && matchedKeys.has('hackathons')) return;
        if (key === 'hackathons' && matchedKeys.has('achievements')) return;

        matchedKeys.add(key);
        orderedElements.push(SECTION_REGISTRY[key]());
      }
    });

    // If API returned sections and we matched components, render in that dynamic order
    if (orderedElements.length > 0) {
      // If contact or developer or any section was not yet seeded/added, ensure essential contact is reachable if needed
      return orderedElements;
    }

    // Default static fallback when running purely local or no sections returned
    return [
      <Hero key="hero" site={appData.site} />,
      <About key="about" site={appData.site} socials={appData.socials} stats={appData.stats} />,
      <Projects key="projects" projects={appData.projects} />,
      <Experience key="experience" data={appData} />,
      <Skills key="skills" skills={appData.skills} services={appData.services} />,
      <Hackathons key="hackathons" achievements={appData.achievements} />,
      <DeveloperSection key="developer" site={appData.site} />,
      <Contact key="contact" site={appData.site} />,
    ];
  };

  return (
    <div className="portfolio-app-root">
      {previewFailed && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
            background: '#fee2e2',
            color: '#b91c1c',
            borderBottom: '1px solid #fecaca',
            padding: '10px 16px',
            fontSize: 13,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {data.error}
        </div>
      )}

      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Floating Island Navigation */}
      <Navbar site={appData.site} nav={appData.nav} />

      {/* Floating Left & Right Side Rails */}
      <SideRails site={appData.site} socials={appData.socials} />

      {/* Main Content Flow - Dynamically Ordered */}
      <main>
        {renderDynamicSections()}
      </main>

      {/* Minimal Footer */}
      <Footer site={appData.site} socials={appData.socials} nav={appData.footerNav} />
    </div>
  );
}