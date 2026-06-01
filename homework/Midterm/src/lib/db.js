import fs from 'fs';
import path from 'path';

const IS_VERCEL = !!process.env.VERCEL;
const DB_PATH = IS_VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(process.cwd(), 'data', 'db.json');
const SEED_PATH = path.join(process.cwd(), 'data', 'db.json');

let cache = null;

export function readDB() {
  if (cache) return JSON.parse(JSON.stringify(cache));

  // On Vercel, try /tmp first, then fall back to seed
  const sourcePath = IS_VERCEL && fs.existsSync(DB_PATH) ? DB_PATH : SEED_PATH;
  const raw = fs.readFileSync(sourcePath, 'utf-8');
  cache = JSON.parse(raw);
  return JSON.parse(JSON.stringify(cache));
}

export function writeDB(data) {
  cache = data;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('writeDB failed (read-only FS?):', e.message);
  }
}

export function getCurrentUser(db) {
  const userId = db.currentUser || 'user1';
  return db.users.find(u => u.id === userId) || db.users[0];
}

export function setCurrentUser(db, userId) {
  db.currentUser = userId;
  writeDB(db);
}
