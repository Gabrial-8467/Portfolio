import { Router } from 'express';
import { verifyPassword, setAuthCookie, clearAuthCookie, isAuthenticated, ADMIN_USERNAME } from '../auth.js';

export function authRouter() {
  const router = Router();

  router.get('/status', (req, res) => {
    res.json({ authenticated: isAuthenticated(req) });
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (username !== ADMIN_USERNAME || !verifyPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    setAuthCookie(res);
    res.json({ authenticated: true });
  });

  router.post('/logout', (req, res) => {
    clearAuthCookie(res);
    res.json({ authenticated: false });
  });

  return router;
}
