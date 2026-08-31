import { Router } from 'express';
import { readDB, writeDB } from '../store.js';
import { isSingleton, sanitizeSingleton } from '../validate.js';

const SINGLETONS = ['site', 'socials', 'nav', 'stats', 'processSteps'];

/**
 * Router for singleton config blocks. Public GETs, protected writes.
 * The key is strictly whitelisted so the collection store cannot be
 * overwritten through this route.
 */
export function siteRouter(requireAuth) {
  const router = Router();

  // GET /api/site  (all singletons)
  router.get('/', async (_req, res, next) => {
    try {
      const db = await readDB();
      const out = {};
      for (const key of SINGLETONS) {
        out[key] = db[key] ?? null;
      }
      res.json(out);
    } catch (err) {
      next(err);
    }
  });

  // GET /api/site/:key
  router.get('/:key', async (req, res, next) => {
    try {
      if (!isSingleton(req.params.key)) {
        return res.status(404).json({ error: 'Not found' });
      }
      const db = await readDB();
      res.json(db[req.params.key] ?? null);
    } catch (err) {
      next(err);
    }
  });

  // PUT /api/site/:key  (protected)
  router.put('/:key', requireAuth, async (req, res, next) => {
    try {
      if (!isSingleton(req.params.key)) {
        return res.status(404).json({ error: 'Not found' });
      }
      const { value, error } = sanitizeSingleton(req.params.key, req.body);
      if (error) return res.status(400).json({ error });

      const db = await readDB();
      const current = db[req.params.key] ?? (req.params.key === 'site' ? {} : []);
      // For 'site', merge over existing so partial edits keep other fields.
      if (req.params.key === 'site') {
        db.site = { ...(db.site ?? {}), ...value };
      } else {
        db[req.params.key] = value;
      }
      await writeDB(db);
      res.json(db[req.params.key]);
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/site/:key  (protected) — resets a singleton to its default
  router.delete('/:key', requireAuth, async (req, res, next) => {
    try {
      if (!isSingleton(req.params.key)) {
        return res.status(404).json({ error: 'Not found' });
      }
      const db = await readDB();
      const defaultValue = req.params.key === 'site' ? {} : [];
      db[req.params.key] = defaultValue;
      await writeDB(db);
      res.json(db[req.params.key]);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
