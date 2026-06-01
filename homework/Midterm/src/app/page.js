'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const quickLinks = [
  { href: '/social', label: '社群', icon: '💬', color: 'var(--pink)' },
  { href: '/shop', label: '商店', icon: '🛍️', color: 'var(--mint)' },
  { href: '/mail', label: '信箱', icon: '✉️', color: 'var(--cream)' },
  { href: '/school', label: '校務', icon: '📚', color: 'var(--lavender)' },
  { href: '/projects', label: '專案', icon: '📂', color: 'var(--sky)' },
  { href: '/search', label: '搜尋', icon: '🔍', color: 'var(--pink)' },
];

const statConfig = [
  { key: 'posts', label: '貼文', icon: '💬', bg: '#fff0f5' },
  { key: 'products', label: '商品', icon: '🛍️', bg: '#f0fff5' },
  { key: 'emails', label: '郵件', icon: '✉️', bg: '#fffdf0' },
  { key: 'projects', label: '專案', icon: '📂', bg: '#f5f0ff' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ posts: 0, products: 0, emails: 0, projects: 0 });
  const [schedule, setSchedule] = useState({ day: '', dayName: '', courses: [] });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userRes, statsRes, schedRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/stats'),
          fetch('/api/today-schedule'),
        ]);
        const userData = await userRes.json();
        const statsData = await statsRes.json();
        const schedData = await schedRes.json();
        setUser(userData.currentUser);
        setStats(statsData);
        setSchedule(schedData);
      } catch (e) {
        console.error('Dashboard load error', e);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>🏠 首頁</h2>
        <p>{user ? `${user.name}，歡迎回到 CampusHub！` : '歡迎回到 CampusHub！'}</p>
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="dashboard-card" style={{ marginBottom: 20 }}>
            <h3>📊 概覽統計</h3>
            <div className="stat-grid">
              {statConfig.map(s => (
                <div key={s.key} className="dashboard-stat">
                  <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="stat-info">
                    <h4>{stats[s.key]}</h4>
                    <p>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>📝 近期動態</h3>
            <ul className="activity-list">
              <li>📬 收到 2 封新郵件</li>
              <li>⭐ 你的專案獲得 5 顆星</li>
              <li>💬 社群有 3 則新貼文</li>
              <li>🛍️ 商店上架 1 件新商品</li>
              <li>📚 明天有資料結構考試</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="dashboard-card" style={{ marginBottom: 20 }}>
            <h3>📅 今日課表 ({schedule.dayName})</h3>
            {schedule.courses.length === 0 ? (
              <p style={{ color: '#888', fontSize: 14 }}>今天沒有課程 🎉</p>
            ) : (
              <ul className="activity-list">
                {schedule.courses.map((c, i) => (
                  <li key={i}>
                    <strong>{c.time}</strong> - {c.name}
                    <br />
                    <span style={{ fontSize: 12, color: '#888' }}>{c.location} · {c.teacher}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dashboard-card">
            <h3>🔗 快速連結</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="btn btn-sm"
                  style={{ justifyContent: 'flex-start' }}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
