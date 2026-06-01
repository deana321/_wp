import { readDB, writeDB } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const db = readDB();
  const users = db.users || [];
  const comments = (db.comments || []).filter(c => c.postId === id).map(c => {
    const user = users.find(u => u.id === c.userId) || {};
    return { ...c, user: { name: user.name, avatar: user.avatar } };
  });
  return Response.json(comments);
}

export async function POST(request, { params }) {
  const { id } = await params;
  const { userId, content } = await request.json();

  if (!userId || !content) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = readDB();
  const newComment = {
    id: 'c' + Date.now(),
    postId: id,
    userId,
    content,
    createdAt: new Date().toISOString(),
  };

  db.comments = db.comments || [];
  db.comments.push(newComment);
  writeDB(db);

  const user = (db.users || []).find(u => u.id === userId) || {};
  return Response.json(
    { ...newComment, user: { name: user.name, avatar: user.avatar } },
    { status: 201 }
  );
}
