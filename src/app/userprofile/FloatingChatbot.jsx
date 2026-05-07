'use client'
import { useState } from 'react';

const SITE_URL = 'https://autoadvise-uqnbby2c.manus.space/';

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggle = () => {
    if (!open && !loaded) setLoaded(true);
    setOpen(prev => !prev);
  };

  return (
    <>
      {/* Bubble Window */}
      {open && (
        <div style={bubbleStyle}>
          <div style={headerStyle}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Tajawal, sans-serif' }}>
              🔧 AutoAdvise
            </span>
            <button onClick={toggle} style={closeStyle}>✕</button>
          </div>
          {loaded && (
            <iframe
              src={SITE_URL}
              title="AutoAdvise"
              style={{ width: '100%', height: 480, border: 'none', display: 'block' }}
            />
          )}
        </div>
      )}

      {/* FAB Button */}
      <button onClick={toggle} style={fabStyle} aria-label="فتح الشات بوت">
        {open ? '✕' : '💬'}
      </button>
    </>
  );
}

const fabStyle = {
  position: 'fixed',
  bottom: '1.5rem',
  left: '1.5rem',      // يمين الشاشة = right: '1.5rem'
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(99,102,241,.45)',
  zIndex: 9999,
  transition: 'transform .2s',
};

const bubbleStyle = {
  position: 'fixed',
  bottom: '5rem',
  left: '1.5rem',      // نفس جهة الزر
  width: 360,
  borderRadius: 18,
  overflow: 'hidden',
  background: '#fff',
  boxShadow: '0 8px 40px rgba(0,0,0,.18)',
  zIndex: 9998,
  border: '1px solid rgba(99,102,241,.2)',
};

const headerStyle = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  padding: '0.75rem 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,.8)',
  fontSize: '1.1rem',
  cursor: 'pointer',
};