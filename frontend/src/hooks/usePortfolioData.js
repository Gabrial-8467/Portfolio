import { useEffect, useReducer } from 'react';
import { api, API_KEY, PORTFOLIO_SLUG } from '../api/client';
import {
  SITE,
  STATS,
  PROCESS_STEPS,
  projects as localProjects,
  skills as localSkills,
  services as localServices,
  experience as localExperience,
  education as localEducation,
  achievements as localAchievements,
} from '../data';

const initialState = {
  isLoading: true,
  error: null,
  source: 'local',
  slug: PORTFOLIO_SLUG,
  site: SITE,
  socials: [],
  navLinks: [],
  footerNav: [],
  stats: STATS,
  processSteps: PROCESS_STEPS,
  projects: localProjects,
  skills: localSkills,
  services: localServices,
  experience: localExperience,
  education: localEducation,
  achievements: localAchievements,
};

function sectionValue(sections, key, fallback) {
  if (!Array.isArray(sections)) return fallback;
  const found = sections.find((s) => s.key === key);
  return found && found.content !== null && found.content !== undefined ? found.content : fallback;
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, error: null, source: 'api', ...action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.error, source: 'local' };
    default:
      return state;
  }
}

export function usePortfolioData(slug = PORTFOLIO_SLUG) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      dispatch({ type: 'FETCH_START' });
      try {
        const portfolio = API_KEY ? await api.public.getPortfolioByKey() : await api.public.getPortfolio(slug);
        if (cancelled) return;

        const sections = portfolio?.sections || [];
        const site = { ...SITE, ...sectionValue(sections, 'site', {}) };

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            slug: portfolio?.slug || slug,
            site,
            socials: sectionValue(sections, 'socials', []),
            navLinks: sectionValue(
              sections,
              'navLinks',
              sectionValue(sections, 'site', {})?.navLinks || []
            ),
            footerNav: sectionValue(
              sections,
              'footerNav',
              sectionValue(sections, 'site', {})?.footerNav || []
            ),
            stats: sectionValue(sections, 'stats', STATS),
            processSteps: sectionValue(sections, 'processSteps', PROCESS_STEPS),
            projects: sectionValue(sections, 'projects', localProjects),
            skills: sectionValue(sections, 'skills', localSkills),
            services: sectionValue(sections, 'services', localServices),
            experience: sectionValue(sections, 'experience', localExperience),
            education: sectionValue(sections, 'education', localEducation),
            achievements: sectionValue(sections, 'achievements', localAchievements),
          },
        });
      } catch {
        if (cancelled) return;
        dispatch({
          type: 'FETCH_ERROR',
          error: `Could not reach the API — showing local content for "${slug}".`,
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}