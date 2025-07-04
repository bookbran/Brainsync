const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'healthy',
        api: 'healthy'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasOpenWeatherKey: !!process.env.OPENWEATHER_API_KEY
      }
    };

    res.status(200).json(healthStatus);

  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * Database-specific health check
 */
router.get('/database', async (req, res) => {
  try {
    res.json({
      service: 'database',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(503).json({
      service: 'database',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Detailed system information (for debugging)
 */
router.get('/detailed', async (req, res) => {
  try {
    const systemInfo = {
      application: {
        name: 'goodberry',
        version: '1.0.0',
        description: 'ADHD-friendly calendar management that celebrates your brain',
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        nodeEnv: process.env.NODE_ENV,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      services: {
        database: { status: 'healthy', timestamp: new Date().toISOString() },
        anthropicAI: {
          configured: !!process.env.ANTHROPIC_API_KEY,
          status: process.env.ANTHROPIC_API_KEY ? 'configured' : 'not_configured'
        },
        googleCalendar: {
          configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
          status: (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ? 'configured' : 'not_configured'
        },
        openWeather: {
          configured: !!process.env.OPENWEATHER_API_KEY,
          status: process.env.OPENWEATHER_API_KEY ? 'configured' : 'not_configured'
        }
      },
      endpoints: {
        health: 'GET /health',
        // Future API endpoints will be added here as features are built
      },
      adhd_philosophy: {
        mission: 'Calendar management that celebrates your brain',
        approach: 'Gentle, understanding, zero guilt/shame',
        focus: 'Sunday planning that beats the scaries'
      }
    };

    res.json(systemInfo);

  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(503).json({
      error: 'Health check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Ready/liveness probe for container orchestration
 */
router.get('/ready', async (req, res) => {
  try {
    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Simple alive check
 */
router.get('/alive', (req, res) => {
  res.json({
    alive: true,
            message: '🍇💙 goodberry is alive and ready to beat the Sunday scaries!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 