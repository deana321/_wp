'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '首頁', icon: '🏠' },
  { href: '/social', label: '社群', icon: '💬' },
  { href: '/shop', label: '商店', icon: '🛍️' },
  { href: '/mail', label: '信箱', icon: '✉️' },
  { href: '/school', label: '校務', icon: '📚' },
  { href: '/search', label: '搜尋', icon: '🔍' },
  { href: '/projects', label: '輔助系統', icon: '📂' },
  { href: '/leaderboard', label: '排行榜', icon: '🏆' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      setUser(data.currentUser);
      setUsers(data.users);
      setCartCount(data.cartCount);
    } catch (e) {
      console.error('Failed to fetch user data', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const switchUser = async (userId) => {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setUser(data.currentUser);
      setUsers(data.users);
      setCartCount(data.cartCount);
      window.location.reload();
    } catch (e) {
      console.error('Failed to switch user', e);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>CampusHub.test Notes</h1>
        <div className="subtitle">校園筆記本</div>
      </div>

      {user && (
        <div className="sidebar-user">
          <span className="avatar">{user.avatar}</span>
          <div>
            <div className="name">{user.name}</div>
            <div style={{ fontSize: 11, color: '#b0a0a8' }}>{user.email}</div>
          </div>
        </div>
      )}

      <div className="user-switcher" style={{ padding: '0 20px' }}>
        {users.map(u => (
          <button
            key={u.id}
            className={`user-option ${user?.id === u.id ? 'active' : ''}`}
            onClick={() => switchUser(u.id)}
          >
            {u.avatar} {u.name}
          </button>
        ))}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.href === '/shop' && cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
