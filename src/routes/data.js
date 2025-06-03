const express = require('express');
const { DataCollector } = require('../services/dataCollector');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Collect all data for a user
 */
router.post('/collect', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'userId is required',
        example: { userId: '8ded07e7-9f3d-4737-a4f7-18fb1d6564c0' }
      });
    }

    logger.info(`🔄 Starting data collection via API for user ${userId}`);
    
    const results = await DataCollector.collectUserData(userId);
    
    res.json({
      success: true,
      message: 'Data collection completed',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Data collection API error:', error);
    res.status(500).json({
      error: 'Data collection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Collect data for all active users
 */
router.post('/collect-all', async (req, res) => {
  try {
    logger.info('🔄 Starting bulk data collection for all active users');
    
    const activeUsers = await Database.getActiveUsers();
    const results = [];
    
    for (const user of activeUsers) {
      try {
        const userResults = await DataCollector.collectUserData(user.id);
        results.push({
          userId: user.id,
          email: user.email,
          success: true,
          results: userResults
        });
        logger.info(`✅ Data collected for user ${user.email}`);
      } catch (error) {
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: error.message
        });
        logger.warn(`❌ Data collection failed for user ${user.email}:`, error.message);
      }
    }

    const summary = {
      totalUsers: activeUsers.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };

    logger.info('📊 Bulk data collection completed:', summary);

    res.json({
      success: true,
      message: 'Bulk data collection completed',
      summary,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Bulk data collection API error:', error);
    res.status(500).json({
      error: 'Bulk data collection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get recent data points for a user
 */
router.get('/recent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { hours = 24, limit = 10 } = req.query;
    
    const dataPoints = await Database.getRecentDataPoints(
      userId, 
      parseInt(hours), 
      parseInt(limit)
    );
    
    // Group by category for easier consumption
    const grouped = dataPoints.reduce((acc, point) => {
      if (!acc[point.category]) {
        acc[point.category] = [];
      }
      acc[point.category].push({
        id: point.id,
        data: point.data,
        metadata: point.metadata,
        timestamp: point.timestamp
      });
      return acc;
    }, {});

    res.json({
      success: true,
      userId,
      timeframe: `${hours} hours`,
      totalDataPoints: dataPoints.length,
      categories: Object.keys(grouped),
      data: grouped,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get recent data API error:', error);
    res.status(500).json({
      error: 'Failed to retrieve recent data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Store a custom data point
 */
router.post('/store', async (req, res) => {
  try {
    const { userId, category, data, metadata = {} } = req.body;
    
    if (!userId || !category || !data) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId, category, and data are required',
        example: {
          userId: '8ded07e7-9f3d-4737-a4f7-18fb1d6564c0',
          category: 'custom',
          data: { message: 'User completed a task' },
          metadata: { source: 'mobile_app' }
        }
      });
    }

    const result = await Database.storeDataPoint(userId, category, data, metadata);
    
    res.json({
      success: true,
      message: 'Data point stored successfully',
      dataPoint: {
        id: result.id,
        userId: result.user_id,
        category: result.category,
        timestamp: result.timestamp
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Store data API error:', error);
    res.status(500).json({
      error: 'Failed to store data point',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get data collection status/statistics
 */
router.get('/status', async (req, res) => {
  try {
    // Get recent data collection statistics
    const activeUsers = await Database.getActiveUsers();
    
    // You could enhance this with more detailed statistics
    const status = {
      activeUsers: activeUsers.length,
      lastCollectionTime: new Date().toISOString(),
      supportedSources: [
        'google_calendar',
        'openweather',
        'habitica',
        'custom'
      ],
      dataRetentionDays: 30,
      collectionsToday: 'Not implemented yet', // Could query database for this
      system: {
        status: 'operational',
        version: '1.0.0'
      }
    };

    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Data status API error:', error);
    res.status(500).json({
      error: 'Failed to get data status',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Test data collection for a single source
 */
router.post('/test/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId',
        message: 'userId is required for testing'
      });
    }

    const user = await Database.getUser(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User ${userId} not found`
      });
    }

    let result;
    switch (source.toLowerCase()) {
      case 'calendar':
        result = await DataCollector.collectCalendarData(user);
        break;
      case 'weather':
        result = await DataCollector.collectWeatherData(user);
        break;
      case 'habitica':
        result = await DataCollector.collectHabiticaData(user);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid source',
          message: `Source '${source}' not supported`,
          supportedSources: ['calendar', 'weather', 'habitica']
        });
    }

    res.json({
      success: true,
      source: source.toLowerCase(),
      userId,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Test ${source} API error:`, error);
    res.status(500).json({
      error: `Failed to test ${source} collection`,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 