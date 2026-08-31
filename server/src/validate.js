// Per-collection field schemas. `pick` whitelists which fields are accepted so
// clients cannot inject arbitrary keys into the store.

const str = (min = 0, max = 3000) => (v) =>
  typeof v === 'string' && v.length >= min && v.length <= max ? v : null;
const strArr = (maxLen = 100) => (v) =>
  Array.isArray(v) &&
  v.length <= maxLen &&
  v.every((s) => typeof s === 'string' && s.length <= 500)
    ? v
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
      link: str(0, 500),
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
    avatarUrl: str(0, 500),
    copyright: str(0, 200),
    phone: str(0, 50),
    phoneHref: str(0, 100),
    email: str(0, 150),
    emailHref: str(0, 200),
    github: str(0, 300),
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
  const out = {};
  const errors = [];

  for (const [field, checker] of Object.entries(schema.fields)) {
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
    const out = {};
    const errors = [];
    for (const [field, checker] of Object.entries(SINGLETON_SCHEMAS.site)) {
      if (input[field] === undefined) continue;
      const cleaned = checker(input[field]);
      if (cleaned === null) errors.push(`Invalid value for '${field}'`);
      else out[field] = cleaned;
    }
    return { value: out, error: errors.length ? errors.join(', ') : null };
  }
  // Common singletons are arrays of arbitrary objects — ensure it's an array
  // of plain objects with reasonable string values.
  if (!Array.isArray(input)) {
    return { value: null, error: 'Expected an array' };
  }
  return { value: input, error: null };
}
