const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define a reusable address schema
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  village: { type: String, required: true },
  mandal: { type: String, required: true },
  district: { type: String, required: true },
  center: { type: String, required: true },
}, { _id: false }); // _id: false prevents MongoDB from creating an _id for the sub-document

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
    currentAddress: addressSchema,
    permanentAddress: addressSchema,
    dob: { type: Date, required: true },
    age: { type: Number, required: true, max: 36 },
    occupation: { type: String, required: true },
    occupationDetails: { type: String },
    isPreceptor: { type: Boolean, default: false },
    gender: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;