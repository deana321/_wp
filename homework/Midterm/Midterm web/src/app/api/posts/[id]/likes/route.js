import { readDB, writeDB } from '@/lib/db';

export async function POST(request, { params }) {
  const { id } = await params;
  const { userId } = await request.json();

  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 });
  }

  const db = readDB();
  const post = db.posts.find(p => p.id === id);
  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  post.likes = post.likes || [];
  const idx = post.likes.indexOf(userId);
  if (idx === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(idx, 1);
  }

  writeDB(db);
  return Response.json({ likes: post.likes, likeCount: post.likes.length });
}
