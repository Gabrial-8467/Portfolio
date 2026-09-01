import { ApiError } from './errorHandler.js';

const str = (v, max = 500) => {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  if (s.length > max) throw new ApiError(400, `String exceeds max length ${max}`);
  return s;
};

const strArr = (v, maxItems = 50, maxItemLen = 200) => {
  if (v === undefined || v === null) return undefined;
  if (!Array.isArray(v)) {
    if (typeof v === 'string') return v ? [v.trim()] : [];
    throw new ApiError(400, 'Expected an array');
  }
  if (v.length > maxItems) throw new ApiError(400, `Array exceeds max items ${maxItems}`);
  return v
    .map((item) => String(item).trim())
    .filter(Boolean)
    .map((item) => {
      if (item.length > maxItemLen) throw new ApiError(400, `Array item exceeds max length ${maxItemLen}`);
      return item;
    });
};

const num = (v) => {
  if (v === undefined || v === null) return undefined;
  const n = Number(v);
  if (Number.isNaN(n)) throw new ApiError(400, 'Expected a number');
  return n;
};

const bool = (v) => {
  if (v === undefined || v === null) return undefined;
  return v === true || v === 'true' || v === 1 || v === '1';
};

const linkItems = (v, maxItems = 20) => {
  if (v === undefined || v === null) return undefined;
  if (!Array.isArray(v)) throw new ApiError(400, 'Expected an array of links');
  if (v.length > maxItems) throw new ApiError(400, `Array exceeds max items ${maxItems}`);
  return v
    .map((item) => {
      if (!item || typeof item !== 'object') throw new ApiError(400, 'Each link must be an object with label and href');
      return {
        label: str(item.label, 100),
        href: str(item.href, 500),
      };
    })
    .filter((item) => item && item.label && item.href);
};

const slug = (v) => {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(s)) {
    throw new ApiError(400, 'Slug may only contain lowercase letters, numbers, and hyphens');
  }
  if (s.length > 80) throw new ApiError(400, 'Slug exceeds max length 80');
  return s;
};

const MAX_JSON_DEPTH = 6;
const MAX_ARR_LEN = 200;
const MAX_STR_LEN = 4000;
const MAX_KEYS = 200;

const sanitizeValue = (v, depth = 0, seen = new Set()) => {
  if (v === null || v === undefined) return undefined;
  if (depth > MAX_JSON_DEPTH) throw new ApiError(400, 'Content is nested too deeply');

  switch (typeof v) {
    case 'string': {
      const s = v.trim();
      return s.length > MAX_STR_LEN ? s.slice(0, MAX_STR_LEN) : s;
    }
    case 'number':
      if (!Number.isFinite(v)) return undefined;
      return v;
    case 'boolean':
      return v;
    case 'object': {
      if (seen.has(v)) throw new ApiError(400, 'Content contains circular references');
      seen.add(v);
      let result;
      if (Array.isArray(v)) {
        if (v.length > MAX_ARR_LEN) v = v.slice(0, MAX_ARR_LEN);
        result = v.map((item) => sanitizeValue(item, depth + 1, seen)).filter((item) => item !== undefined);
      } else {
        const entries = Object.entries(v);
        if (entries.length > MAX_KEYS) entries = entries.slice(0, MAX_KEYS);
        result = {};
        for (const [key, val] of entries) {
          const cleaned = sanitizeValue(val, depth + 1, seen);
          if (cleaned !== undefined) result[key] = cleaned;
        }
      }
      seen.delete(v);
      return result;
    }
    default:
      return undefined;
  }
};

const jsonContent = (v) => {
  if (v === undefined || v === null) return v === null ? null : undefined;
  return sanitizeValue(v);
};

const jsonPatch = jsonContent;

const validate = (body, fields) => {
  const clean = {};
  for (const [key, rule] of Object.entries(fields)) {
    const raw = body[key];
    const value = rule(raw);
    if (value !== undefined) clean[key] = value;
  }
  return clean;
};

export const validators = { str, strArr, num, bool, linkItems, slug, jsonContent, jsonPatch };

export function sanitize(fields) {
  return (req, res, next) => {
    try {
      req.body = validate(req.body, fields);
      next();
    } catch (err) {
      next(err);
    }
  };
}