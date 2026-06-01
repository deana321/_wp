'use client';

import { useState, useEffect } from 'react';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingAI, setLoadingAI] = useState(null);

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
    const data = await res.json();
    setCart({});
    setShowCart(false);
    setMessage(data.message);
    setTimeout(() => setMessage(''), 3000);
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

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>🛍️ 商店</h2>
          <p>精選可愛小物，讓校園生活更繽紛</p>
        </div>
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
    </div>
  );
}
