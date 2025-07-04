const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');

// Import routes
const healthRoutes = require('./routes/health');
const webhookRoutes = require('./routes/webhooks');
const authRoutes = require('./routes/auth');
// Future routes can be added here as the product grows

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://goodberry.com'] // Update with your actual domain
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
  }
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/auth', authRoutes);
// Waitlist routes will be added here when needed
// Future API routes can be added here as the product grows

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🍇 goodberry API - ADHD-friendly calendar management',
    version: '1.0.0',
    status: 'active',
    documentation: '/health',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /webhooks/sms',
      'GET /webhooks/test-sms',
      'GET /webhooks/status',
      'GET /auth/google',
      'GET /auth/google/callback',
      'GET /auth/google/test'
      // More endpoints will be added as features are built
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    error: 'Internal server error',
    message: isDevelopment ? error.message : 'Something went wrong, please try again later',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 goodberry server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
  logger.info('🍇 Ready for ADHD-friendly calendar management features');
});

module.exports = app; 