const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// --- Static File Serving (for Production) ---
if (process.env.NODE_ENV === 'production') {
  // The 'dist' folder will be inside our backend directory
  const buildPath = path.join(__dirname, 'dist');
  app.use(express.static(buildPath));

  // For any other route, serve the index.html from the build
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(buildPath, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running successfully in development...');
  });
}

// --- Custom Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // For security, only show the stack trace when not in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});