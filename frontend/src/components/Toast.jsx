import React from 'react'

const typeStyle = {
  success: { background: '#0a0f1e', color: '#fff', accent: 'var(--teal)' },
  error:   { background: '#991b1b', color: '#fff', accent: '#fca5a5' },
  info:    { background: '#1e3a5f', color: '#fff', accent: '#93c5fd' },
}

export default function ToastContainer({ toasts }) {
  return (
    <>
      <style>{`@keyframes toastIn { from { transform: translateX(14px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
      <div style={{ position: 'fixed', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1000, pointerEvents: 'none' }}>
        {toasts.map(t => {
          const s = typeStyle[t.type] || typeStyle.success
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              background: s.background, color: s.color,
              borderRadius: 8, fontSize: 12, fontWeight: 500,
              fontFamily: 'var(--font)',
              boxShadow: '0 4px 16px rgba(0,0,0,.2)',
              animation: 'toastIn .2s ease',
              minWidth: 220, maxWidth: 300,
              borderLeft: `3px solid ${s.accent}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.accent, flexShrink: 0 }} />
              {t.message}
            </div>
          )
        })}
      </div>
    </>
  )
}
