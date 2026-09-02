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
const AUTH_CHANNEL = 'portfolio_auth_sync';

export function getToken() {
  if (typeof window === 'undefined') return null;
  const local = localStorage.getItem(TOKEN_KEY);
  if (local) return local;
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + TOKEN_KEY + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
  }
  return null;
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel(AUTH_CHANNEL);
        bc.postMessage({ type: 'AUTH_CHANGE', token });
        bc.close();
      } catch {
        /* ignore */
      }
    }
  } else {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel(AUTH_CHANNEL);
        bc.postMessage({ type: 'AUTH_CHANGE', token: null });
        bc.close();
      } catch {
        /* ignore */
      }
    }
  }
}

export const CMS_UPDATE_CHANNEL = 'portfolio_cms_updates';

export function notifyCmsUpdate(meta = {}) {
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(CMS_UPDATE_CHANNEL);
      bc.postMessage({ type: 'CONTENT_UPDATED', timestamp: Date.now(), ...meta });
      bc.close();
    } catch {
      /* ignore */
    }
  }
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
    create: async (data) => {
      const res = await api.post('/api/portfolios', data, { auth: true });
      notifyCmsUpdate({ action: 'create_portfolio' });
      return res;
    },
    update: async (id, data) => {
      const res = await api.put(`/api/portfolios/${id}`, data, { auth: true });
      notifyCmsUpdate({ action: 'update_portfolio' });
      return res;
    },
    remove: async (id) => {
      const res = await api.del(`/api/portfolios/${id}`, { auth: true });
      notifyCmsUpdate({ action: 'delete_portfolio' });
      return res;
    },
    getSettings: (id) => api.get(`/api/portfolios/${id}/settings`, { auth: true }),
    updateSettings: async (id, settings) => {
      const res = await api.put(`/api/portfolios/${id}/settings`, { settings }, { auth: true });
      notifyCmsUpdate({ action: 'update_settings' });
      return res;
    },
  },

  sections: {
    list: (portfolioId) => api.get(`/api/portfolios/${portfolioId}/sections`, { auth: true }),
    get: (portfolioId, sectionId) => api.get(`/api/portfolios/${portfolioId}/sections/${sectionId}`, { auth: true }),
    create: async (portfolioId, data) => {
      const res = await api.post(`/api/portfolios/${portfolioId}/sections`, data, { auth: true });
      notifyCmsUpdate({ action: 'create_section', sectionKey: data?.key });
      return res;
    },
    update: async (portfolioId, sectionId, data) => {
      const res = await api.put(`/api/portfolios/${portfolioId}/sections/${sectionId}`, data, { auth: true });
      notifyCmsUpdate({ action: 'update_section', sectionKey: data?.key });
      return res;
    },
    remove: async (portfolioId, sectionId) => {
      const res = await api.del(`/api/portfolios/${portfolioId}/sections/${sectionId}`, { auth: true });
      notifyCmsUpdate({ action: 'delete_section' });
      return res;
    },
    reorder: async (portfolioId, ids) => {
      const res = await api.put(`/api/portfolios/${portfolioId}/sections/order/reorder`, { ids }, { auth: true });
      notifyCmsUpdate({ action: 'reorder_sections' });
      return res;
    },
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