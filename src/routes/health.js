const express = require('express');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/', async (req, res) => {
  try {
    const dbHealth = await Database.healthCheck();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: dbHealth.status,
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

    // Overall health based on critical services
    if (dbHealth.status !== 'healthy') {
      healthStatus.status = 'degraded';
    }

    res.status(healthStatus.status === 'healthy' ? 200 : 503).json(healthStatus);

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
    const dbHealth = await Database.healthCheck();
    res.json({
      service: 'database',
      ...dbHealth
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
    const dbHealth = await Database.healthCheck();
    
    const systemInfo = {
      application: {
        name: 'BrainSync Pro',
        version: '1.0.0',
        description: 'ADHD-friendly choice empowerment system',
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
        database: dbHealth,
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
        dataCollection: 'POST /api/data/collect',
        aiAnalysis: 'POST /api/analysis/generate',
        choicePrompts: 'POST /api/choices/prompt',
        webhooks: {
          sms: 'POST /webhooks/sms',
          email: 'POST /webhooks/email'
        }
      },
      adhd_philosophy: {
        mission: 'Choice empowerment for ADHD minds',
        approach: 'Gentle, understanding, zero guilt/shame',
        focus: 'Celebrating conscious decision-making'
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
    // Check if critical services are available
    const dbHealth = await Database.healthCheck();
    
    if (dbHealth.status === 'healthy') {
      res.status(200).json({
        ready: true,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        ready: false,
        reason: 'Database not healthy',
        timestamp: new Date().toISOString()
      });
    }
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
    message: '🧠💙 BrainSync Pro is alive and celebrating your choices!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 