import React, { useState } from 'react'
import { employeeApi } from '../api'
import { Input, Field, Button } from './UI'

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = [
  { bg: '#E0F2F1', color: '#00695C' },
  { bg: '#EDE7F6', color: '#4527A0' },
  { bg: '#FBE9E7', color: '#BF360C' },
  { bg: '#E3F2FD', color: '#0D47A1' },
  { bg: '#F3E5F5', color: '#6A1B9A' },
  { bg: '#E8F5E9', color: '#1B5E20' },
]

function getAvatarColor(name) {
  let sum = 0
  for (let c of name) sum += c.charCodeAt(0)
  return avatarColors[sum % avatarColors.length]
}

function EditModal({ employee, onSave, onClose, toast }) {
  const [form, setForm] = useState({ name: employee.name, email: employee.email, role: employee.role })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.role.trim()) e.role = 'Role is required'
    return e
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const json = await employeeApi.update(employee._id, {
        name: form.name.trim(), email: form.email.trim(), role: form.role.trim()
      })
      toast(`${json.data.name} updated successfully`, 'success')
      onSave(json.data)
      onClose()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function set(key) {
    return (e) => {
      setForm(f => ({ ...f, [key]: e.target.value }))
      if (errors[key]) setErrors(er => ({ ...er, [key]: '' }))
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10,15,30,.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 14,
        width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,.2)',
        overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{
          background: 'var(--navy)', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Edit Employee</p>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', fontSize: 18, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSave} noValidate style={{ padding: 20 }}>
          <Field label="Full name" error={errors.name}>
            <Input type="text" value={form.name} onChange={set('name')} error={errors.name} />
          </Field>
          <Field label="Email address" error={errors.email}>
            <Input type="email" value={form.email} onChange={set('email')} error={errors.email} />
          </Field>
          <Field label="Role" error={errors.role}>
            <Input type="text" value={form.role} onChange={set('role')} error={errors.role} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, height: 38, borderRadius: 6,
              border: '1px solid var(--border)', background: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)',
              fontFamily: 'var(--font)',
            }}>
              Cancel
            </button>
            <Button type="submit" loading={loading} style={{ flex: 1 }}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirm({ employee, onConfirm, onClose, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10,15,30,.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 14,
        width: '100%', maxWidth: 380,
        boxShadow: '0 20px 60px rgba(0,0,0,.2)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 24px 20px' }}>
          {/* Warning icon */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--danger-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--danger)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M10 3L18 17H2L10 3z"/>
              <path d="M10 9v4M10 15h.01"/>
            </svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            Delete {employee.name}?
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
            This will permanently delete <strong>{employee.name}</strong> and all their assigned tasks. This action cannot be undone.
          </p>
        </div>
        <div style={{
          display: 'flex', gap: 10, padding: '0 24px 20px',
        }}>
          <button onClick={onClose} style={{
            flex: 1, height: 38, borderRadius: 6,
            border: '1px solid var(--border)', background: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            color: 'var(--text-2)', fontFamily: 'var(--font)',
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, height: 38, borderRadius: 6, border: 'none',
            background: loading ? 'var(--text-3)' : 'var(--danger)',
            fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            color: '#fff', fontFamily: 'var(--font)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {loading ? (
              <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .6s linear infinite' }} />
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeList({ employees, onUpdated, onDeleted, toast }) {
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await employeeApi.delete(deleteTarget._id)
      toast(`${deleteTarget.name} deleted`, 'success')
      onDeleted(deleteTarget._id)
      setDeleteTarget(null)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (employees.length === 0) return null

  return (
    <>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)',
        overflow: 'hidden', marginBottom: 16,
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 22px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.01em' }}>
            Employees
          </p>
          <span style={{
            background: 'var(--teal-light)', color: 'var(--success-text)',
            border: '1px solid var(--teal-border)',
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          }}>
            {employees.length}
          </span>
        </div>

        {/* Employee rows */}
        {employees.map((emp, i) => {
          const av = getAvatarColor(emp.name)
          return (
            <div key={emp._id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 22px',
              borderBottom: i === employees.length - 1 ? 'none' : '1px solid #f1f5f9',
              transition: 'background .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: av.bg, color: av.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, letterSpacing: '.02em',
              }}>
                {getInitials(emp.name)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {emp.name}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {emp.email}
                </p>
              </div>

              {/* Role badge */}
              <span style={{
                fontSize: 11, fontWeight: 500, color: 'var(--text-2)',
                background: '#f1f5f9', padding: '3px 10px', borderRadius: 99,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {emp.role}
              </span>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setEditTarget(emp)}
                  title="Edit employee"
                  style={{
                    width: 30, height: 30, borderRadius: 7,
                    border: '1px solid var(--border)',
                    background: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--teal-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff' }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#00897B" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M9 2l2 2-6 6H3V8l6-6z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(emp)}
                  title="Delete employee"
                  style={{
                    width: 30, height: 30, borderRadius: 7,
                    border: '1px solid var(--border)',
                    background: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff' }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 3h9M5 3V2h3v1M4 3v7a1 1 0 001 1h3a1 1 0 001-1V3"/>
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          employee={editTarget}
          onSave={onUpdated}
          onClose={() => setEditTarget(null)}
          toast={toast}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirm
          employee={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  )
}
