const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);

// Tasks collection & dashboard statistics
router.get('/', getTasks);
router.post('/', createTask);
router.get('/stats', getTaskStats);
router.get('/statistics', getTaskStats); // Alias for spec compatibility

// Single task operations
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.put('/:id/status', updateTaskStatus); // PUT alias for status update
router.delete('/:id', deleteTask);

module.exports = router;
