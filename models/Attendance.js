// backend/models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
  {
    // Link to the user who is marking attendance
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a reference to our User model
    },
    centerName: {
      type: String,
      required: [true, 'Center name is required'],
    },
    attendanceDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Present'], // For now, we only have 'Present'
      default: 'Present',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;