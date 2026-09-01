const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

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

export const api = {
  register: async (data) => {
    const res = await request('/api/auth/register', { method: 'POST', body: data });
    return res.data;
  },
  getHealth: async () => {
    return request('/health');
  },
  getPublicPortfolio: async (slug) => {
    return request(`/api/p/${slug}`);
  },
  getPublicSection: async (slug, key) => {
    return request(`/api/p/${slug}/section/${key}`);
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