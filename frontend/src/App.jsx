import React, { useState, useEffect, useCallback } from 'react'
import { employeeApi } from './api'
import EmployeeForm from './components/EmployeeForm'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import ToastContainer from './components/Toast'
import { useToast } from './hooks/useToast'

export default function App() {
  const [employees, setEmployees] = useState([])
  const [taskRefresh, setTaskRefresh] = useState(0)
  const { toasts, addToast } = useToast()

  const loadEmployees = useCallback(async () => {
    try {
      const json = await employeeApi.getAll()
      setEmployees(json.data)
    } catch { }
  }, [])

  useEffect(() => { loadEmployees() }, [loadEmployees])

  function handleEmployeeCreated(emp) {
    setEmployees(prev => [emp, ...prev])
  }

  function handleTaskCreated() {
    setTaskRefresh(n => n + 1)
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Dark navy header */}
      <header style={{
        background: 'var(--navy)',
        borderBottom: '1px solid var(--navy-border)',
        padding: '0 28px', height: 52,
        display: 'flex', alignItems: 'center', gap: 10,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          width: 28, height: 28, background: 'var(--teal)',
          borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            stroke="var(--teal-text)" strokeWidth="1.5" strokeLinecap="round">
            <rect x="1" y="1" width="5" height="5" rx="1"/>
            <rect x="8" y="1" width="5" height="5" rx="1"/>
            <rect x="1" y="8" width="5" height="5" rx="1"/>
            <path d="M8 10.5h5M10.5 8v5"/>
          </svg>
        </div>

        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-.01em' }}>
          Employee Task Tracker
        </span>

        <span style={{
          marginLeft: 'auto',
          fontSize: 11, color: '#64748b',
          background: 'var(--navy-2)',
          border: '1px solid var(--navy-border)',
          padding: '3px 10px', borderRadius: 99,
          fontFamily: 'var(--font-mono)',
        }}>
          {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
        </span>
      </header>

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '24px 20px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16, marginBottom: 16,
        }}>
          <EmployeeForm onCreated={handleEmployeeCreated} toast={addToast} />
          <TaskForm employees={employees} onCreated={handleTaskCreated} toast={addToast} />
        </div>

        <TaskList employees={employees} refreshSignal={taskRefresh} toast={addToast} />
      </main>

      <ToastContainer toasts={toasts} />
    </>
  )
}
