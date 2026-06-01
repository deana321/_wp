'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EmailDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => { fetchEmail(); }, [id]);

  async function fetchEmail() {
    const res = await fetch(`/api/emails/${id}`);
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setEmail(data);
    setLoading(false);
  }

  async function handleAIDraft() {
    setLoadingAI(true);
    const res = await fetch('/api/ai/reply-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: email.body }),
    });
    const data = await res.json();
    setDraft(data.draft);
    setLoadingAI(false);
  }

  if (loading) {
    return <p>載入中...</p>;
  }

  if (!email) {
    return (
      <div>
        <p>信件不存在</p>
        <button className="btn" onClick={() => router.push('/mail')}>← 返回收件匣</button>
      </div>
    );
  }

  return (
    <div>
      <div className="email-detail">
        <button className="btn" onClick={() => router.push('/mail')} style={{ marginBottom: 16 }}>
          ← 返回收件匣
        </button>

        <div className="card email-detail-header">
          <div className="subject">{email.subject}</div>
          <div className="meta">
            <span>寄件人：{email.fromUser?.avatar} {email.fromUser?.name || email.from}</span>
            <span style={{ marginLeft: 16 }}>
              {new Date(email.createdAt).toLocaleString('zh-TW')}
            </span>
          </div>
        </div>

        <div className="email-body">
          {email.body}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'column' }}>
          <button
            className="btn btn-mint"
            onClick={handleAIDraft}
            disabled={loadingAI}
          >
            {loadingAI ? '🤖 產生中...' : '🤖 AI 產生回覆草稿'}
          </button>

          {draft && (
            <div className="card" style={{ width: '100%', marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--pink)' }}>
                ✨ AI 建議回覆
              </div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8 }}>{draft}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
