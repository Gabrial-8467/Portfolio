export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PORTFOLIO_SLUG = import.meta.env.VITE_PORTFOLIO_SLUG || 'gabrial-deora';

export const FRONTEND_URL = (import.meta.env.VITE_FRONTEND_URL || import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000').replace(/\/$/, '');

export function resolveAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }
  if (url.startsWith('uploads/')) {
    return `${API_URL}/${url}`;
  }
  if (url.startsWith('/')) {
    return `${API_URL}${url}`;
  }
  return `${API_URL}/${url}`;
}

export function getPublicPortfolioUrl(slug) {
  if (!slug) return FRONTEND_URL;
  return `${FRONTEND_URL}/?preview=${slug}`;
}

const TOKEN_KEY = 'portfolio_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const hdrs = { Accept: 'application/json', ...headers };
  if (body !== undefined) hdrs['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) hdrs.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: hdrs,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Network error — could not reach the API', 0);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || `Request failed (${response.status})`;
    throw new ApiError(message, response.status, payload?.details);
  }

  return payload?.data ?? payload;
}

export const api = {
  get: (path, opts) => request(path, opts),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts) => request(path, { method: 'PUT', body, ...opts }),
  del: (path, opts) => request(path, { method: 'DELETE', ...opts }),

  auth: {
    login: (email, password) => api.post('/api/auth/login', { email, password }),
    register: (data) => api.post('/api/auth/register', data),
    me: () => api.get('/api/auth/me', { auth: true }),
  },

  public: {
    getPortfolio: (slug) => api.get(`/api/p/${slug}`),
    getSection: (slug, key) => api.get(`/api/p/${slug}/section/${key}`),
  },

  portfolios: {
    list: () => api.get('/api/portfolios', { auth: true }),
    get: (id) => api.get(`/api/portfolios/${id}`, { auth: true }),
    create: (data) => api.post('/api/portfolios', data, { auth: true }),
    update: (id, data) => api.put(`/api/portfolios/${id}`, data, { auth: true }),
    remove: (id) => api.del(`/api/portfolios/${id}`, { auth: true }),
    getSettings: (id) => api.get(`/api/portfolios/${id}/settings`, { auth: true }),
    updateSettings: (id, settings) => api.put(`/api/portfolios/${id}/settings`, { settings }, { auth: true }),
  },

  sections: {
    list: (portfolioId) => api.get(`/api/portfolios/${portfolioId}/sections`, { auth: true }),
    get: (portfolioId, sectionId) => api.get(`/api/portfolios/${portfolioId}/sections/${sectionId}`, { auth: true }),
    create: (portfolioId, data) => api.post(`/api/portfolios/${portfolioId}/sections`, data, { auth: true }),
    update: (portfolioId, sectionId, data) => api.put(`/api/portfolios/${portfolioId}/sections/${sectionId}`, data, { auth: true }),
    remove: (portfolioId, sectionId) => api.del(`/api/portfolios/${portfolioId}/sections/${sectionId}`, { auth: true }),
    reorder: (portfolioId, ids) => api.put(`/api/portfolios/${portfolioId}/sections/order/reorder`, { ids }, { auth: true }),
  },

  apiKeys: {
    list: () => api.get('/api/api-keys', { auth: true }),
    create: (portfolioId, name) => api.post('/api/api-keys', { portfolioId, name }, { auth: true }),
    revoke: (id) => api.del(`/api/api-keys/${id}`, { auth: true }),
  },

  uploads: {
    uploadFile: async (file) => {
      const form = new FormData();
      form.append('file', file);
      const headers = { Accept: 'application/json' };
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;

      let response;
      try {
        response = await fetch(`${API_URL}/api/uploads`, { method: 'POST', headers, body: form });
      } catch {
        throw new ApiError('Network error — could not reach the API', 0);
      }

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new ApiError(payload?.error || `Upload failed (${response.status})`, response.status);
      }

      return payload?.data ?? payload;
    },
    deleteFile: (filename) => api.del(`/api/uploads/${encodeURIComponent(filename)}`, { auth: true }),
  },

  admin: {
    portfolios: () => api.get('/api/admin/portfolios', { auth: true }),
    users: () => api.get('/api/admin/users', { auth: true }),
  },
};