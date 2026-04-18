import React from 'react'

export function Button({ children, loading, variant = 'primary', type = 'button', onClick, disabled, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 38, padding: '0 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all .15s', border: 'none', width: '100%',
    letterSpacing: '-.01em',
  }
  const variants = {
    primary: { background: disabled || loading ? 'var(--text-3)' : 'var(--navy)', color: '#fff' },
    accent:  { background: disabled || loading ? 'var(--text-3)' : 'var(--teal)', color: 'var(--teal-text)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={{ ...base, ...variants[variant], ...style }}>
      {loading ? <Spinner variant={variant} /> : children}
    </button>
  )
}

function Spinner({ variant }) {
  return (
    <span style={{
      width: 14, height: 14,
      border: `2px solid ${variant === 'accent' ? 'rgba(2,44,34,.3)' : 'rgba(255,255,255,.3)'}`,
      borderTopColor: variant === 'accent' ? 'var(--teal-text)' : '#fff',
      borderRadius: '50%', display: 'inline-block',
      animation: 'spin .6s linear infinite',
    }} />
  )
}

export function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 11 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 600,
          color: 'var(--text-2)', marginBottom: 4,
          textTransform: 'uppercase', letterSpacing: '.05em',
        }}>{label}</label>
      )}
      {children}
      {error && <p style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>{error}</p>}
    </div>
  )
}

const inputBase = {
  width: '100%', height: 36, padding: '0 10px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--surface-2)', color: 'var(--text)',
  fontSize: 13, fontFamily: 'var(--font)', outline: 'none',
  transition: 'border-color .15s, box-shadow .15s, background .15s',
}

export function Input({ error, ...props }) {
  return (
    <input
      style={{ ...inputBase, borderColor: error ? 'var(--danger)' : 'var(--border)' }}
      onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,201,167,.12)'; e.target.style.background = 'var(--surface)' }}
      onBlur={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)' }}
      {...props}
    />
  )
}

export function Select({ children, error, style, ...props }) {
  return (
    <select
      style={{ ...inputBase, cursor: 'pointer', borderColor: error ? 'var(--danger)' : 'var(--border)', ...style }}
      onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,201,167,.12)'; e.target.style.background = 'var(--surface)' }}
      onBlur={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-2)' }}
      {...props}
    >
      {children}
    </select>
  )
}

const badgeMap = {
  pending:       { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8', label: 'Pending' },
  'in-progress': { bg: 'var(--warning-light)', color: 'var(--warning-text)', dot: 'var(--warning)', label: 'In Progress' },
  completed:     { bg: 'var(--success-light)', color: 'var(--success-text)', dot: 'var(--teal)', label: 'Done' },
}

export function Badge({ status }) {
  const cfg = badgeMap[status] || badgeMap.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 22, padding: '0 8px', borderRadius: 999,
      fontSize: 10, fontWeight: 700,
      background: cfg.bg, color: cfg.color,
      whiteSpace: 'nowrap', letterSpacing: '.02em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)',
      padding: '20px 22px', ...style,
    }}>
      {children}
    </div>
  )
}

export function CardTitle({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
      {icon && (
        <span style={{
          width: 20, height: 20,
          background: 'var(--teal-light)', border: '1px solid var(--teal-border)',
          borderRadius: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </span>
      )}
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)' }}>
        {children}
      </p>
    </div>
  )
}
