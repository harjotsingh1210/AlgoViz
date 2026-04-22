require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:8080',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow: no origin (curl/Postman), localhost, vercel.app, netlify.app, explicit CLIENT_URL
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('.vercel.app') ||
      origin.includes('.netlify.app') ||
      origin.includes('.web.app') ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      console.warn('CORS blocked:', origin);
      callback(null, true); // Allow all for now — tighten after testing
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/algorithms', require('./routes/algorithms'));

// Health check + keep-alive ping (prevents Render cold start)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AlgoViz API is running 🚀', timestamp: new Date().toISOString() });
});
app.get('/ping', (req, res) => res.send('pong'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 AlgoViz API running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
