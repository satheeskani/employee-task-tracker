const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { validateEmployee } = require('../middleware/validators');

// POST /api/employees — Create a new employee
router.post('/', validateEmployee, async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const employee = await Employee.create({ name, email, role });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/employees — List all employees (useful for the frontend dropdown)
router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/employees/:id — Get single employee
router.get('/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
