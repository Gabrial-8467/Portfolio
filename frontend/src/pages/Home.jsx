import { useSearchParams } from 'react-router-dom';
import '../App.css';
import '../animations.css';
import '../mobile.css';

import { SOCIALS, NAV_LINKS, FOOTER_NAV } from '../data';
import { usePortfolioData } from '../hooks/usePortfolioData';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Hackathons from '../components/Hackathons';
import Footer from '../components/Footer';

export default function Home() {
  const [searchParams] = useSearchParams();
  const previewSlug = searchParams.get('preview');
  const data = usePortfolioData(previewSlug);

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
    <div className="layout-container">
      <Navbar site={appData.site} nav={appData.nav} />
      <main>
        <Hero site={appData.site} />
        <About socials={appData.socials} site={appData.site} />
        <Experience data={appData} />
        <Projects projects={appData.projects} site={appData.site} />
        <Skills services={appData.services} skills={appData.skills} />
        <Hackathons achievements={appData.achievements} site={appData.site} />
      </main>
      <Footer site={appData.site} nav={appData.footerNav} />
    </div>
  );
}