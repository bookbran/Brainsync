const express = require('express');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');
const { sendSMS, formatResponse } = require('../services/twilio');
const { processUserMessage } = require('../services/messageProcessor');

const router = express.Router();

/**
 * Handle incoming SMS responses (Twilio webhook)
 */
router.post('/sms', async (req, res) => {
  try {
    const { Body, From } = req.body;
    
    logger.info('SMS webhook received:', {
      from: From,
      body: Body,
      timestamp: new Date().toISOString()
    });

    // Look up user by phone number
    const user = await Database.getUserByPhone(From);
    
    if (!user) {
      // New user - send welcome message
      const welcomeMessage = formatResponse(
        "Welcome to BrainSync! 🎉 I'm your ADHD-friendly calendar assistant.",
        {
          sections: [
            { emoji: "💡", text: "I help you build your calendar through natural conversation" },
            { emoji: "🛡️", text: "I protect your mental health gaps and energy patterns" },
            { emoji: "🎯", text: "Let's start with what's on your mind right now" }
          ]
        }
      );
      
      await sendSMS(From, welcomeMessage);
    } else {
      // Existing user - process their message
      const response = await processUserMessage(user.id, Body);
      await sendSMS(From, response);
    }
    
    // Send TwiML response
    res.status(200).send('<Response></Response>');
    
  } catch (error) {
    logger.error('SMS webhook error:', error);
    
    // Send friendly error message to user
    const errorMessage = formatResponse(
      "Oops! Something went wrong on my end.",
      { error: true }
    );
    
    try {
      await sendSMS(req.body.From, errorMessage);
    } catch (sendError) {
      logger.error('Failed to send error message:', sendError);
    }
    
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