const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'blog.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT DEFAULT '',
    category TEXT DEFAULT '未分類',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  )
`);

const insertUser = db.prepare('INSERT INTO users (username, password, nickname, bio) VALUES (?, ?, ?, ?)');
const getUserByName = db.prepare('SELECT * FROM users WHERE username = ?');
const getUserById = db.prepare('SELECT * FROM users WHERE id = ?');

const insertPost = db.prepare('INSERT INTO posts (user_id, title, content, summary, category) VALUES (?, ?, ?, ?, ?)');
const getAllPosts = db.prepare('SELECT posts.*, users.nickname FROM posts LEFT JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC');
const getPostById = db.prepare('SELECT posts.*, users.nickname FROM posts LEFT JOIN users ON posts.user_id = users.id WHERE posts.id = ?');
const updatePost = db.prepare('UPDATE posts SET title = ?, content = ?, summary = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
const deletePost = db.prepare('DELETE FROM posts WHERE id = ?');

const insertComment = db.prepare('INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)');
const getCommentsByPost = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC');
const getRecentComments = db.prepare('SELECT comments.*, posts.title AS post_title FROM comments LEFT JOIN posts ON comments.post_id = posts.id ORDER BY comments.created_at DESC LIMIT 5');

const getCategories = db.prepare('SELECT category, COUNT(*) AS count FROM posts GROUP BY category ORDER BY count DESC');
const getArchiveMonths = db.prepare("SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count FROM posts GROUP BY month ORDER BY month DESC");

const getPostsByCategory = db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC');
const getPostsByMonth = db.prepare("SELECT * FROM posts WHERE strftime('%Y-%m', created_at) = ? ORDER BY created_at DESC");

module.exports = {
  createUser(username, password, nickname, bio) {
    const info = insertUser.run(username, password, nickname || '', bio || '');
    return info.lastInsertRowid;
  },
  getUser(username) { return getUserByName.get(username); },
  getUserById(id) { return getUserById.get(id); },

  create(title, content, summary, category, userId = 1) {
    const info = insertPost.run(userId, title, content, summary || '', category || '未分類');
    return info.lastInsertRowid;
  },
  getAll() { return getAllPosts.all(); },
  getById(id) { return getPostById.get(id); },
  update(id, title, content, summary, category) {
    updatePost.run(title, content, summary || '', category || '未分類', id);
  },
  delete(id) { deletePost.run(id); },

  addComment(postId, author, content) {
    const info = insertComment.run(postId, author, content);
    return info.lastInsertRowid;
  },
  getComments(postId) { return getCommentsByPost.all(postId); },
  getRecentComments() { return getRecentComments.all(); },

  getCategories() { return getCategories.all(); },
  getArchiveMonths() { return getArchiveMonths.all(); },

  getByCategory(category) { return getPostsByCategory.all(category); },
  getByMonth(month) { return getPostsByMonth.all(month); },

  close() { db.close(); }
};
