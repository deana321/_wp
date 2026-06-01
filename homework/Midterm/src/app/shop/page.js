'use client';

import { useState, useEffect } from 'react';

const EMOJI_OPTIONS = ['📒', '👜', '🖊️', '🧸', '👛', '🌟', '🎒', '📚', '✏️', '🎨', '🍎', '🌈', '⭐', '🎀', '💖', '🐱', '🌸', '🍰', '☕', '🎵'];

const CONFETTI_COLORS = ['#F7A8C6', '#B8E6D6', '#FFE7A3', '#D9C7FF', '#BFDFFF', '#FFD700', '#FF6B6B'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingAI, setLoadingAI] = useState(null);

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', emoji: '📒', category: '文具', description: ''
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
    fetch('/api/cart').then(r => r.json()).then(setCart);
  }, []);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  function addToCart(productId) {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    }).then(r => r.json()).then(data => setCart(data.cart));
  }

  function removeFromCart(productId) {
    fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    }).then(r => r.json()).then(data => setCart(data.cart));
  }

  async function handleCheckout() {
    const res = await fetch('/api/checkout', { method: 'POST' });
    await res.json();
    const success = Math.random() > 0.5;

    if (success) {
      setCart({});
      setShowCart(false);
      setPaymentStatus('success');
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      }));
      setConfettiPieces(pieces);
      setTimeout(() => { setPaymentStatus(null); setConfettiPieces([]); }, 2000);
    } else {
      setPaymentStatus('fail');
    }
  }

  function retryCheckout() {
    setPaymentStatus(null);
    setShowCart(true);
  }

  async function generateAI(product) {
    setLoadingAI(product.id);
    const res = await fetch('/api/ai/product-desc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: product.name }),
    });
    const data = await res.json();
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, description: data.description } : p
    ));
    setLoadingAI(null);
  }

  function openAddModal() {
    setNewProduct({ name: '', price: '', emoji: '📒', category: '文具', description: '' });
    setShowAddModal(true);
  }

  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price) return;
    setAdding(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [...prev, data.product]);
        setShowAddModal(false);
        setMessage(`已新增商品：${data.product.name} 🎉`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage('新增商品失敗 ❌');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>🛍️ 商店</h2>
          <p>精選可愛小物，讓校園生活更繽紛</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openAddModal} style={{
            background: 'var(--mint)', color: '#3a6b5c', border: 'none',
            borderRadius: '20px', padding: '10px 20px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold'
          }}>
            ➕ 新增商品
          </button>
          <button onClick={() => setShowCart(!showCart)} style={{
            position: 'relative', background: 'var(--pink)', color: '#fff', border: 'none',
            borderRadius: '20px', padding: '10px 20px', cursor: 'pointer', fontSize: '16px'
          }}>
            🛒 購物車 {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px', background: '#ff4757',
                color: '#fff', borderRadius: '50%', width: '22px', height: '22px',
                fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          background: 'var(--mint)', color: 'var(--text)', padding: '12px 20px',
          borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold'
        }}>{message}</div>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            background: 'var(--card-bg)', borderRadius: '16px', padding: '20px',
            boxShadow: '0 2px 12px var(--shadow)', display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '48px', textAlign: 'center' }}>{product.emoji}</div>
            <h3 style={{ fontSize: '16px', margin: 0 }}>{product.name}</h3>
            <span style={{ color: 'var(--pink)', fontWeight: 'bold', fontSize: '15px' }}>NT$ {product.price}</span>
            {product.description && (
              <p style={{ fontSize: '13px', color: '#888', margin: 0, lineHeight: 1.4 }}>{product.description}</p>
            )}
            <span style={{
              display: 'inline-block', background: 'var(--lavender)', color: '#6b5b8a',
              padding: '2px 10px', borderRadius: '10px', fontSize: '12px', alignSelf: 'flex-start'
            }}>{product.category}</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button onClick={() => addToCart(product.id)} style={{
                flex: 1, background: 'var(--pink)', color: '#fff', border: 'none',
                borderRadius: '20px', padding: '8px 0', cursor: 'pointer', fontSize: '13px'
              }}>加入購物車</button>
              <button onClick={() => generateAI(product)} disabled={loadingAI === product.id} style={{
                background: 'var(--cream)', color: 'var(--text)', border: 'none',
                borderRadius: '20px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px',
                opacity: loadingAI === product.id ? 0.6 : 1
              }}>
                {loadingAI === product.id ? '⋯' : '🤖 AI'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '340px', height: '100vh',
          background: 'var(--card-bg)', boxShadow: '-4px 0 20px var(--shadow)',
          padding: '24px', zIndex: 1000, overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--pink)', margin: 0 }}>🛒 購物車</h2>
            <button onClick={() => setShowCart(false)} style={{
              background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text)'
            }}>✕</button>
          </div>
          {cartCount === 0 ? (
            <p style={{ color: '#b0a0a8', textAlign: 'center', padding: '40px 0' }}>購物車是空的 🛍️</p>
          ) : (
            <>
              {Object.entries(cart).map(([productId, qty]) => {
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                return (
                  <div key={productId} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 0', borderBottom: '1px solid var(--border)'
                  }}>
                    <span style={{ fontSize: '28px' }}>{product.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{product.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--pink)' }}>NT$ {product.price} × {qty}</div>
                    </div>
                    <button onClick={() => removeFromCart(productId)} style={{
                      background: '#fee', color: '#e06b7a', border: 'none',
                      borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px'
                    }}>✕</button>
                  </div>
                );
              })}
              <div style={{ marginTop: '20px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', padding: '12px 0',
                  borderTop: '2px solid var(--pink)', fontWeight: 'bold', fontSize: '16px'
                }}>
                  <span>總計</span>
                  <span style={{ color: 'var(--pink)' }}>NT$ {
                    Object.entries(cart).reduce((sum, [id, qty]) => {
                      const p = products.find(x => x.id === id);
                      return sum + (p ? p.price * qty : 0);
                    }, 0)
                  }</span>
                </div>
                <button onClick={handleCheckout} style={{
                  width: '100%', background: 'var(--pink)', color: '#fff', border: 'none',
                  borderRadius: '20px', padding: '12px', cursor: 'pointer', fontSize: '16px', marginTop: '12px'
                }}>結帳去</button>
              </div>
            </>
          )}
        </div>
      )}

      {showCart && (
        <div onClick={() => setShowCart(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.2)', zIndex: 999
        }} />
      )}

      {paymentStatus === 'success' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, animation: 'fadeIn 0.3s ease'
        }}>
          {confettiPieces.map(piece => (
            <div key={piece.id} style={{
              position: 'fixed', top: '-10px', left: `${piece.left}%`,
              width: `${piece.size}px`, height: `${piece.size}px`,
              background: piece.color, borderRadius: '2px',
              transform: `rotate(${piece.rotation}deg)`,
              animation: `confettiFall 1.5s ease-in ${piece.delay}s forwards`,
              opacity: 0,
            }} />
          ))}
          <div style={{
            background: 'var(--card-bg)', borderRadius: '24px', padding: '40px 50px',
            textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: 2001
          }}>
            <div style={{
              fontSize: '64px', marginBottom: '12px',
              animation: 'checkBounce 0.5s ease 0.2s forwards', opacity: 0,
              transform: 'scale(0)'
            }}>✅</div>
            <h2 style={{ color: 'var(--pink)', margin: 0, fontSize: '24px' }}>付款成功 🎉</h2>
            <p style={{ color: '#888', marginTop: '8px' }}>感謝您的購買！</p>
          </div>
        </div>
      )}

      {paymentStatus === 'fail' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: '24px', padding: '40px 50px',
            textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            animation: 'shakeX 0.5s ease', zIndex: 2001
          }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>❌</div>
            <h2 style={{ color: '#ff4757', margin: 0, fontSize: '24px' }}>付款失敗 ❌</h2>
            <p style={{ color: '#888', marginTop: '8px' }}>請稍後再試一次</p>
            <button onClick={retryCheckout} style={{
              marginTop: '16px', background: '#ff4757', color: '#fff', border: 'none',
              borderRadius: '20px', padding: '10px 28px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold'
            }}>再試一次</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>新增商品</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>商品名稱</label>
                <input className="input-field" placeholder="輸入商品名稱" value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>價格 (NT$)</label>
                <input className="input-field" type="number" placeholder="輸入價格" value={newProduct.price}
                  onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>表情符號</label>
                <select className="input-field" value={newProduct.emoji}
                  onChange={e => setNewProduct(p => ({ ...p, emoji: e.target.value }))}>
                  {EMOJI_OPTIONS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>分類</label>
                <select className="input-field" value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
                  <option value="文具">文具</option>
                  <option value="配件">配件</option>
                  <option value="生活">生活</option>
                  <option value="美食">美食</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>描述</label>
                <textarea className="input-field" placeholder="輸入商品描述（可選）" value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowAddModal(false)}>取消</button>
              <button className="btn btn-pink" onClick={handleAddProduct} disabled={adding}>
                {adding ? '新增中...' : '✅ 確認新增'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkBounce {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-10px); }
          30%, 70% { transform: translateX(10px); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}