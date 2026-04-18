import React, { useState, useEffect, useCallback } from 'react'
import { taskApi } from '../api'
import { Badge } from './UI'

const barColor = { pending: '#e2e8f0', 'in-progress': '#f59e0b', completed: '#00c9a7' }

function TaskItem({ task, onStatusChange }) {
  const [updating, setUpdating] = useState(false)

  async function handleChange(e) {
    setUpdating(true)
    await onStatusChange(task._id, e.target.value)
    setUpdating(false)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 24px',
      borderBottom: '1px solid #f1f5f9',
      transition: 'background .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 3, height: 36, borderRadius: 99, flexShrink: 0,
        background: barColor[task.status] || '#e2e8f0',
        transition: 'background .3s',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {task.task_title}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
          {new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <Badge status={task.status} />
      <select
        value={task.status}
        onChange={handleChange}
        disabled={updating}
        style={{
          width: 130, height: 30, fontSize: 11, fontWeight: 500,
          fontFamily: 'var(--font)', color: 'var(--text-2)',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: 7, padding: '0 8px', cursor: 'pointer',
          outline: 'none', flexShrink: 0,
        }}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  )
}

function StatBox({ count, label, color, last, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, textAlign: 'center', padding: '14px 0',
        borderRight: last ? 'none' : '1px solid #f1f5f9',
        cursor: 'pointer',
        background: active ? 'rgba(0,201,167,.06)' : 'transparent',
        transition: 'background .15s',
        userSelect: 'none',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ fontSize: 22, fontWeight: 600, color, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 10, color: active ? color : 'var(--text-3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: active ? 700 : 400 }}>{label}</div>
      {active && <div style={{ width: 20, height: 2, background: color, borderRadius: 99, margin: '6px auto 0' }} />}
    </div>
  )
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Done' },
]

const filterColors = { all: 'var(--text-2)', pending: '#94a3b8', 'in-progress': 'var(--warning)', completed: 'var(--teal)' }

export default function TaskList({ employees, refreshSignal, deletedEmployeeId, toast }) {
  const [selectedId, setSelectedId] = useState('')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [employeeName, setEmployeeName] = useState('')
  const [filter, setFilter] = useState('all')

  // Clear task list if the currently selected employee is deleted
  useEffect(() => {
    if (deletedEmployeeId && deletedEmployeeId === selectedId) {
      setSelectedId('')
      setTasks([])
      setEmployeeName('')
      setFilter('all')
    }
  }, [deletedEmployeeId])

  const fetchTasks = useCallback(async (id) => {
    if (!id) return
    setLoading(true)
    try {
      const json = await taskApi.getByEmployee(id)
      setTasks(json.data)
      setEmployeeName(json.employee.name)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (selectedId) fetchTasks(selectedId)
  }, [refreshSignal, selectedId, fetchTasks])

  async function handleStatusChange(taskId, newStatus) {
    try {
      const json = await taskApi.updateStatus(taskId, newStatus)
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: json.data.status } : t))
      toast(`Status updated to "${newStatus}"`, 'success')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  function handleSelect(e) {
    setSelectedId(e.target.value)
    setTasks([])
    setEmployeeName('')
    setFilter('all')
    if (e.target.value) fetchTasks(e.target.value)
  }

  const counts = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc }, {})
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 24px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 140 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.01em' }}>
            {employeeName ? `${employeeName}'s Tasks` : 'Task List'}
          </p>
          {tasks.length > 0 && (
            <span style={{
              background: 'var(--teal-light)', color: 'var(--success-text)',
              border: '1px solid var(--teal-border)',
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
            }}>
              {filter === 'all' ? tasks.length : `${filtered.length} of ${tasks.length}`}
            </span>
          )}
        </div>
        <select
          value={selectedId}
          onChange={handleSelect}
          style={{
            height: 34, padding: '0 12px', fontSize: 12, fontWeight: 500,
            fontFamily: 'var(--font)', color: 'var(--text)',
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 8, cursor: 'pointer', outline: 'none', minWidth: 200, flexShrink: 0,
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,201,167,.1)' }}
          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
        >
          <option value="">Choose employee…</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name} — {emp.role}</option>
          ))}
        </select>
      </div>

      {/* Stats — clickable filters */}
      {tasks.length > 0 && (
        <div style={{ display: 'flex', background: '#fafbfc', borderBottom: '1px solid #f1f5f9' }}>
          <StatBox count={tasks.length} label="All" color="var(--text-2)"
            active={filter === 'all'} onClick={() => setFilter('all')} />
          <StatBox count={counts.pending || 0} label="Pending" color="#94a3b8"
            active={filter === 'pending'} onClick={() => setFilter('pending')} />
          <StatBox count={counts['in-progress'] || 0} label="In Progress" color="var(--warning)"
            active={filter === 'in-progress'} onClick={() => setFilter('in-progress')} />
          <StatBox count={counts.completed || 0} label="Done" color="var(--teal)"
            active={filter === 'completed'} onClick={() => setFilter('completed')} last />
        </div>
      )}

      {/* Filter pills — shown when a filter is active */}
      {tasks.length > 0 && filter !== 'all' && (
        <div style={{
          padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid #f1f5f9', background: '#fff',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Showing:</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 99,
            fontSize: 11, fontWeight: 600,
            background: 'var(--teal-light)', color: 'var(--success-text)',
            border: '1px solid var(--teal-border)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: filterColors[filter] }} />
            {FILTERS.find(f => f.key === filter)?.label}
          </span>
          <button
            onClick={() => setFilter('all')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: 'var(--text-3)', padding: '2px 6px',
              borderRadius: 4, fontFamily: 'var(--font)',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--danger)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
          >
            Clear ×
          </button>
        </div>
      )}

      {/* Task items */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <span style={{
            width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--teal)',
            borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'block',
          }} />
        </div>
      ) : !selectedId ? (
        <div style={{ textAlign: 'center', padding: '52px 20px', color: 'var(--text-3)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1" style={{ opacity: .3, display: 'block', margin: '0 auto 12px' }}>
            <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M8 8h5M8 16h3"/>
          </svg>
          <p style={{ fontSize: 13 }}>Select an employee to view their tasks</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '52px 20px', color: 'var(--text-3)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1" style={{ opacity: .3, display: 'block', margin: '0 auto 12px' }}>
            <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/>
          </svg>
          <p style={{ fontSize: 13 }}>
            {tasks.length === 0 ? `No tasks assigned to ${employeeName} yet` : `No ${filter} tasks`}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((task, i) => (
            <TaskItem key={task._id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
