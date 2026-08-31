/**
 * Centralized API Endpoints Registry & Route Definitions
 * Details all public and protected routes for the portfolio backend.
 */

export const API_PREFIX = '/api';

export const ENDPOINTS = {
  HEALTH: '/api/health',
  AUTH: {
    PREFIX: '/api/auth',
    STATUS: '/api/auth/status',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  SITE: {
    PREFIX: '/api/site',
    ALL: '/api/site',
    BY_KEY: (key) => `/api/site/${encodeURIComponent(key)}`,
  },
  COLLECTIONS: {
    PROJECTS: '/api/projects',
    PROJECT_BY_ID: (id) => `/api/projects/${encodeURIComponent(id)}`,
    SKILLS: '/api/skills',
    SKILL_BY_ID: (id) => `/api/skills/${encodeURIComponent(id)}`,
    SERVICES: '/api/services',
    SERVICE_BY_ID: (id) => `/api/services/${encodeURIComponent(id)}`,
    EXPERIENCE: '/api/experience',
    EXPERIENCE_BY_ID: (id) => `/api/experience/${encodeURIComponent(id)}`,
    EDUCATION: '/api/education',
    EDUCATION_BY_ID: (id) => `/api/education/${encodeURIComponent(id)}`,
    ACHIEVEMENTS: '/api/achievements',
    ACHIEVEMENT_BY_ID: (id) => `/api/achievements/${encodeURIComponent(id)}`,
  },
  DASHBOARD: {
    HOME: '/dashboard',
    LOGIN: '/dashboard/login',
    ASSETS: '/dashboard/assets',
  },
};

/**
 * Route Documentation Table
 */
export const ROUTES_REGISTRY = [
  // Health & Server Status
  { method: 'GET', path: '/api/health', auth: false, desc: 'Health check & server diagnostics' },

  // Admin Authentication
  { method: 'GET', path: '/api/auth/status', auth: false, desc: 'Check if current session cookie is authenticated' },
  { method: 'POST', path: '/api/auth/login', auth: false, desc: 'Admin login (Rate-limited, sets signed httpOnly cookie)' },
  { method: 'POST', path: '/api/auth/logout', auth: false, desc: 'Admin logout (Clears authentication cookie)' },

  // Site Configuration & Singletons
  { method: 'GET', path: '/api/site', auth: false, desc: 'Fetch all site details and singleton blocks' },
  { method: 'GET', path: '/api/site/:key', auth: false, desc: 'Get specific singleton (site, socials, nav, stats, processSteps)' },
  { method: 'PUT', path: '/api/site/:key', auth: true, desc: 'Update specific singleton' },
  { method: 'DELETE', path: '/api/site/:key', auth: true, desc: 'Reset specific singleton' },

  // Projects Collection (CRUD)
  { method: 'GET', path: '/api/projects', auth: false, desc: 'List all featured portfolio projects' },
  { method: 'GET', path: '/api/projects/:id', auth: false, desc: 'Fetch single project by ID' },
  { method: 'POST', path: '/api/projects', auth: true, desc: 'Add new project' },
  { method: 'PUT', path: '/api/projects/:id', auth: true, desc: 'Update existing project' },
  { method: 'DELETE', path: '/api/projects/:id', auth: true, desc: 'Delete project by ID' },

  // Skills Collection (CRUD)
  { method: 'GET', path: '/api/skills', auth: false, desc: 'List all skill categories and items' },
  { method: 'GET', path: '/api/skills/:id', auth: false, desc: 'Fetch single skill category' },
  { method: 'POST', path: '/api/skills', auth: true, desc: 'Add new skill category' },
  { method: 'PUT', path: '/api/skills/:id', auth: true, desc: 'Update skill category' },
  { method: 'DELETE', path: '/api/skills/:id', auth: true, desc: 'Delete skill category' },

  // Services Collection (CRUD)
  { method: 'GET', path: '/api/services', auth: false, desc: 'List all services' },
  { method: 'GET', path: '/api/services/:id', auth: false, desc: 'Fetch single service' },
  { method: 'POST', path: '/api/services', auth: true, desc: 'Add new service' },
  { method: 'PUT', path: '/api/services/:id', auth: true, desc: 'Update service' },
  { method: 'DELETE', path: '/api/services/:id', auth: true, desc: 'Delete service' },

  // Experience Collection (CRUD)
  { method: 'GET', path: '/api/experience', auth: false, desc: 'List all work experience entries' },
  { method: 'GET', path: '/api/experience/:id', auth: false, desc: 'Fetch single experience entry' },
  { method: 'POST', path: '/api/experience', auth: true, desc: 'Add new experience entry' },
  { method: 'PUT', path: '/api/experience/:id', auth: true, desc: 'Update experience entry' },
  { method: 'DELETE', path: '/api/experience/:id', auth: true, desc: 'Delete experience entry' },

  // Education Collection (CRUD)
  { method: 'GET', path: '/api/education', auth: false, desc: 'List all education degrees and institutions' },
  { method: 'GET', path: '/api/education/:id', auth: false, desc: 'Fetch single education entry' },
  { method: 'POST', path: '/api/education', auth: true, desc: 'Add new education entry' },
  { method: 'PUT', path: '/api/education/:id', auth: true, desc: 'Update education entry' },
  { method: 'DELETE', path: '/api/education/:id', auth: true, desc: 'Delete education entry' },

  // Achievements Collection (CRUD)
  { method: 'GET', path: '/api/achievements', auth: false, desc: 'List all hackathons and achievements' },
  { method: 'GET', path: '/api/achievements/:id', auth: false, desc: 'Fetch single achievement' },
  { method: 'POST', path: '/api/achievements', auth: true, desc: 'Add new achievement' },
  { method: 'PUT', path: '/api/achievements/:id', auth: true, desc: 'Update achievement' },
  { method: 'DELETE', path: '/api/achievements/:id', auth: true, desc: 'Delete achievement' },
];
