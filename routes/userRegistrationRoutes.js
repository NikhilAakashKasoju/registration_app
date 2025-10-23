// backend/routes/userRegistrationRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const router = express.Router();

// @desc    Register a new user (for master data)
// @route   POST /api/register
// @access  Public
router.post(
  '/', // The route path will be `/api/register`
  asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      userId,
      phoneNumber,
      whatsappNumber,
      address,
      center,
      district,
      mandal,
      village,
      dob,
      age,
      occupation,
      occupationDetails,
      isPreceptor,
      gender,
    } = req.body;

    // Check if user already exists based on phone number or userId
    const userExists = await User.findOne({ $or: [{ phoneNumber }, { userId }] });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this Phone Number or ID.');
    }

    // Create a new user entry
    const user = await User.create({
      firstName,
      lastName,
      userId,
      phoneNumber,
      whatsappNumber,
      address,
      center,
      district,
      mandal,
      village,
      dob,
      age,
      occupation,
      occupationDetails,
      isPreceptor,
      gender,
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully!',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userId: user.userId,
          phoneNumber: user.phoneNumber,
        }
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided.');
    }
  })
);

module.exports = router;