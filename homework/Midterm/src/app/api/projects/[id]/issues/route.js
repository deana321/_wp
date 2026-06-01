import { readDB, writeDB } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const db = readDB();
  const users = db.users || [];
  const issues = (db.issues || [])
    .filter(issue => issue.projectId === id)
    .map(issue => {
      const user = users.find(u => u.id === issue.userId) || {};
      return { ...issue, user: { name: user.name, avatar: user.avatar } };
    });
  return Response.json(issues);
}

export async function POST(request, { params }) {
  const { id } = await params;
  const { userId, title, content } = await request.json();

  if (!userId || !title || !content) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = readDB();
  const project = db.projects?.find(p => p.id === id);
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 });
  }

  const newIssue = {
    id: 'iss' + Date.now(),
    projectId: id,
    userId,
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  db.issues = db.issues || [];
  db.issues.push(newIssue);
  writeDB(db);

  const user = (db.users || []).find(u => u.id === userId) || {};
  return Response.json(
    { ...newIssue, user: { name: user.name, avatar: user.avatar } },
    { status: 201 }
  );
}
