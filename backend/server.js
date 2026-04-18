// Root — API info
app.get('/', (req, res) => {
  res.json({
    name: 'Employee Task Tracker API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      employees: '/api/employees',
      tasks: '/api/tasks',
      health: '/health',
    },
    github: 'https://github.com/satheeskani/employee-task-tracker',
  });
});