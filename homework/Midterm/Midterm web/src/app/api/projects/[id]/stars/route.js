import { readDB, writeDB } from '@/lib/db';

export async function POST(request, { params }) {
  const { id } = await params;
  const { userId } = await request.json();

  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 });
  }

  const db = readDB();
  const project = db.projects?.find(p => p.id === id);
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 });
  }

  project.stars = project.stars || [];
  const idx = project.stars.indexOf(userId);
  let starred;
  if (idx === -1) {
    project.stars.push(userId);
    starred = true;
  } else {
    project.stars.splice(idx, 1);
    starred = false;
  }

  writeDB(db);
  return Response.json({ starred, starCount: project.stars.length });
}
