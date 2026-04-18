import React, { useState } from 'react'
import { employeeApi } from '../api'
import { Button, Field, Input, Card, CardTitle } from './UI'

const initial = { name: '', email: '', role: '' }

const PersonIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#0f766e" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="5.5" cy="3.5" r="2"/>
    <path d="M1 10c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"/>
  </svg>
)

export default function EmployeeForm({ onCreated, toast }) {
  const [form, setForm] = useState(initial)
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

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const json = await employeeApi.create({
        name: form.name.trim(), email: form.email.trim(), role: form.role.trim(),
      })
      toast(`${json.data.name} added successfully`, 'success')
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
      <CardTitle icon={<PersonIcon />}>Add Employee</CardTitle>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" error={errors.name}>
          <Input type="text" placeholder="e.g. Satheeskumar M"
            value={form.name} onChange={set('name')} error={errors.name} />
        </Field>
        <Field label="Email address" error={errors.email}>
          <Input type="email" placeholder="satheeskumar@company.com"
            value={form.email} onChange={set('email')} error={errors.email} />
        </Field>
        <Field label="Role" error={errors.role}>
          <Input type="text" placeholder="e.g. Fullstack Developer"
            value={form.role} onChange={set('role')} error={errors.role} />
        </Field>
        <Button type="submit" loading={loading} style={{ marginTop: 6 }}>
          Add Employee
        </Button>
      </form>
    </Card>
  )
}
