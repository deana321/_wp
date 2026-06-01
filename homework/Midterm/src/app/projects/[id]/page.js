'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issueForm, setIssueForm] = useState({ title: '', content: '' });

  useEffect(() => { fetchProject(); }, [id]);

  async function fetchProject() {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) { router.push('/projects'); return; }
    const data = await res.json();
    setProject(data);

    const userRes = await fetch('/api/user');
    const userData = await userRes.json();
    setCurrentUser(userData.currentUser || userData);

    setLoading(false);
  }

  async function handleToggleStar() {
    if (!currentUser) return;
    await fetch(`/api/projects/${id}/stars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id }),
    });
    fetchProject();
  }

  async function handleAddIssue(e) {
    e.preventDefault();
    if (!issueForm.title.trim() || !issueForm.content.trim()) return;
    await fetch(`/api/projects/${id}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...issueForm, userId: currentUser.id }),
    });
    setIssueForm({ title: '', content: '' });
    fetchProject();
  }

  if (loading) {
    return <p>載入中...</p>;
  }

  if (!project) return null;

  const isStarred = currentUser && (project.stars || []).includes(currentUser.id);

  return (
    <div>
      <button className="btn btn-sm" onClick={() => router.push('/projects')} style={{ marginBottom: 16 }}>
        ← 返回專案列表
      </button>

      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>{project.name}</h2>
          <p>{project.owner?.avatar || '👤'} {project.owner?.name || '未知'}</p>
        </div>
        <button
          className={`btn ${isStarred ? 'btn-pink' : ''}`}
          onClick={handleToggleStar}
        >
          ⭐ {project.starCount || 0}
        </button>
      </div>

      <div className="card" style={{ marginBottom: 24, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 14, lineHeight: 1.7 }}>
        {project.readme || 'README 尚未建立'}
      </div>

      <div className="dashboard-card" style={{ marginBottom: 24 }}>
        <h3>🐛 Issues</h3>
        {(!project.issues || project.issues.length === 0) && (
          <p style={{ color: '#888', fontSize: 13, padding: '8px 0' }}>目前沒有 Issue</p>
        )}
        {project.issues?.map(issue => (
          <div key={issue.id} className="issue-item">
            <div className="issue-title">{issue.title}</div>
            <div className="issue-meta">
              {issue.user?.avatar || '👤'} {issue.user?.name || '未知'} · {new Date(issue.createdAt).toLocaleString('zh-TW')}
            </div>
            <div className="issue-content">{issue.content}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <h3>✏️ 新增 Issue</h3>
        <form onSubmit={handleAddIssue}>
          <input
            className="input-field"
            placeholder="Issue 標題"
            value={issueForm.title}
            onChange={e => setIssueForm(f => ({ ...f, title: e.target.value }))}
            required
            style={{ marginBottom: 10 }}
          />
          <textarea
            className="input-field"
            placeholder="詳細描述..."
            value={issueForm.content}
            onChange={e => setIssueForm(f => ({ ...f, content: e.target.value }))}
            required
            style={{ marginBottom: 12 }}
          />
          <button type="submit" className="btn btn-pink">送出 Issue</button>
        </form>
      </div>
    </div>
  );
}
