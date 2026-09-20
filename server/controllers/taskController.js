const Task = require('../models/Task');

// @desc    Get all tasks for logged in user (with filtering, search, sorting)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, projectName, sortBy } = req.query;
    const filter = { userId: req.user._id };

    // Search by text in title, description, or projectName
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { projectName: regex }
      ];
    }

    // Filter by status
    if (status && ['todo', 'inprogress', 'completed'].includes(status)) {
      filter.status = status;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filter.priority = priority;
    }

    // Filter by project
    if (projectName && projectName.trim() !== '' && projectName !== 'all') {
      filter.projectName = projectName.trim();
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest first
    if (sortBy === 'dueDate-asc') {
      sortOptions = { dueDate: 1, createdAt: -1 };
    } else if (sortBy === 'dueDate-desc') {
      sortOptions = { dueDate: -1, createdAt: -1 };
    } else if (sortBy === 'createdAt-asc') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'priority-high') {
      // Custom sorting priority handled in app or secondary
      sortOptions = { priority: 1, createdAt: -1 };
    }

    const tasks = await Task.find(filter).sort(sortOptions);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get summary statistics and analytics for dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const allTasks = await Task.find({ userId });

    const total = allTasks.length;
    const todo = allTasks.filter((t) => t.status === 'todo').length;
    const inprogress = allTasks.filter((t) => t.status === 'inprogress').length;
    const completed = allTasks.filter((t) => t.status === 'completed').length;

    const now = new Date();
    const overdue = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;

    const priorityCounts = {
      high: allTasks.filter((t) => t.priority === 'high').length,
      medium: allTasks.filter((t) => t.priority === 'medium').length,
      low: allTasks.filter((t) => t.priority === 'low').length
    };

    // Get list of distinct projects
    const projects = [
      ...new Set(allTasks.map((t) => t.projectName).filter(Boolean))
    ];

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        todo,
        inprogress,
        completed,
        overdue,
        completionRate,
        priorityCounts,
        projects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectName, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      userId: req.user._id,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectName: projectName && projectName.trim() !== '' ? projectName.trim() : 'General',
      tags: Array.isArray(tags) ? tags : [],
      completedAt: status === 'completed' ? new Date() : null
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate, projectName, tags } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (projectName !== undefined) task.projectName = projectName.trim() || 'General';
    if (tags !== undefined) task.tags = Array.isArray(tags) ? tags : [];
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    if (status !== undefined && status !== task.status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }

    const updatedTask = await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status only (ideal for Kanban drag and drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['todo', 'inprogress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be todo, inprogress, or completed.'
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    const updatedTask = await task.save();

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task removed successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
