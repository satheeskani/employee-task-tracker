const { body, param, validationResult } = require('express-validator');

// Sends 400 with all validation errors if any exist
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateEmployee = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isLength({ max: 100 }).withMessage('Role cannot exceed 100 characters'),
  validate,
];

const validateTask = [
  body('employee_id')
    .notEmpty().withMessage('employee_id is required')
    .isMongoId().withMessage('employee_id must be a valid ID'),
  body('task_title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3–200 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be: pending, in-progress, or completed'),
  validate,
];

const validateStatusUpdate = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be: pending, in-progress, or completed'),
  validate,
];

module.exports = { validateEmployee, validateTask, validateStatusUpdate };
