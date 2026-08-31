import { Router } from 'express';
import { readDB, writeDB } from '../store.js';
import { getSchema, sanitizeRecord } from '../validate.js';

/**
 * Builds a REST router for a top-level array collection in the JSON store.
 *
 * GET endpoints are public (the portfolio frontend consumes them). Mutations
 * (POST/PUT/DELETE) require admin auth and validated, whitelisted payloads.
 *
 * @param {string} collection - Key of the array in the store.
 * @returns {Router}
 */
export function collectionRouter(collection, requireAuth) {
  const schema = getSchema(collection);
  if (!schema) throw new Error(`No schema defined for collection '${collection}'`);

  const router = Router();
  const pickId = (item) => item[schema.idField];

  const nextId = (db) => {
    const list = db[collection] ?? [];
    const max = list.reduce((m, item) => {
      const id = Number(item.id ?? item[schema.idField]);
      return Number.isFinite(id) && id > m ? id : m;
    }, 0);
    return max + 1;
  };

  // GET /api/<collection>
  router.get('/', async (_req, res, next) => {
    try {
      const db = await readDB();
      res.json(db[collection] ?? []);
    } catch (err) {
      next(err);
    }
  });

  // GET /api/<collection>/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const targetId = decodeURIComponent(req.params.id);
      const db = await readDB();
      const item = (db[collection] ?? []).find(
        (it) => String(pickId(it)) === targetId
      );
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  });

  // POST /api/<collection>  (protected)
  router.post('/', requireAuth, async (req, res, next) => {
    try {
      const { value, error } = sanitizeRecord(schema, req.body);
      if (error) return res.status(400).json({ error });
      
      const db = await readDB();
      if (value[schema.idField] === undefined) {
        value[schema.idField] = nextId(db);
      }
      
      const list = db[collection] ?? [];
      list.push(value);
      db[collection] = list;
      await writeDB(db);
      res.status(201).json(value);
    } catch (err) {
      next(err);
    }
  });

  // PUT /api/<collection>/:id  (protected)
  router.put('/:id', requireAuth, async (req, res, next) => {
    try {
      const targetId = decodeURIComponent(req.params.id);
      const db = await readDB();
      const list = db[collection] ?? [];
      const index = list.findIndex((it) => String(pickId(it)) === targetId);
      if (index === -1) return res.status(404).json({ error: 'Not found' });

      const { value, error } = sanitizeRecord(schema, req.body, { partial: true });
      if (error) return res.status(400).json({ error });

      const updated = { ...list[index], ...value };
      const cleaned = sanitizeRecord(schema, updated);
      if (cleaned.error) return res.status(400).json({ error: cleaned.error });

      list[index] = cleaned.value;
      db[collection] = list;
      await writeDB(db);
      res.json(list[index]);
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/<collection>/:id  (protected)
  router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      const targetId = decodeURIComponent(req.params.id);
      const db = await readDB();
      const list = db[collection] ?? [];
      const index = list.findIndex((it) => String(pickId(it)) === targetId);
      if (index === -1) return res.status(404).json({ error: 'Not found' });
      
      const [removed] = list.splice(index, 1);
      db[collection] = list;
      await writeDB(db);
      res.json(removed);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
