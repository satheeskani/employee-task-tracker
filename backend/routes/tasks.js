const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Employee = require('../models/Employee');
const { validateTask, validateStatusUpdate } = require('../middleware/validators');

// POST /api/tasks — Create a task for an employee
router.post('/', validateTask, async (req, res, next) => {
  try {
    const { employee_id, task_title, status } = req.body;

    // Verify the employee exists before creating the task
    const employee = await Employee.findById(employee_id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found. Cannot assign task to a non-existent employee.',
      });
    }

    const task = await Task.create({ employee_id, task_title, status });
    const populated = await task.populate('employee_id', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/employee/:employeeId — List all tasks for an employee
router.get('/employee/:employeeId', async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    // Validate the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const tasks = await Task.find({ employee_id: employeeId })
      .sort({ createdAt: -1 })
      .populate('employee_id', 'name email role');

    res.json({
      success: true,
      employee: { id: employee._id, name: employee.name, role: employee.role },
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id/status — Update task status
router.patch('/:id/status', validateStatusUpdate, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate('employee_id', 'name email role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task status updated',
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id — Get single task
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('employee_id', 'name email role');
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
