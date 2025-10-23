// backend/config/db.js

const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database.
 */
const connectDB = async () => {
  try {
    // This is the updated connection line without the deprecated options.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;