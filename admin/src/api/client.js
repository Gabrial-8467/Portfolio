const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PORTFOLIO_SLUG = import.meta.env.VITE_PORTFOLIO_SLUG || 'gabrial-deora';

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

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
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

  return payload?.data;
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

  admin: {
    portfolios: () => api.get('/api/admin/portfolios', { auth: true }),
    users: () => api.get('/api/admin/users', { auth: true }),
  },
};