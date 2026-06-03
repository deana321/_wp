'use client';

import { useState, useEffect, useRef } from 'react';

const CATEGORIES = ['全部', '貼文', '商品', '信件', '課程', '專案'];
const TYPE_EMOJIS = {
  '貼文': '💬',
  '商品': '🛍️',
  '信件': '📧',
  '課程': '📚',
  '專案': '📁',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams({ q: query });
      if (category !== '全部') {
        params.set('type', category);
      }

      fetch(`/api/search?${params}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, category]);

  const tagStyle = (cat) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: category === cat ? 600 : 400,
    background: category === cat ? 'var(--pink)' : 'var(--card-bg)',
    color: category === cat ? '#fff' : 'var(--text)',
    boxShadow: category === cat ? '0 2px 8px var(--shadow)' : 'none',
    transition: 'all 0.2s',
  });

  return (
    <div>
      <div className="page-header">
        <h2>🔍 搜尋</h2>
        <p>搜尋貼文、商品、信件、課程與專案</p>
      </div>

      <div className="search-bar">
        <input
          className="input-field"
          placeholder="輸入關鍵字搜尋..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} style={tagStyle(cat)} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ color: '#aaa', textAlign: 'center', padding: 40 }}>搜尋中...</p>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <p style={{ color: '#aaa', textAlign: 'center', padding: 40 }}>
          找不到與「{query}」相關的結果
        </p>
      )}

      <div className="search-results">
        {results.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className="search-result-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="result-icon">{TYPE_EMOJIS[item.type] || '📄'}</div>
            <div className="result-info">
              <div className="result-title">{item.title}</div>
              {item.description && (
                <div className="result-desc">
                  {item.description.length > 100
                    ? item.description.slice(0, 100) + '...'
                    : item.description}
                </div>
              )}
            </div>
            <span className="result-type">{item.type}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
