import { readDB, writeDB, getCurrentUser } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const users = db.users || [];
  const currentUser = getCurrentUser(db);
  const projects = (db.projects || []).map(project => {
    const owner = users.find(u => u.id === project.owner) || {};
    return {
      ...project,
      owner: { id: owner.id, name: owner.name, avatar: owner.avatar },
      starCount: (project.stars || []).length,
      isStarredByCurrentUser: (project.stars || []).includes(currentUser.id),
    };
  });
  return Response.json({ projects, currentUser });
}

export async function POST(request) {
  const body = await request.json();
  const { name, owner, description, readme } = body;

  if (!name || !owner) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = readDB();
  const newProject = {
    id: 'prj' + Date.now(),
    name,
    owner,
    description: description || '',
    readme: readme || '',
    stars: [],
    createdAt: new Date().toISOString(),
  };

  db.projects = db.projects || [];
  db.projects.push(newProject);
  writeDB(db);

  return Response.json(newProject, { status: 201 });
}
