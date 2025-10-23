// backend/routes/userRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user & get token
// @route   POST /api/users/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const { password, ...userData } = req.body;
  const userExists = await User.findOne({ phoneNumber: userData.phoneNumber });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this phone number.');
  }

  const user = await User.create({ ...userData, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      phoneNumber: user.phoneNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data.');
  }
}));

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = await User.findOne({ phoneNumber });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      phoneNumber: user.phoneNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid phone number or password.');
  }
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protectUser, asyncHandler(async (req, res) => {
  // req.user is attached by the protectUser middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protectUser, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.address = req.body.address || user.address;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.whatsappNumber = req.body.whatsappNumber || user.whatsappNumber;
    user.center = req.body.center || user.center;
    user.occupation = req.body.occupation || user.occupation;
    user.occupationDetails = req.body.occupationDetails || user.occupationDetails;
        
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
}));

module.exports = router;