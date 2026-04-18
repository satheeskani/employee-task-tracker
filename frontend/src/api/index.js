const BASE = 'https://employee-task-tracker-qjlm.onrender.com/api'

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message || 'Request failed')
  return json
}

export const employeeApi = {
  getAll: () => request('/employees'),
  create: (data) => request('/employees', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
}

export const taskApi = {
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  getByEmployee: (employeeId) => request(`/tasks/employee/${employeeId}`),
  updateStatus: (taskId, status) =>
    request(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}
