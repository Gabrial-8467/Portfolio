export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PORTFOLIO_SLUG = import.meta.env.VITE_PORTFOLIO_SLUG || 'gabrial-deora';

export const ADMIN_API_KEY = (import.meta.env.VITE_ADMIN_API_KEY || '').trim();

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

const API_KEY_STORE = 'portfolio_admin_api_key';
const ACTIVE_PORTFOLIO_KEY = 'portfolio_active_id';

export function getActivePortfolioId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PORTFOLIO_KEY) || null;
}

export function getApiKey() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORE) || null;
}

export function setApiKey(key) {
  if (typeof window === 'undefined') return;
  if (key) {
    localStorage.setItem(API_KEY_STORE, key);
  } else {
    localStorage.removeItem(API_KEY_STORE);
  }
}

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

async function request(path, { method = 'GET', body, auth = false, apiKey = false, headers = {} } = {}) {
  const hdrs = { Accept: 'application/json', ...headers };
  if (body !== undefined) hdrs['Content-Type'] = 'application/json';
  if (apiKey) {
    const key = typeof apiKey === 'string' ? apiKey : getApiKey() || ADMIN_API_KEY;
    if (key) {
      hdrs.Authorization = `Bearer ${key}`;
    } else {
      const token = getToken();
      if (token) {
        hdrs.Authorization = `Bearer ${token}`;
        const pid = getActivePortfolioId();
        if (pid) hdrs['X-Portfolio-Id'] = pid;
      }
    }
  } else if (auth) {
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

  portfolios: {
    list: () => api.get('/api/portfolios', { auth: true }),
    get: () => api.get('/api/v1/portfolio/full', { apiKey: true }),
    update: async (data) => {
      const res = await api.put('/api/v1/portfolio', data, { apiKey: true });
      notifyCmsUpdate({ action: 'update_portfolio' });
      return res;
    },
    getSettings: () => api.get('/api/v1/portfolio/settings', { apiKey: true }),
    updateSettings: async (settings) => {
      const res = await api.put('/api/v1/portfolio/settings', { settings: settings.settings ?? settings }, { apiKey: true });
      notifyCmsUpdate({ action: 'update_settings' });
      return res;
    },
  },

  sections: {
    list: () => api.get('/api/v1/sections', { apiKey: true }),
    get: (key) => api.get(`/api/v1/section/${key}`, { apiKey: true }),
    create: async (data) => {
      const res = await api.post('/api/v1/section', data, { apiKey: true });
      notifyCmsUpdate({ action: 'create_section', sectionKey: data?.key });
      return res;
    },
    update: async (key, data) => {
      const res = await api.put(`/api/v1/section/${key}`, data, { apiKey: true });
      notifyCmsUpdate({ action: 'update_section', sectionKey: data?.key || key });
      return res;
    },
    remove: async (key) => {
      const res = await api.del(`/api/v1/section/${key}`, { apiKey: true });
      notifyCmsUpdate({ action: 'delete_section' });
      return res;
    },
    reorder: async (ids) => {
      const res = await api.put('/api/v1/sections/reorder', { ids }, { apiKey: true });
      notifyCmsUpdate({ action: 'reorder_sections' });
      return res;
    },
  },

  apiKeys: {
    list: () => api.get('/api/v1/api-keys', { apiKey: true }),
    create: (name) => api.post('/api/v1/api-keys', { name }, { apiKey: true }),
    revoke: (id) => api.del(`/api/v1/api-keys/${id}`, { apiKey: true }),
  },

  uploads: {
    uploadFile: async (file) => {
      const form = new FormData();
      form.append('file', file);
      const headers = { Accept: 'application/json' };
      const key = getApiKey() || ADMIN_API_KEY;
      if (key) {
        headers.Authorization = `Bearer ${key}`;
      } else {
        const token = getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          const pid = getActivePortfolioId();
          if (pid) headers['X-Portfolio-Id'] = pid;
        }
      }

      let response;
      try {
        response = await fetch(`${API_URL}/api/v1/upload`, { method: 'POST', headers, body: form });
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
    deleteFile: (filename) => api.del(`/api/v1/upload/${encodeURIComponent(filename)}`, { apiKey: true }),
  },
};