import { readDB, writeDB, getCurrentUser } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const users = db.users || [];
  const currentUser = getCurrentUser(db);

  const posts = (db.posts || []).map(post => {
    const user = users.find(u => u.id === post.userId) || {};
    const comments = (db.comments || []).filter(c => c.postId === post.id).map(c => {
      const commentUser = users.find(u => u.id === c.userId) || {};
      return { ...c, user: { name: commentUser.name, avatar: commentUser.avatar } };
    });
    return {
      ...post,
      user: { name: user.name, avatar: user.avatar },
      commentCount: comments.length,
      comments,
      likeCount: (post.likes || []).length,
      isLikedByCurrentUser: (post.likes || []).includes(currentUser.id),
    };
  });

  return Response.json({ posts, currentUser });
}

export async function POST(request) {
  const body = await request.json();
  const { userId, title, content, category } = body;

  if (!userId || !title || !content || !category) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = readDB();
  const newPost = {
    id: 'p' + Date.now(),
    userId,
    title,
    content,
    category,
    likes: [],
    createdAt: new Date().toISOString(),
  };

  db.posts = db.posts || [];
  db.posts.unshift(newPost);
  writeDB(db);

  return Response.json(newPost, { status: 201 });
}
