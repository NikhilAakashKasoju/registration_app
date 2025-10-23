// backend/routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const User = require('../models/User'); // We need the User model to get centers
const { protect } = require('../middleware/authMiddleware');

// @desc    Get a list of all unique center names
// @route   GET /api/attendance/centers
// @access  Private (only logged-in users can see this)
router.get(
  '/centers',
  protect,
  asyncHandler(async (req, res) => {
    // .distinct() finds all unique values for the 'center' field
    const centers = await User.distinct('center');
    res.json(centers);
  })
);

// @desc    Submit new attendance
// @route   POST /api/attendance
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { centerName, isPresent } = req.body;

    if (!centerName || !isPresent) {
      res.status(400);
      throw new Error('Please provide all required attendance data.');
    }

    // You can add more logic here, e.g., prevent duplicate attendance for the same day
    // For now, we'll keep it simple.

    const attendance = new Attendance({
      user: req.user._id, // The user ID comes from our 'protect' middleware
      centerName: centerName,
      attendanceDate: new Date(), // Automatically saves the current date and time
      status: 'Present',
    });

    const createdAttendance = await attendance.save();
    res.status(201).json(createdAttendance);
  })
);

module.exports = router;