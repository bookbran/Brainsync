const express = require('express');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Send a choice prompt to a user
 */
router.post('/prompt', async (req, res) => {
  try {
    const { userId, promptText, promptType = 'task_switch' } = req.body;
    
    if (!userId || !promptText) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and promptText are required'
      });
    }

    // Log the choice prompt
    const choiceLog = await Database.logChoicePrompt(userId, promptText, promptType);
    
    // TODO: Implement SMS sending via Twilio
    // For now, just return success
    
    res.json({
      success: true,
      message: 'Choice prompt sent',
      choiceId: choiceLog.id,
      userId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Choice prompt API error:', error);
    res.status(500).json({
      error: 'Failed to send choice prompt',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Record a user's response to a choice prompt
 */
router.post('/respond', async (req, res) => {
  try {
    const { choiceId, response, satisfaction = null } = req.body;
    
    if (!choiceId || !response) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'choiceId and response are required'
      });
    }

    const updatedChoice = await Database.updateChoiceResponse(choiceId, response, satisfaction);
    
    res.json({
      success: true,
      message: 'Response recorded',
      choice: updatedChoice,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Choice response API error:', error);
    res.status(500).json({
      error: 'Failed to record response',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 