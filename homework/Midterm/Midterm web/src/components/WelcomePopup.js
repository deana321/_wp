'use client';

import { useState } from 'react';

export default function WelcomePopup() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📢</div>
        <h3 style={{ color: 'var(--pink)', marginBottom: 12 }}>注意事項</h3>
        <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.8, marginBottom: 20 }}>
          此均為假設
        </p>
        <button className="btn btn-pink" onClick={() => setShow(false)}>
          我知道了 ✨
        </button>
      </div>
    </div>
  );
}
