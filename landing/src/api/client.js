const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export { API_URL };

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const reqHeaders = { Accept: 'application/json', ...headers };
  if (body !== undefined && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  let response;
  const startTime = performance.now();
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: reqHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Network error — could not reach the API at ' + API_URL, 0);
  }
  const latency = Math.round(performance.now() - startTime);

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(payload?.error || `Request failed (${response.status})`, response.status, payload?.details);
  }

  return { data: payload?.data ?? payload, status: response.status, latency, payload };
}

export const TOKEN_KEY = 'portfolio_admin_token';
export const AUTH_CHANNEL = 'portfolio_auth_sync';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  const local = localStorage.getItem(TOKEN_KEY);
  if (local) return local;
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + TOKEN_KEY + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
  }
  return null;
}

export function setStoredToken(token) {
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

export const api = {
  register: async (data) => {
    const res = await request('/api/auth/register', { method: 'POST', body: data });
    return res.data;
  },
  getMe: async (token) => {
    const reqToken = token || getStoredToken();
    if (!reqToken) return null;
    const res = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${reqToken}` },
    });
    return res.data;
  },
  getHealth: async () => {
    return request('/health');
  },
  getPortfolioByKey: async (apiKey) => {
    return request('/api/v1/portfolio', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  },
  getSectionByKey: async (apiKey, key) => {
    return request(`/api/v1/section/${key}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  },
  rawRequest: async (path, options) => {
    return request(path, options);
  },
  getUrl: () => API_URL,
};

export const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174').replace(/\/$/, '');
export const FRONTEND_URL = (import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
export const PORTFOLIO_SLUG = import.meta.env.VITE_PORTFOLIO_SLUG || 'gabrial-deora';