'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data.projects || []);
    setCurrentUser(data.currentUser);
    setLoading(false);
  }

  async function handleToggleStar(projectId) {
    if (!currentUser) return;
    await fetch(`/api/projects/${projectId}/stars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id }),
    });
    fetchProjects();
  }

  if (loading) {
    return <p>載入中...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>📂 專案</h2>
        <p>類 GitHub 風格的專案筆記本</p>
      </div>

      <div className="grid-2">
        {projects.map(project => (
          <div key={project.id} className="card project-card">
            <div className="project-header">
              <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="project-name">{project.name}</div>
              </Link>
              <button
                className={`btn btn-sm ${project.isStarredByCurrentUser ? 'btn-pink' : ''}`}
                onClick={() => handleToggleStar(project.id)}
              >
                ⭐ {project.starCount}
              </button>
            </div>
            <div className="project-owner">
              {project.owner?.avatar || '👤'} {project.owner?.name || '未知'}
            </div>
            <div className="project-desc">{project.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
