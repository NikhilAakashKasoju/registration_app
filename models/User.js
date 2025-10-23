// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Please fill a valid 10 digit phone number'],
    },
    whatsappNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please fill a valid 10 digit whatsapp number'],
    },
    address: { type: String, required: true },
    center: { type: String, required: true },
    district: { type: String, required: true },
    mandal: { type: String, required: true },
    village: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true, max: 36 },
    occupation: { type: String, required: true },
    occupationDetails: { type: String },
    isPreceptor: { type: Boolean, default: false },
    gender: { type: String, required: true },
    password: { type: String, required: true }, // Added password field back
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;