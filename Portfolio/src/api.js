import { useState, useEffect } from 'react';
import {
  projects as fallbackProjects,
  skills as fallbackSkills,
  services as fallbackServices,
  experience as fallbackExperience,
  education as fallbackEducation,
  achievements as fallbackAchievements,
  SITE as fallbackSite,
  CONTACT as fallbackContact,
  SOCIALS as fallbackSocials,
  NAV_LINKS as fallbackNav,
  STATS as fallbackStats,
  PROCESS_STEPS as fallbackSteps,
} from './data';
import { ENDPOINTS } from './endpoints';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// Normalized default shape, derived from local data so the UI renders without a backend.
const fallbackData = {
  site: {
    name: fallbackSite.name,
    heroBadge: 'Full Stack',
    heroTitle: 'Building Web Apps That Actually Perform',
    heroBgText: 'Developer',
    heroBio: "I'm Gabrial Deora, a Full Stack Web Developer with hands-on internship experience building responsive, high-performance web applications.",
    avatarUrl: '/hero.png',
    aboutTitle: 'The Developer Shaping Modern Web Experiences',
    aboutDesc1: "I'm a dynamic Full Stack Web Developer with strong internship experience in crafting responsive and high-performance web applications. I specialize in React.js, Node.js, and MongoDB.",
    aboutDesc2: "My commitment is to enhancing user experience through clean, scalable code and modern design. I'm passionate about leveraging technology to tackle real-world challenges and continuously improving code quality.",
    bio: 'A passionate Full Stack Web Developer with hands-on experience in building responsive, scalable web applications using the MERN stack.',
    copyright: fallbackSite.copyright,
    phone: fallbackContact.phone,
    phoneHref: fallbackContact.phoneHref,
    email: fallbackContact.email,
    emailHref: fallbackContact.emailHref,
    github: 'https://github.com/Gabrial-8467',
  },
  nav: fallbackNav,
  socials: fallbackSocials,
  stats: fallbackStats,
  processSteps: fallbackSteps,
  projects: fallbackProjects,
  skills: fallbackSkills,
  services: fallbackServices,
  experience: fallbackExperience,
  education: fallbackEducation,
  achievements: fallbackAchievements,
};

/**
 * Loads all portfolio content from the backend API once.
 * Falls back to local static data when the API is unavailable.
 */
export function usePortfolioData() {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [
          siteConfig,
          projects, skills, services, experience, education, achievements,
        ] = await Promise.all([
          fetchJson(ENDPOINTS.SITE),
          fetchJson(ENDPOINTS.PROJECTS),
          fetchJson(ENDPOINTS.SKILLS),
          fetchJson(ENDPOINTS.SERVICES),
          fetchJson(ENDPOINTS.EXPERIENCE),
          fetchJson(ENDPOINTS.EDUCATION),
          fetchJson(ENDPOINTS.ACHIEVEMENTS),
        ]);

        if (!active) return;

        const { site, nav, socials, stats, processSteps } = siteConfig || {};

        setData({
          site: {
            ...fallbackData.site,
            ...(site || {}),
          },
          nav: Array.isArray(nav) && nav.length ? nav : fallbackData.nav,
          socials: Array.isArray(socials) && socials.length ? socials : fallbackData.socials,
          stats: Array.isArray(stats) && stats.length ? stats : fallbackData.stats,
          processSteps: Array.isArray(processSteps) && processSteps.length ? processSteps : fallbackData.processSteps,
          projects: Array.isArray(projects) ? projects : fallbackData.projects,
          skills: Array.isArray(skills) ? skills : fallbackData.skills,
          services: Array.isArray(services) ? services : fallbackData.services,
          experience: Array.isArray(experience) ? experience : fallbackData.experience,
          education: Array.isArray(education) ? education : fallbackData.education,
          achievements: Array.isArray(achievements) ? achievements : fallbackData.achievements,
        });
      } catch {
        // Keep the fallback data
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
