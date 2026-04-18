const BASE = '/api'

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
}

export const taskApi = {
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  getByEmployee: (employeeId) => request(`/tasks/employee/${employeeId}`),
  updateStatus: (taskId, status) =>
    request(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}
