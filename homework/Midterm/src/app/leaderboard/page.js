'use client';

import { useState, useEffect, useRef } from 'react';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('leaderboard');
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

  function handleGameScore(score) {
    setForm(f => ({ ...f, score: String(score) }));
    setActiveTab('leaderboard');
  }

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h2 style={{ justifyContent: 'center' }}>🏆 排行榜</h2>
        <p>遊戲高手們，來挑戰最高分吧！</p>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
        {[
          { key: 'leaderboard', label: '排行榜' },
          { key: 'snake', label: '🐍 貪食蛇' },
          { key: 'bomb', label: '💣 拆炸彈' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 24px',
              border: '2px solid var(--border)',
              borderRadius: 20,
              background: activeTab === tab.key ? 'var(--pink)' : 'var(--card-bg)',
              color: activeTab === tab.key ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'leaderboard' && (
        <>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>載入中...</p>
          ) : (
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
          )}

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
        </>
      )}

      {activeTab === 'snake' && <SnakeGame onScoreSubmit={handleGameScore} />}
      {activeTab === 'bomb' && <BombGame onScoreSubmit={handleGameScore} />}
    </div>
  );
}

function SnakeGame({ onScoreSubmit }) {
  const GRID_SIZE = 20;
  const TICK_MS = 200;

  const [gameState, setGameState] = useState('idle');
  const [displaySnake, setDisplaySnake] = useState([]);
  const [displayFood, setDisplayFood] = useState(null);
  const [score, setScore] = useState(3);
  const [finalScore, setFinalScore] = useState(0);

  const snakeRef = useRef([]);
  const foodRef = useRef(null);
  const dirRef = useRef('RIGHT');
  const nextDirRef = useRef('RIGHT');

  function randomFood(snake) {
    let p;
    do {
      p = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
  }

  function initGame(startDir) {
    const init = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    snakeRef.current = init;
    const d = startDir || 'RIGHT';
    dirRef.current = d;
    nextDirRef.current = d;
    const f = randomFood(init);
    foodRef.current = f;
    setDisplaySnake(init);
    setDisplayFood(f);
    setScore(3);
    setFinalScore(0);
    setGameState('playing');
  }

  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => {
      dirRef.current = nextDirRef.current;
      const d = dirRef.current;
      const snake = snakeRef.current;
      const head = { ...snake[0] };
      if (d === 'UP') head.y -= 1;
      else if (d === 'DOWN') head.y += 1;
      else if (d === 'LEFT') head.x -= 1;
      else head.x += 1;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setFinalScore(snakeRef.current.length);
        setGameState('gameover');
        return;
      }
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        setFinalScore(snakeRef.current.length);
        setGameState('gameover');
        return;
      }

      const ns = [head, ...snake];
      const f = foodRef.current;
      if (head.x === f.x && head.y === f.y) {
        const nf = randomFood(ns);
        foodRef.current = nf;
        setDisplayFood(nf);
        setScore(ns.length);
      } else {
        ns.pop();
      }
      snakeRef.current = ns;
      setDisplaySnake(ns);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [gameState]);

  useEffect(() => {
    function onKey(e) {
      if (gameState !== 'playing') return;
      const map = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      const opp = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (opp[nd] !== dirRef.current) nextDirRef.current = nd;
    }
    window.addEventListener('keydown', onKey);
    if (gameState === 'idle') {
      function startOnKey(e) {
        const map = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
        const nd = map[e.key];
        if (!nd) return;
        e.preventDefault();
        initGame(nd);
      }
      window.addEventListener('keydown', startOnKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('keydown', startOnKey);
      };
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState]);

  function togglePause() {
    setGameState(s => (s === 'playing' ? 'paused' : 'playing'));
  }

  const cs = 20;

  return (
    <div className="dashboard-card" style={{ maxWidth: 480, margin: '24px auto 0', textAlign: 'center' }}>
      <h3>🐍 貪食蛇</h3>
      <p style={{ fontSize: 14, color: 'var(--pink)', fontWeight: 700, marginBottom: 8 }}>分數: {score}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {gameState === 'idle' && <button className="btn btn-pink" onClick={initGame}>開始遊戲</button>}
        {gameState === 'playing' && <button className="btn" onClick={togglePause}>⏸ 暫停</button>}
        {gameState === 'paused' && <button className="btn btn-pink" onClick={togglePause}>▶ 繼續</button>}
        {(gameState === 'playing' || gameState === 'paused') && <button className="btn" onClick={initGame}>🔄 重新開始</button>}
      </div>

      <div style={{ display: 'inline-block', border: '2px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        {Array.from({ length: GRID_SIZE }, (_, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {Array.from({ length: GRID_SIZE }, (_, x) => {
              const isHead = displaySnake[0]?.x === x && displaySnake[0]?.y === y;
              const isBody = !isHead && displaySnake.some(s => s.x === x && s.y === y);
              const isFood = displayFood?.x === x && displayFood?.y === y;
              let bg = '#FFF7FB';
              if (isHead) bg = '#F7A8C6';
              else if (isBody) bg = '#D9C7FF';
              else if (isFood) bg = '#FF6B6B';
              return (
                <div
                  key={x}
                  style={{
                    width: cs, height: cs,
                    background: bg,
                    border: '0.5px solid #F3D7E3',
                    transition: 'background 0.08s',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: '#bbb', marginTop: 6 }}>
        {gameState === 'idle' && '按「開始遊戲」或方向鍵開始'}
        {gameState === 'paused' && '⏸ 已暫停'}
        {gameState === 'playing' && '方向鍵 🡑 🡓 🡐 🡒 控制'}
      </p>

      {gameState === 'gameover' && (
        <div style={{ marginTop: 16, padding: 14, background: 'var(--bg)', borderRadius: 10 }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--pink)' }}>💥 遊戲結束！</p>
          <p style={{ fontSize: 16, margin: '8px 0' }}>得分: <strong>{finalScore}</strong></p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn btn-pink" onClick={() => onScoreSubmit(finalScore)}>📝 提交分數</button>
            <button className="btn" onClick={initGame}>🔄 再玩一次</button>
          </div>
        </div>
      )}
    </div>
  );
}

function BombGame({ onScoreSubmit }) {
  const N = 8;
  const BOMBS = 8;

  const [cells, setCells] = useState([]);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [bombCell, setBombCell] = useState(null);

  const numColors = ['transparent', '#4B3F46', '#3B7DD8', '#E74C3C', '#27AE60', '#8E44AD', '#F39C12', '#E67E22', '#C0392B'];

  function initGame() {
    let g = Array.from({ length: N }, (_, y) =>
      Array.from({ length: N }, (_, x) => ({ x, y, bomb: false, revealed: false, flag: false, adj: 0 }))
    );
    let placed = 0;
    while (placed < BOMBS) {
      const bx = Math.floor(Math.random() * N);
      const by = Math.floor(Math.random() * N);
      if (!g[by][bx].bomb) { g[by][bx].bomb = true; placed++; }
    }
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (g[y][x].bomb) continue;
        let c = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < N && ny >= 0 && ny < N && g[ny][nx].bomb) c++;
          }
        }
        g[y][x].adj = c;
      }
    }
    setCells(g);
    setGameState('playing');
    setScore(0);
    setBombCell(null);
  }

  function reveal(x, y) {
    if (gameState !== 'playing') return;
    const cell = cells[y][x];
    if (cell.revealed || cell.flag) return;
    if (cell.bomb) {
      setBombCell({ x, y });
      setGameState('lost');
      return;
    }
    const nc = cells.map(r => r.map(c => ({ ...c })));
    const q = [{ x, y }];
    while (q.length) {
      const { x: cx, y: cy } = q.shift();
      if (nc[cy][cx].revealed) continue;
      nc[cy][cx].revealed = true;
      if (nc[cy][cx].adj === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < N && ny >= 0 && ny < N && !nc[ny][nx].revealed && !nc[ny][nx].bomb) {
              q.push({ x: nx, y: ny });
            }
          }
        }
      }
    }
    let total = 0;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (nc[y][x].revealed) total++;
    setScore(total);
    setCells(nc);
    if (total >= N * N - BOMBS) setGameState('won');
  }

  function toggleFlag(x, y, e) {
    e.preventDefault();
    if (gameState !== 'playing') return;
    const cell = cells[y]?.[x];
    if (!cell || cell.revealed) return;
    const nc = cells.map(r => r.map(c => ({ ...c })));
    nc[y][x].flag = !nc[y][x].flag;
    setCells(nc);
  }

  const isOver = gameState === 'won' || gameState === 'lost';
  const flagCount = cells.flat().filter(c => c?.flag).length;
  const cs = 40;

  return (
    <div className="dashboard-card" style={{ maxWidth: 500, margin: '24px auto 0', textAlign: 'center' }}>
      <h3>💣 拆炸彈</h3>
      <p style={{ fontSize: 14, color: 'var(--pink)', fontWeight: 700, marginBottom: 8 }}>
        分數: {score}
        {gameState === 'playing' && <span style={{ marginLeft: 12, fontSize: 13, color: '#888' }}>🚩 {flagCount}/{BOMBS}</span>}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
        {gameState !== 'playing' && (
          <button className="btn btn-pink" onClick={initGame}>
            {gameState === 'idle' ? '💣 開始遊戲' : '🔄 再玩一次'}
          </button>
        )}
      </div>

      {gameState !== 'idle' && (
        <div style={{ display: 'inline-block', border: '2px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {cells.map((row, y) => (
            <div key={y} style={{ display: 'flex' }}>
              {row.map((cell, x) => {
                const isTrigger = bombCell && bombCell.x === x && bombCell.y === y;
                let bg = '#FFFFFF';
                let content = '';
                let cursor = 'pointer';

                if (cell.revealed) {
                  bg = '#FFF0F5';
                  content = cell.adj > 0 ? String(cell.adj) : '';
                  cursor = 'default';
                } else if (cell.flag) {
                  bg = '#FFE7A3';
                  content = '🚩';
                  cursor = 'pointer';
                }

                if (isOver) {
                  if (cell.bomb && isTrigger) { bg = '#FF6B6B'; content = '💥'; cursor = 'default'; }
                  else if (cell.bomb && gameState === 'lost') { bg = '#FFD0D0'; content = '💣'; cursor = 'default'; }
                  else if (cell.bomb && gameState === 'won') { bg = '#E8FFE8'; content = '💣'; cursor = 'default'; }
                }

                return (
                  <div
                    key={x}
                    onClick={() => reveal(x, y)}
                    onContextMenu={e => toggleFlag(x, y, e)}
                    style={{
                      width: cs, height: cs,
                      background: bg,
                      border: '1px solid #F3D7E3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: cell.adj > 0 ? 700 : 400,
                      color: numColors[cell.adj] || '#4B3F46',
                      cursor,
                      userSelect: 'none',
                    }}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {gameState === 'idle' && (
        <div style={{ padding: 32, color: '#aaa', fontSize: 14 }}>
          💣 點擊「開始遊戲」
          <p style={{ fontSize: 12, marginTop: 6, color: '#ccc' }}>左鍵點開，右鍵插旗 🚩</p>
        </div>
      )}

      {isOver && (
        <div style={{ marginTop: 16, padding: 14, background: 'var(--bg)', borderRadius: 10 }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: gameState === 'won' ? '#27AE60' : 'var(--pink)' }}>
            {gameState === 'won' ? '🎉 你贏了！全部拆完！' : '💥 踩到炸彈！'}
          </p>
          <p style={{ fontSize: 16, margin: '8px 0' }}>得分: <strong>{score}</strong></p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn btn-pink" onClick={() => onScoreSubmit(score)}>📝 提交分數</button>
            <button className="btn" onClick={initGame}>🔄 再玩一次</button>
          </div>
        </div>
      )}
    </div>
  );
}
