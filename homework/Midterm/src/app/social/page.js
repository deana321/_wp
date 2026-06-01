'use client';

import { useState, useEffect } from 'react';

const CATEGORIES = ['校園生活', '學習', '美食', '徵求', '閒聊', '活動'];
const TAG_COLORS = {
  '校園生活': 'pink',
  '學習': 'mint',
  '美食': 'cream',
  '徵求': 'lavender',
  '閒聊': 'sky',
  '活動': 'pink',
};

function getTagColor(cat) {
  return TAG_COLORS[cat] || 'pink';
}

export default function SocialPage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: '校園生活' });
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [summaries, setSummaries] = useState({});

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data.posts || []);
    setCurrentUser(data.currentUser);
    setLoading(false);
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: currentUser.id }),
    });
    setForm({ title: '', content: '', category: '校園生活' });
    setShowForm(false);
    fetchPosts();
  }

  async function handleLike(postId) {
    await fetch(`/api/posts/${postId}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id }),
    });
    fetchPosts();
  }

  async function handleAddComment(postId) {
    const text = commentText[postId];
    if (!text?.trim()) return;
    await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, content: text }),
    });
    setCommentText(prev => ({ ...prev, [postId]: '' }));
    fetchPosts();
  }

  async function handleSummarize(postId, content) {
    if (summaries[postId]) return;
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setSummaries(prev => ({ ...prev, [postId]: data.summary }));
  }

  if (loading) {
    return <p>載入中...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>💬 社群</h2>
        <p>與校園同學一起討論、分享生活點滴</p>
      </div>

      <button className="btn btn-pink" onClick={() => setShowForm(true)} style={{ marginBottom: 20 }}>
        ✏️ 發佈新貼文
      </button>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>✏️ 發佈新貼文</h3>
            <form onSubmit={handleCreatePost}>
              <input
                className="input-field"
                placeholder="標題"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                style={{ marginBottom: 10 }}
              />
              <textarea
                className="input-field"
                placeholder="分享你的想法..."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                required
                style={{ marginBottom: 10 }}
              />
              <select
                className="input-field"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ marginBottom: 16 }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowForm(false)}>取消</button>
                <button type="submit" className="btn btn-pink">發佈</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {posts.map(post => (
        <div key={post.id} className="card post-card">
          <div className="post-header">
            <span className="post-avatar">{post.user?.avatar || '👤'}</span>
            <div className="post-meta">
              <div className="name">{post.user?.name || '未知'}</div>
              <div className="time">{new Date(post.createdAt).toLocaleString('zh-TW')}</div>
            </div>
          </div>
          <div className="post-category">
            <span className={`tag tag-${getTagColor(post.category)}`}>{post.category}</span>
          </div>
          <div className="post-title">{post.title}</div>
          <div className="post-content">{post.content}</div>
          <div className="post-actions">
            <button
              className={`post-action-btn${post.isLikedByCurrentUser ? ' liked' : ''}`}
              onClick={() => handleLike(post.id)}
            >
              {post.isLikedByCurrentUser ? '❤️' : '🤍'} {post.likeCount || 0}
            </button>
            <button
              className="post-action-btn"
              onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
            >
              💬 {post.commentCount || 0}
            </button>
            <button className="post-action-btn" onClick={() => handleSummarize(post.id, post.content)}>
              🤖 AI 摘要
            </button>
          </div>
          {summaries[post.id] && (
            <div className="ai-summary">
              <span className="ai-icon">✨</span>
              <span>{summaries[post.id]}</span>
            </div>
          )}
          {showComments[post.id] && (
            <div className="comment-section">
              {post.comments?.map(c => (
                <div key={c.id} className="comment">
                  <span className="comment-avatar">{c.user?.avatar || '👤'}</span>
                  <div className="comment-body">
                    <div className="name">{c.user?.name || '未知'}</div>
                    <div className="text">{c.content}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  className="input-field"
                  placeholder="寫下你的回覆..."
                  value={commentText[post.id] || ''}
                  onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-sm btn-pink" onClick={() => handleAddComment(post.id)}>
                  送出
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
