import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

let cache = null;

export function readDB() {
  if (cache) return JSON.parse(JSON.stringify(cache));
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  cache = JSON.parse(raw);
  return JSON.parse(JSON.stringify(cache));
}

export function writeDB(data) {
  cache = data;
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function getCurrentUser(db) {
  const userId = db.currentUser || 'user1';
  return db.users.find(u => u.id === userId) || db.users[0];
}

export function setCurrentUser(db, userId) {
  db.currentUser = userId;
  writeDB(db);
}
