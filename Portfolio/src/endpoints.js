/**
 * Frontend API Endpoints Configuration
 * Centralized endpoint route paths and URL builders for the React application.
 */

export const RENDER_URL = 'https://portfolio-2qra.onrender.com';
export const API_BASE = import.meta.env.VITE_API_URL || `${RENDER_URL}/api`;

export const ENDPOINTS = {
  HEALTH: `${API_BASE}/health`,
  SITE: `${API_BASE}/site`,
  SITE_KEY: (key) => `${API_BASE}/site/${encodeURIComponent(key)}`,
  PROJECTS: `${API_BASE}/projects`,
  PROJECT_BY_ID: (id) => `${API_BASE}/projects/${encodeURIComponent(id)}`,
  SKILLS: `${API_BASE}/skills`,
  SKILL_BY_ID: (id) => `${API_BASE}/skills/${encodeURIComponent(id)}`,
  SERVICES: `${API_BASE}/services`,
  SERVICE_BY_ID: (id) => `${API_BASE}/services/${encodeURIComponent(id)}`,
  EXPERIENCE: `${API_BASE}/experience`,
  EXPERIENCE_BY_ID: (id) => `${API_BASE}/experience/${encodeURIComponent(id)}`,
  EDUCATION: `${API_BASE}/education`,
  EDUCATION_BY_ID: (id) => `${API_BASE}/education/${encodeURIComponent(id)}`,
  ACHIEVEMENTS: `${API_BASE}/achievements`,
  ACHIEVEMENT_BY_ID: (id) => `${API_BASE}/achievements/${encodeURIComponent(id)}`,
  AUTH: {
    STATUS: `${API_BASE}/auth/status`,
    LOGIN: `${API_BASE}/auth/login`,
    LOGOUT: `${API_BASE}/auth/logout`,
  },
};
