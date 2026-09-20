const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'completed'],
      default: 'todo',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true
    },
    dueDate: {
      type: Date,
      default: null
    },
    projectName: {
      type: String,
      default: 'General',
      trim: true,
      maxlength: [50, 'Project name cannot exceed 50 characters']
    },
    tags: {
      type: [String],
      default: []
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Automatically manage completedAt on save
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'completed') {
      this.completedAt = null;
    }
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
