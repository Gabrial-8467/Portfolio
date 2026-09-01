const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PORTFOLIO_SLUG = import.meta.env.VITE_PORTFOLIO_SLUG || 'gabrial-deora';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(path) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } });
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
  },
};