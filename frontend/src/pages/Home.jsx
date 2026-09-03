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
import SideRails from '../components/SideRails';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Hackathons from '../components/Hackathons';
import DeveloperSection from '../components/DeveloperSection';
import Contact from '../components/Contact';
import GenericSection from '../components/GenericSection';
import Footer from '../components/Footer';

export default function Home() {
  const [searchParams] = useSearchParams();
  const previewSlug = searchParams.get('preview');
  const previewApiKey = searchParams.get('apiKey');

  const data = usePortfolioData(previewSlug || undefined, previewApiKey || undefined);

  // Apply theme settings (accent color, border radius, font family) dynamically from admin CMS
  useEffect(() => {
    const config = data?.config || {};
    const root = document.documentElement;

    if (config.accentColor) {
      const color = config.accentColor;
      root.style.setProperty('--color-primary', color);
      root.style.setProperty('--color-primary-hover', color);
      root.style.setProperty('--color-primary-light', `${color}18`);
      root.style.setProperty('--color-primary-border', `${color}40`);
      root.style.setProperty('--shadow-glow', `0 0 40px ${color}33`);

      // Compute luminance to determine light or dark tone
      let r = 9, g = 13, b = 22;
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          r = parseInt(hex.substring(0, 2), 16);
          g = parseInt(hex.substring(2, 4), 16);
          b = parseInt(hex.substring(4, 6), 16);
        }
      } else if (color.startsWith('rgb')) {
        const parts = color.match(/\d+/g);
        if (parts && parts.length >= 3) {
          r = parseInt(parts[0], 10);
          g = parseInt(parts[1], 10);
          b = parseInt(parts[2], 10);
        }
      }

      // Check perceived luminance (0 to 1)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const isDarkTone = luminance < 0.5;

      // When the accent is dark (like #090d16), in dark mode provide an illuminated tint for cards/badges so it stays distinct
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
      if (isDarkTone && isDarkMode) {
        // Brighten accent in dark mode for high visibility
        root.style.setProperty('--color-primary', '#60a5fa');
        root.style.setProperty('--color-primary-hover', '#93c5fd');
        root.style.setProperty('--color-primary-light', 'rgba(96, 165, 250, 0.16)');
        root.style.setProperty('--color-primary-border', 'rgba(96, 165, 250, 0.3)');
      } else {
        root.style.setProperty('--color-primary', color);
        root.style.setProperty('--color-primary-hover', color);
        root.style.setProperty('--color-primary-light', `${color}18`);
        root.style.setProperty('--color-primary-border', `${color}40`);
      }
    }

    if (config.radius) {
      root.style.setProperty('--radius', config.radius);
      root.style.setProperty('--radius-sm', config.radius);
    }

    if (config.fontFamily) {
      root.style.setProperty('--font-heading', config.fontFamily);
      root.style.setProperty('--font-body', config.fontFamily);
    }
  }, [data?.config]);

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

    // Always guarantee Hero is first if not in rawSections
    const hasHeroInSections = rawSections.some((s) => {
      const k = (s.key || '').toLowerCase();
      return k === 'hero' || k === 'site';
    });
    if (!hasHeroInSections) {
      matchedKeys.add('hero');
      matchedKeys.add('site');
      orderedElements.push(SECTION_REGISTRY.hero());
    }

    // Keys that are purely data feeds for other components — these must NOT
    // render as standalone blocks to avoid duplication with Hero/About/Skills/etc.
    const DATA_ONLY_KEYS = new Set([
      'site',
      'socials',
      'stats',
      'processsteps',
      'process',
      'services',
      'education',
      'navlinks',
      'footernav',
    ]);

    rawSections.forEach((sec) => {
      const key = sec.key ? sec.key.toLowerCase() : '';
      if (!key || matchedKeys.has(key)) return;

      if (SECTION_REGISTRY[key]) {
        // Special case: if key is 'site', avoid rendering both 'site' and 'hero' duplicates
        if (key === 'site' && matchedKeys.has('hero')) return;
        if (key === 'hero' && matchedKeys.has('site')) return;
        // Special case: hackathons vs achievements
        if (key === 'achievements' && matchedKeys.has('hackathons')) return;
        if (key === 'hackathons' && matchedKeys.has('achievements')) return;

        matchedKeys.add(key);
        // Map 'achievements' key to 'hackathons' visual tracker
        if (key === 'achievements') matchedKeys.add('hackathons');
        if (key === 'hackathons') matchedKeys.add('achievements');
        if (key === 'site') matchedKeys.add('hero');
        if (key === 'hero') matchedKeys.add('site');

        orderedElements.push(SECTION_REGISTRY[key]());
        return;
      }

      // Unknown key: render it generically so no CMS section is ever lost.
      // Data-only helpers are excluded because they feed other components.
      if (!DATA_ONLY_KEYS.has(key)) {
        matchedKeys.add(key);
        orderedElements.push(<GenericSection key={`gen-${key}`} section={sec} />);
      }
    });

    // Ensure essential core sections are ALWAYS visible even if not explicitly defined in CMS sections list
    const CORE_FALLBACK_SEQUENCE = [
      { key: 'about', fn: SECTION_REGISTRY.about },
      { key: 'projects', fn: SECTION_REGISTRY.projects },
      { key: 'experience', fn: SECTION_REGISTRY.experience },
      { key: 'skills', fn: SECTION_REGISTRY.skills },
      { key: 'hackathons', fn: SECTION_REGISTRY.hackathons },
      { key: 'developer', fn: SECTION_REGISTRY.developer },
      { key: 'contact', fn: SECTION_REGISTRY.contact },
    ];

    CORE_FALLBACK_SEQUENCE.forEach(({ key, fn }) => {
      if (!matchedKeys.has(key)) {
        matchedKeys.add(key);
        orderedElements.push(fn());
      }
    });

    return orderedElements;
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