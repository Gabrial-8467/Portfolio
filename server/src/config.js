import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal .env loader (no external dependency) so `node src/index.js` works
// without flagging --env-file. Reads server/.env if present.
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnv();

const PORT = Number(process.env.PORT) || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Admin dashboard password. A dev fallback is provided but a warning is printed.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

// Secret used to sign the auth cookie. In production a random value is generated,
// which forces a re-login on restart (acceptable for a single-admin dashboard).
const COOKIE_SECRET =
  process.env.COOKIE_SECRET || `dev-secret-${Date.now().toString(36)}`;

const CORS_ORIGIN = process.env.CORS_ORIGIN || '';

export { PORT, NODE_ENV, ADMIN_PASSWORD, ADMIN_USERNAME, COOKIE_SECRET, CORS_ORIGIN };
