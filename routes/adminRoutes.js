// backend/routes/adminRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const User = require('../models/User'); // To access all registered users
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware'); // Admin protection middleware

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Admin token can be shorter
  });
};

// @desc    Register a new admin (for initial setup, ideally done once manually)
// @route   POST /api/admin/register
// @access  Public (should be protected in production after initial setup)
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      res.status(400);
      throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
      username,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
        message: 'Admin registered successfully. Please delete this route after initial setup.'
      });
    } else {
      res.status(400);
      throw new Error('Invalid admin data');
    }
  })
);


// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid username or password');
    }
  })
);

// @desc    Get all registered users (Master Data)
// @route   GET /api/admin/users
// @access  Private (Admin Only)
router.get(
  '/users',
  protect, // Protect this route with admin authentication
  asyncHandler(async (req, res) => {
    const users = await User.find({}); // Fetch all users
    res.json(users);
  })
);

module.exports = router;