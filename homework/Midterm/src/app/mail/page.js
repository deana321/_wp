'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MailPage() {
  const [emails, setEmails] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ to: '', subject: '', body: '' });
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => { fetchEmails(); }, []);

  async function fetchEmails() {
    const res = await fetch('/api/emails');
    const data = await res.json();
    setEmails(data.emails || []);
    setCurrentUser(data.currentUser);
    setLoading(false);
  }

  useEffect(() => {
    if (currentUser) {
      const userList = data => { setUsers(data.users || []); };
      fetch('/api/user').then(r => r.json()).then(userList);
    }
  }, [currentUser]);

  async function handleSend(e) {
    e.preventDefault();
    await fetch('/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: currentUser.id,
        to: form.to,
        subject: form.subject,
        body: form.body,
      }),
    });
    setForm({ to: '', subject: '', body: '' });
    setShowCompose(false);
    fetchEmails();
  }

  function formatTime(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  }

  const unreadCount = emails.filter(e => !e.isRead).length;

  if (loading) {
    return <p>載入中...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>✉️ 信箱 {unreadCount > 0 && <span className="cart-badge">{unreadCount}</span>}</h2>
        <p>收發校園信件，與同學保持聯繫</p>
      </div>

      <button className="btn btn-pink" onClick={() => setShowCompose(true)} style={{ marginBottom: 16 }}>
        ✏️ 撰寫新信件
      </button>

      {showCompose && (
        <div className="modal-overlay" onClick={() => setShowCompose(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>✏️ 撰寫新信件</h3>
            <form onSubmit={handleSend}>
              <select
                className="input-field"
                value={form.to}
                onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                required
                style={{ marginBottom: 10 }}
              >
                <option value="">選擇收件人</option>
                {users.filter(u => u.id !== currentUser.id).map(u => (
                  <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>
                ))}
              </select>
              <input
                className="input-field"
                placeholder="主旨"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                required
                style={{ marginBottom: 10 }}
              />
              <textarea
                className="input-field"
                placeholder="內容..."
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                required
                style={{ marginBottom: 16 }}
              />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowCompose(false)}>取消</button>
                <button type="submit" className="btn btn-pink">送出</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <ul className="email-list">
          {emails.length === 0 ? (
            <li style={{ padding: 40, textAlign: 'center', color: '#b0a0a8' }}>
              目前沒有信件 📭
            </li>
          ) : (
            emails.map(email => (
              <li
                key={email.id}
                className={`email-item${email.isRead ? '' : ' unread'}`}
                onClick={() => router.push(`/mail/${email.id}`)}
              >
                <span className={`email-status${email.isRead ? ' read' : ''}`} />
                <span className="email-from">{email.fromUser?.avatar} {email.fromUser?.name || email.from}</span>
                <span className="email-subject">{email.subject}</span>
                <span className="email-time">{formatTime(email.createdAt)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
