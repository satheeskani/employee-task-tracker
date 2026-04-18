const mongoose = require('mongoose');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

const taskSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      index: true, // index for fast lookups by employee
    },
    task_title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters'],
      maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
