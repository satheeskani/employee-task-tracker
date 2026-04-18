const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const { validateEmployee } = require('../middleware/validators');

// POST /api/employees — Create
router.post('/', validateEmployee, async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const employee = await Employee.create({ name, email, role });
    res.status(201).json({ success: true, message: 'Employee created successfully', data: employee });
  } catch (error) { next(error); }
});

// GET /api/employees — List all
router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) { next(error); }
});

// GET /api/employees/:id — Single
router.get('/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (error) { next(error); }
});

// PUT /api/employees/:id — Update
router.put('/:id', validateEmployee, async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) { next(error); }
});

// DELETE /api/employees/:id — Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Delete all tasks belonging to this employee
    await Task.deleteMany({ employee_id: req.params.id });

    await employee.deleteOne();
    res.json({ success: true, message: 'Employee and their tasks deleted successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
