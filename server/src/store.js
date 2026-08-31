import { readFile, writeFile, mkdir, rename, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const BACKUP_FILE = path.join(DATA_DIR, 'data.backup.json');
const SEED_FILE = path.join(__dirname, 'seed', 'data.json');

let cache = null;

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });

  // If the working store is corrupt/missing, try the backup, then the seed.
  for (const source of [DATA_FILE, BACKUP_FILE, SEED_FILE]) {
    try {
      const raw = await readFile(source, 'utf8');
      const parsed = JSON.parse(raw);
      if (source !== DATA_FILE) await writeFile(DATA_FILE, raw, 'utf8');
      cache = parsed;
      return;
    } catch {
      // try next source
    }
  }

  throw new Error('No valid data source found. Check seed/data.json');
}

/**
 * Reads the store, keeping an in-memory cache to avoid re-reading the file on
 * every request. Falls back to a backup/seed file if corrupted.
 */
export async function readDB() {
  if (cache) return cache;
  await ensureDataFile();
  return cache;
}

/**
 * Persists data atomically (write temp file then rename) and keeps a rolling
 * backup of the previous state so a crash mid-write can be recovered.
 */
export async function writeDB(data) {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;

  // Keep a backup of the last good state
  try {
    await copyFile(DATA_FILE, BACKUP_FILE);
  } catch {
    // first write, no backup yet
  }

  await writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await rename(tmp, DATA_FILE);
  cache = data;
}

/** Force a re-read from disk (used after tests or external edits). */
export function resetCache() {
  cache = null;
}

export { DATA_FILE };
