// Per-collection field schemas. `pick` whitelists which fields are accepted so
// clients cannot inject arbitrary keys or prototype pollution into the store.

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const str = (min = 0, max = 3000) => (v) => {
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  return trimmed.length >= min && trimmed.length <= max ? trimmed : null;
};

const safeUrl = (max = 1000) => (v) => {
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  if (!trimmed) return '';
  if (trimmed.length > max) return null;
  // Disallow executable protocols
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return null;
  return trimmed;
};

const strArr = (maxLen = 100) => (v) =>
  Array.isArray(v) &&
  v.length <= maxLen &&
  v.every((s) => typeof s === 'string' && s.length <= 500 && !/^(javascript|data):/i.test(s.trim()))
    ? v.map((s) => s.trim()).filter(Boolean)
    : null;

const num = () => (v) => (Number.isFinite(v) ? v : typeof v === 'string' && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);

const SCHEMAS = {
  projects: {
    fields: {
      id: num(),
      meta: str(0, 200),
      name: str(1, 200),
      desc: str(0, 2500),
      tags: strArr(),
      link: safeUrl(500),
    },
    required: ['name'],
    idField: 'id',
  },
  skills: {
    fields: {
      id: num(),
      category: str(1, 100),
      items: strArr(),
    },
    required: ['category'],
    idField: 'category',
  },
  services: {
    fields: {
      id: num(),
      num: str(1, 20),
      name: str(1, 200),
    },
    required: ['num', 'name'],
    idField: 'num',
  },
  experience: {
    fields: {
      id: num(),
      period: str(1, 100),
      role: str(1, 200),
      company: str(1, 200),
      location: str(0, 100),
      points: strArr(50),
    },
    required: ['period', 'role', 'company'],
    idField: 'id',
  },
  education: {
    fields: {
      id: num(),
      period: str(1, 100),
      degree: str(1, 200),
      institution: str(1, 250),
      location: str(0, 100),
    },
    required: ['period', 'degree', 'institution'],
    idField: 'id',
  },
  achievements: {
    fields: {
      id: num(),
      event: str(1, 250),
      year: str(0, 20),
      org: str(0, 250),
    },
    required: ['event'],
    idField: 'id',
  },
};

const SINGLETON_SCHEMAS = {
  site: {
    name: str(1, 100),
    tagline: str(0, 300),
    heroBadge: str(0, 100),
    heroTitle: str(0, 300),
    heroBgText: str(0, 50),
    heroBio: str(0, 2000),
    aboutTitle: str(0, 300),
    aboutDesc1: str(0, 2000),
    aboutDesc2: str(0, 2000),
    avatarUrl: safeUrl(500),
    copyright: str(0, 200),
    phone: str(0, 50),
    phoneHref: safeUrl(100),
    email: str(0, 150),
    emailHref: safeUrl(200),
    github: safeUrl(300),
    bio: str(0, 2000),
  },
};

const SINGLETONS = ['site', 'socials', 'nav', 'stats', 'processSteps'];
const COMMON_SINGLETON_FIELDS = ['socials', 'nav', 'stats', 'processSteps'];

export function getSchema(collection) {
  return SCHEMAS[collection];
}

export function isSingleton(key) {
  return SINGLETONS.includes(key);
}

export function isCommonSingleton(key) {
  return COMMON_SINGLETON_FIELDS.includes(key);
}

/**
 * Validates and whitelists an object against a field schema.
 * Returns { value, error }.
 */
export function sanitizeRecord(schema, input, { partial = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { value: null, error: 'Expected a JSON object payload' };
  }

  const out = {};
  const errors = [];

  for (const [field, checker] of Object.entries(schema.fields)) {
    if (FORBIDDEN_KEYS.has(field)) continue;
    if (input[field] === undefined) {
      if (partial) continue;
      if (schema.required?.includes(field)) {
        errors.push(`${field} is required`);
      }
      continue;
    }
    const cleaned = checker(input[field]);
    if (cleaned === null) {
      errors.push(`Invalid value for '${field}'`);
    } else {
      out[field] = cleaned;
    }
  }

  if (partial && !Object.keys(out).length) {
    errors.push('No valid fields provided');
  }

  if (!partial) {
    for (const field of schema.required) {
      if (out[field] === undefined) errors.push(`${field} is required`);
    }
  }

  return { value: out, error: errors.length ? errors.join(', ') : null };
}

/**
 * Validates a singleton payload against its schema (or as a generic array block
 * for common singletons that are arrays of simple objects).
 */
export function sanitizeSingleton(key, input) {
  if (key === 'site') {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return { value: null, error: 'Expected an object for site settings' };
    }
    const out = {};
    const errors = [];
    for (const [field, checker] of Object.entries(SINGLETON_SCHEMAS.site)) {
      if (FORBIDDEN_KEYS.has(field)) continue;
      if (input[field] === undefined) continue;
      const cleaned = checker(input[field]);
      if (cleaned === null) errors.push(`Invalid value for '${field}'`);
      else out[field] = cleaned;
    }
    return { value: out, error: errors.length ? errors.join(', ') : null };
  }

  // Common singletons are arrays of plain objects with sanitized string properties
  if (!Array.isArray(input)) {
    return { value: null, error: 'Expected an array' };
  }

  const sanitizedArray = [];
  for (const item of input) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const cleanItem = {};
    for (const [k, v] of Object.entries(item)) {
      if (FORBIDDEN_KEYS.has(k)) continue;
      if (typeof v === 'string') {
        const trimmed = v.trim();
        if (/^(javascript|data):/i.test(trimmed)) cleanItem[k] = '';
        else cleanItem[k] = trimmed.slice(0, 500);
      } else {
        cleanItem[k] = v;
      }
    }
    sanitizedArray.push(cleanItem);
  }

  return { value: sanitizedArray, error: null };
}
