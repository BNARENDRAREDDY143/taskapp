const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

// Seed initial sample tasks for fresh accounts
const seedStarterTasks = async (userId) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sampleTasks = [
    {
      title: 'Design High-Fidelity UI System',
      description: 'Create harmonious dark & light themes, component tokens, and responsive layouts.',
      userId,
      status: 'completed',
      priority: 'high',
      projectName: 'Design System',
      dueDate: yesterday,
      completedAt: new Date()
    },
    {
      title: 'Build RESTful API & JWT Auth',
      description: 'Implement secure password hashing with bcryptjs and JWT bearer token authorization.',
      userId,
      status: 'completed',
      priority: 'high',
      projectName: 'Backend API',
      dueDate: tomorrow,
      completedAt: new Date()
    },
    {
      title: 'Interactive Kanban Drag-and-Drop',
      description: 'Enable smooth dragging of task cards between To-Do, In Progress, and Completed columns.',
      userId,
      status: 'inprogress',
      priority: 'medium',
      projectName: 'Frontend UI',
      dueDate: tomorrow
    },
    {
      title: 'Real-time Search & Filter Engine',
      description: 'Allow instant multi-faceted filtering by status, priority level, and project category.',
      userId,
      status: 'inprogress',
      priority: 'medium',
      projectName: 'Frontend UI',
      dueDate: nextWeek
    },
    {
      title: 'Deploy to Cloud & Performance Audit',
      description: 'Run production build, bundle optimization, and verify accessibility standards.',
      userId,
      status: 'todo',
      priority: 'low',
      projectName: 'DevOps',
      dueDate: nextWeek
    }
  ];

  try {
    await Task.insertMany(sampleTasks);
  } catch (err) {
    console.error('Error seeding starter tasks:', err.message);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, username, firstName, lastName } = req.body;

    const finalName = name || (firstName && lastName ? `${firstName} ${lastName}`.trim() : username || email?.split('@')[0]);

    if (!email || !password || !finalName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name/username, email, password)'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Create user
    const user = await User.create({
      name: finalName,
      firstName: firstName || '',
      lastName: lastName || '',
      username: username || email.split('@')[0],
      email: email.toLowerCase(),
      password,
      lastLogin: new Date()
    });

    if (user) {
      await seedStarterTasks(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email }
      ]
    });

    if (user && (await user.matchPassword(password))) {
      // Record last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email/username or password'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};
