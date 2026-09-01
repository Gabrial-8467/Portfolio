import crypto from 'node:crypto';

export const API_KEY_PREFIX = 'pk_';

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function generateApiKey() {
  const raw = crypto.randomBytes(24).toString('base64url');
  const key = `${API_KEY_PREFIX}${raw}`;
  return { key, prefix: key.slice(0, 10), keyHash: sha256(key) };
}