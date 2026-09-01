const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

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
    throw new ApiError(payload?.error || `Request failed (${response.status})`, response.status);
  }

  return payload?.data;
}

export const api = {
  register: (data) => request('/api/auth/register', { method: 'POST', body: data }),
  getUrl: () => API_URL,
};

export const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174').replace(/\/$/, '');
export const PORTFOLIO_SLUG = import.meta.env.VITE_PORTFOLIO_SLUG || 'gabrial-deora';