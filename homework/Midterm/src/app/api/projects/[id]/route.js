import { readDB } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const db = readDB();
  const users = db.users || [];
  const project = db.projects?.find(p => p.id === id);
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 });
  }

  const owner = users.find(u => u.id === project.owner) || {};
  const issues = (db.issues || [])
    .filter(issue => issue.projectId === id)
    .map(issue => {
      const issueUser = users.find(u => u.id === issue.userId) || {};
      return {
        ...issue,
        user: { name: issueUser.name, avatar: issueUser.avatar },
      };
    });

  return Response.json({
    ...project,
    owner: { id: owner.id, name: owner.name, avatar: owner.avatar },
    starCount: (project.stars || []).length,
    issues,
  });
}
