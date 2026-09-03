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

  // Build rendered sections list based on admin panel's dynamic order.
  // DB-backed sections (projects, skills, experience, ...) keep their admin-set
  // order. Fixed core sections that are not stored in the DB (about, developer,
  // contact) are inserted at natural positions instead of being pinned to the end.
  const renderDynamicSections = () => {
    const rawSections = Array.isArray(data.sections) ? data.sections : [];

    // Sections that have a dedicated visual component and can be ordered.
    const hasKey = (key) => rawSections.some((s) => (s.key || '').toLowerCase() === key);

    // Build the planned order of visible section keys, honoring the admin order.
    const planned = [];
    const isHero = (key) => key === 'hero' || key === 'site';
    const isHackathons = (key) => key === 'hackathons' || key === 'achievements';
    const seenHackathons = new Set();

    rawSections.forEach((sec) => {
      let key = (sec.key || '').toLowerCase();
      if (!key || !SECTION_REGISTRY[key]) return;

      // Normalize alias pairs so hero/site and hackathons/achievements are one.
      if (isHero(key)) key = 'hero';
      if (isHackathons(key)) {
        if (seenHackathons.has(key)) return;
        seenHackathons.add(key);
        key = 'hackathons';
      }
      if (planned.includes(key)) return;

      planned.push(key);
    });

    // Ensure the Hero is always the first section.
    if (!planned.includes('hero')) {
      if (hasKey('site') || hasKey('hero')) {
        planned.unshift('hero');
      }
    }

    // Ensure About always renders right after the Hero.
    if (!planned.includes('about')) {
      const heroIdx = planned.indexOf('hero');
      planned.splice(heroIdx < 0 ? 0 : heroIdx + 1, 0, 'about');
    }

    // Ensure Contact is always the last section and Developer sits before it.
    if (planned.includes('contact')) {
      const idx = planned.indexOf('contact');
      planned.splice(idx, 1);
      planned.push('contact');
    }
    if (!planned.includes('contact')) {
      planned.push('contact');
    }
    if (!planned.includes('developer')) {
      const contactIdx = planned.indexOf('contact');
      planned.splice(contactIdx, 0, 'developer');
    }

    // Any other core section the user may have intentionally hid should still
    // render only if it exists in the CMS. Map keys to components in final order.
    return planned.map((key) => SECTION_REGISTRY[key]());
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