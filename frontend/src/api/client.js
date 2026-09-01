const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = baseApiUrl.replace(/\/+$/, '');
export const API_KEY = import.meta.env.VITE_API_KEY || '';

export const PORTFOLIO_SLUG = import.meta.env.VITE_PORTFOLIO_SLUG || 'gabrial-deora';

export function resolveAssetUrl(url) {
  if (!url) return '/hero.png';
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
    return url;
  }
  return `/${url}`;
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(path, { apiKey = API_KEY } = {}) {
  const headers = { Accept: 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { headers });
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
    throw new ApiError(payload?.error || `Request failed (${response.status})`, response.status, payload?.details);
  }

  return payload?.data;
}

export const api = {
  public: {
    getPortfolio: (slug) => request(`/api/p/${slug}`),
    getSection: (slug, key) => request(`/api/p/${slug}/section/${key}`),
    getPortfolioByKey: (apiKey) => request('/api/v1/portfolio', { apiKey }),
    getSectionByKey: (key, apiKey) => request(`/api/v1/section/${key}`, { apiKey }),
  },
};