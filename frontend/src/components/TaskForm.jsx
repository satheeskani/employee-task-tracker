import React, { useState } from 'react'
import { taskApi } from '../api'
import { Button, Field, Input, Select, Card, CardTitle } from './UI'

const initial = { employee_id: '', task_title: '', status: 'pending' }

const TaskIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#0f766e" strokeWidth="1.5" strokeLinecap="round">
    <rect x="1" y="1" width="9" height="9" rx="2"/>
    <path d="M3.5 5.5l1.5 1.5 2.5-2.5"/>
  </svg>
)

export default function TaskForm({ employees, onCreated, toast }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.employee_id) e.employee_id = 'Please select an employee'
    if (!form.task_title.trim()) e.task_title = 'Task title is required'
    else if (form.task_title.trim().length < 3) e.task_title = 'Title must be at least 3 characters'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const json = await taskApi.create({
        employee_id: form.employee_id,
        task_title: form.task_title.trim(),
        status: form.status,
      })
      toast(`Task assigned to ${json.data.employee_id.name}`, 'success')
      setForm(initial)
      onCreated(json.data)
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
    <Card>
      <CardTitle icon={<TaskIcon />}>Assign Task</CardTitle>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Assign to" error={errors.employee_id}>
          <Select value={form.employee_id} onChange={set('employee_id')} error={errors.employee_id}>
            <option value="">Select employee…</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name} — {emp.role}</option>
            ))}
          </Select>
        </Field>
        <Field label="Task title" error={errors.task_title}>
          <Input type="text" placeholder="e.g. Build login page"
            value={form.task_title} onChange={set('task_title')} error={errors.task_title} />
        </Field>
        <Field label="Initial status">
          <Select value={form.status} onChange={set('status')}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>
        <Button type="submit" variant="accent" loading={loading} style={{ marginTop: 6 }}>
          Assign Task
        </Button>
      </form>
    </Card>
  )
}
