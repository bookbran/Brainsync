const express = require('express');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Handle incoming SMS responses (Twilio webhook)
 */
router.post('/sms', async (req, res) => {
  try {
    // TODO: Implement Twilio SMS webhook handling
    // Parse incoming SMS and match to choice prompts
    
    logger.info('SMS webhook received:', req.body);
    
    res.status(200).send('<Response></Response>'); // TwiML response
    
  } catch (error) {
    logger.error('SMS webhook error:', error);
    res.status(500).send('<Response><Message>Error processing message</Message></Response>');
  }
});

/**
 * Handle email engagement tracking
 */
router.post('/email', async (req, res) => {
  try {
    // TODO: Implement email engagement tracking (opens, clicks, replies)
    
    logger.info('Email webhook received:', req.body);
    
    res.json({
      success: true,
      message: 'Email event processed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Email webhook error:', error);
    res.status(500).json({
      error: 'Failed to process email event',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Store user feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    const { userId, feedbackText, rating = null, context = {} } = req.body;
    
    if (!userId || !feedbackText) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and feedbackText are required'
      });
    }

    const feedback = await Database.storeFeedback(userId, feedbackText, rating, context);
    
    res.json({
      success: true,
      message: 'Feedback stored successfully',
      feedbackId: feedback.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Feedback webhook error:', error);
    res.status(500).json({
      error: 'Failed to store feedback',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 