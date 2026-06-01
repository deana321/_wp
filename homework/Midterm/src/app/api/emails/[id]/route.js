import { readDB, writeDB } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const db = readDB();
  const email = db.emails.find(e => e.id === id);

  if (!email) {
    return Response.json({ error: 'Email not found' }, { status: 404 });
  }

  email.isRead = true;
  writeDB(db);

  const users = db.users || [];
  const fromUser = users.find(u => u.id === email.from) || { name: email.from, avatar: '👤' };
  const toUser = users.find(u => u.id === email.to) || { name: email.to, avatar: '👤' };

  return Response.json({ ...email, fromUser, toUser });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const db = readDB();
  const email = db.emails.find(e => e.id === id);

  if (!email) {
    return Response.json({ error: 'Email not found' }, { status: 404 });
  }

  if (typeof body.isRead === 'boolean') {
    email.isRead = body.isRead;
  }

  writeDB(db);
  return Response.json(email);
}
