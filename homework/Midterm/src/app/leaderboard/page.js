'use client';

import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ playerName: '', score: '' });

  useEffect(() => { fetchScores(); }, []);

  async function fetchScores() {
    const res = await fetch('/api/scores');
    const data = await res.json();
    setScores(data || []);
    setLoading(false);
  }

  function getRankBadge(rank) {
    if (rank === 0) return { emoji: '🥇', className: 'rank-1', label: 'Gold' };
    if (rank === 1) return { emoji: '🥈', className: 'rank-2', label: 'Silver' };
    if (rank === 2) return { emoji: '🥉', className: 'rank-3', label: 'Bronze' };
    return { emoji: `#${rank + 1}`, className: 'rank-other', label: '' };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.playerName.trim() || !form.score) return;
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName: form.playerName, score: Number(form.score) }),
    });
    setForm({ playerName: '', score: '' });
    fetchScores();
  }

  if (loading) {
    return <p>載入中...</p>;
  }

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h2 style={{ justifyContent: 'center' }}>🏆 排行榜</h2>
        <p>遊戲高手們，來挑戰最高分吧！</p>
      </div>

      <div className="leaderboard-list">
        {scores.map((entry, index) => {
          const badge = getRankBadge(index);
          return (
            <div key={entry.id} className="leaderboard-entry">
              <div className={`rank ${badge.className}`}>{badge.emoji}</div>
              <div className="player-name">{entry.playerName}</div>
              <div className="player-score">{entry.score.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-card" style={{ maxWidth: 500, margin: '24px auto 0' }}>
        <h3>✏️ 上傳你的分數</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder="玩家名稱"
            value={form.playerName}
            onChange={e => setForm(f => ({ ...f, playerName: e.target.value }))}
            required
            style={{ marginBottom: 10 }}
          />
          <input
            className="input-field"
            type="number"
            placeholder="分數"
            value={form.score}
            onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
            required
            style={{ marginBottom: 12 }}
          />
          <button type="submit" className="btn btn-pink">提交分數</button>
        </form>
      </div>
    </div>
  );
}
