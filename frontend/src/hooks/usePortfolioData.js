import { useEffect, useReducer, useCallback } from 'react';
import { api, API_KEY, PORTFOLIO_SLUG, CMS_UPDATE_CHANNEL } from '../api/client';
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
  const lower = key.toLowerCase();
  const found = sections.find((s) => s.key?.toLowerCase() === lower);
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

export function usePortfolioData(slug, customApiKey) {
  const targetSlug = slug || PORTFOLIO_SLUG;
  const effectiveApiKey = customApiKey || API_KEY;
  const [state, dispatch] = useReducer(reducer, { ...initialState, slug: targetSlug });

  const load = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });

    if (!effectiveApiKey) {
      dispatch({
        type: 'FETCH_ERROR',
        error: 'Missing API key. Set VITE_API_KEY in your .env file to fetch live portfolio content.',
      });
      return;
    }

    try {
      const portfolio = await api.portfolio.get(effectiveApiKey);
      const sections = portfolio?.sections || [];
      const siteContent = sectionValue(sections, 'site', {});
      const site = { ...SITE, ...siteContent };

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          slug: portfolio?.slug || targetSlug,
          site,
          socials: sectionValue(sections, 'socials', []),
          navLinks: sectionValue(
            sections,
            'navLinks',
            siteContent?.navLinks || []
          ),
          footerNav: sectionValue(
            sections,
            'footerNav',
            siteContent?.footerNav || []
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
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        error: err.message || 'Could not reach the Content API with the provided API key.',
      });
    }
  }, [targetSlug, effectiveApiKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    // Re-fetch when switching back to this tab
    const handleFocus = () => {
      load();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        load();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen to real-time updates broadcasted by Admin CMS
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel(CMS_UPDATE_CHANNEL);
        bc.onmessage = () => {
          load();
        };
      } catch {
        /* ignore */
      }
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (bc) bc.close();
    };
  }, [load]);

  return { ...state, refetch: load };
}