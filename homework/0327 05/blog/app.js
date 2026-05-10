const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'netease-blog-secret-key',
  resave: false,
  saveUninitialized: false,
}));

marked.setOptions({ breaks: true, gfm: true });

app.use((req, res, next) => {
  res.locals.marked = marked;
  res.locals.user = req.session.user || null;
  next();
});

app.use((req, res, next) => {
  res.locals.categories = db.getCategories();
  res.locals.archiveMonths = db.getArchiveMonths();
  res.locals.recentComments = db.getRecentComments();
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

app.get('/', (req, res) => {
  const category = req.query.category;
  const month = req.query.month;
  let posts;
  if (category) posts = db.getByCategory(category);
  else if (month) posts = db.getByMonth(month);
  else posts = db.getAll();
  res.render('index', { posts, title: '網易網誌', currentCategory: category, currentMonth: month });
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { title: '登入', error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.getUser(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.render('login', { title: '登入', error: '帳號或密碼錯誤' });
  }
  req.session.user = { id: user.id, username: user.username, nickname: user.nickname };
  res.redirect('/');
});

app.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { title: '註冊', error: null });
});

app.post('/register', (req, res) => {
  const { username, password, nickname } = req.body;
  if (!username || !password) {
    return res.render('register', { title: '註冊', error: '帳號和密碼為必填' });
  }
  if (db.getUser(username)) {
    return res.render('register', { title: '註冊', error: '帳號已存在' });
  }
  const hash = bcrypt.hashSync(password, 10);
  db.createUser(username, hash, nickname, '');
  const user = db.getUser(username);
  req.session.user = { id: user.id, username: user.username, nickname: user.nickname };
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/post/new', requireAuth, (req, res) => {
  res.render('new', { title: '寫新文章' });
});

app.post('/post/new', requireAuth, (req, res) => {
  const { title, content, summary, category } = req.body;
  if (!title || !content) return res.redirect('/post/new');
  db.create(title, content, summary, category, req.session.user.id);
  res.redirect('/');
});

app.get('/post/:id', (req, res) => {
  const post = db.getById(req.params.id);
  if (!post) return res.redirect('/');
  const comments = db.getComments(req.params.id);
  res.render('post', { post, comments, title: post.title });
});

app.post('/post/:id/comment', (req, res) => {
  const { author, content } = req.body;
  const post = db.getById(req.params.id);
  if (!post || !author || !content) return res.redirect(`/post/${req.params.id}`);
  db.addComment(req.params.id, author, content);
  res.redirect(`/post/${req.params.id}#comments`);
});

app.get('/post/:id/edit', requireAuth, (req, res) => {
  const post = db.getById(req.params.id);
  if (!post) return res.redirect('/');
  res.render('edit', { post, title: '編輯文章' });
});

app.post('/post/:id/edit', requireAuth, (req, res) => {
  const { title, content, summary, category } = req.body;
  if (!title || !content) return res.redirect(`/post/${req.params.id}/edit`);
  db.update(req.params.id, title, content, summary, category);
  res.redirect(`/post/${req.params.id}`);
});

app.post('/post/:id/delete', requireAuth, (req, res) => {
  db.delete(req.params.id);
  res.redirect('/');
});

if (!db.getUser('tester')) {
  const hash = bcrypt.hashSync('test1234', 10);
  db.createUser('tester', hash, '測試用戶', '');
  console.log('測試帳號已建立: tester / test1234');
}

app.listen(PORT, () => {
  console.log(`Blog running at http://localhost:${PORT}`);
});
