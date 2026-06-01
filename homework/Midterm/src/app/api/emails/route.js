import { readDB, writeDB, getCurrentUser } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const currentUser = getCurrentUser(db);
  const users = db.users || [];

  const emails = (db.emails || [])
    .filter(e => e.to === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(e => {
      const fromUser = users.find(u => u.id === e.from) || { name: e.from, avatar: '👤' };
      return { ...e, fromUser };
    });

  return Response.json({ emails, currentUser });
}

export async function POST(request) {
  const { from, to, subject, body } = await request.json();

  if (!from || !to || !subject || !body) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = readDB();
  const newEmail = {
    id: 'e' + Date.now(),
    from,
    to,
    subject,
    body,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  db.emails = db.emails || [];
  db.emails.unshift(newEmail);
  writeDB(db);

  return Response.json(newEmail, { status: 201 });
}
