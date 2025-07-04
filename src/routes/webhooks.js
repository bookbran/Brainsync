const express = require('express');
const twilio = require('twilio');
const { sendSMS } = require('../services/twilio');
const { processUserMessage } = require('../services/messageProcessor');
const logger = require('../utils/logger');
const StructuredPrioritizationEngine = require('../services/structuredPrioritizationEngine');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

const prioritizationEngine = new StructuredPrioritizationEngine();

/**
 * Advanced SMS webhook with StructuredPrioritizationEngine
 * 10-phase intelligent conversation system with Anthropic AI
 */
router.post('/sms', async (req, res) => {
  try {
    const { Body: message, From: phoneNumber } = req.body;
    
    logger.info('📱 Received SMS message', { 
      phoneNumber, 
      messageLength: message?.length || 0 
    });

    // Get or create user based on phone number
    const user = await getUserByPhone(phoneNumber);
    
    // Smart structured prioritization - automatically resume or start
    const result = await prioritizationEngine.processConversation(
      user.id, 
      message,
      user.active_conversation_id
    );
    
    // Update user's active conversation if new
    if (!user.active_conversation_id || user.active_conversation_id !== result.conversationId) {
      await updateUserActiveConversation(user.id, result.conversationId);
    }
    
    // Create TwiML response with intelligent conversation result
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(result.response);

    res.type('text/xml').send(twiml.toString());
    
    logger.info('🎯 Sent smart structured prioritization response', {
      userId: user.id,
      conversationId: result.conversationId,
      phase: result.currentPhase,
      phaseCompleted: result.phaseCompleted,
      isResuming: result.isResuming,
      completedPhases: result.completedPhases
    });

  } catch (error) {
    logger.error('❌ Error processing SMS webhook', {
      error: error.message,
      stack: error.stack,
      phoneNumber: req.body?.From,
      message: req.body?.Body
    });
    
    console.error('🚨 FULL ERROR DETAILS:', error);
    console.error('🚨 ERROR STACK:', error.stack);
    
    // Fallback to simple messageProcessor if StructuredPrioritizationEngine has issues
    try {
      logger.info('🔄 Attempting fallback to messageProcessor');
      const { Body: message, From: phoneNumber } = req.body;
      
      // FORCE enhanced onboarding for any user without conversation history
      const { getUserContext } = require('../services/messageProcessor');
      const userContext = getUserContext(phoneNumber);
      
      // Always force enhanced onboarding for users with no conversation history
      if (userContext.conversationHistory.length === 0) {
        userContext.isNewUser = true;
        // Clear any existing history to ensure fresh start
        userContext.conversationHistory = [];
        logger.info('🎯 FORCING enhanced onboarding for user with no conversation history');
      }
      
      const fallbackResponse = await processUserMessage(phoneNumber, message);
      
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message(fallbackResponse);
      
      logger.info('✅ Fallback response sent successfully');
      return res.type('text/xml').send(twiml.toString());
      
    } catch (fallbackError) {
      logger.error('❌ Fallback also failed', { fallbackError: fallbackError.message });
    }
    
    // Send error response via TwiML only if fallback also fails
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("🧠💙 I'm having a moment! Can you try again in a bit?");
    
    res.type('text/xml').send(twiml.toString());
  }
});

/**
 * Test endpoint for Twilio setup
 */
router.get('/test-sms', async (req, res) => {
  try {
    const { to, message } = req.query;
    
    if (!to || !message) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['to', 'message'],
        example: '/webhooks/test-sms?to=+1234567890&message=Hello%20World'
      });
    }

    const result = await sendSMS(to, message);
    
    res.json({
      success: true,
      messageId: result.sid,
      to,
      message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Test SMS failed:', error);
    res.status(500).json({
      error: 'Failed to send test SMS',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Webhook status endpoint
 */
router.get('/status', (req, res) => {
  res.json({
    service: 'webhooks',
    status: 'active',
    endpoints: {
      sms: 'POST /webhooks/sms',
      testSms: 'GET /webhooks/test-sms'
    },
    twilio: {
      configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      phoneNumber: !!process.env.TWILIO_PHONE_NUMBER
    },
    timestamp: new Date().toISOString()
  });
});





/**
 * 👤 Get user by phone number
 * @param {string} phoneNumber - User's phone number  
 * @returns {Object} User record
 */
async function getUserByPhone(phoneNumber) {
  try {
    console.log('🔍 Looking up user by phone:', phoneNumber);
    
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phoneNumber)
      .single();
    
    console.log('📊 User lookup result:', { existingUser, selectError });
    
    if (existingUser && !selectError) {
      console.log('✅ Found existing user:', existingUser.id);
      return existingUser;
    }
    
    console.log('🆕 Creating new user for phone:', phoneNumber);
    
    // Create new user if doesn't exist
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        phone: phoneNumber,
        email: `phone_${phoneNumber.replace(/\D/g, '')}@example.com`,
        name: `User ${phoneNumber.slice(-4)}`,
        adhd_diagnosis: false
      }])
      .select()
      .single();
    
    console.log('📊 User creation result:', { newUser, insertError });
    
    if (insertError) throw insertError;
    
    logger.info('✅ Created new user', { 
      userId: newUser.id, 
      phoneNumber 
    });
    
    return newUser;
    
  } catch (error) {
    console.error('🚨 getUserByPhone ERROR:', error);
    logger.error('❌ Error getting/creating user', { 
      phoneNumber, 
      error: error.message 
    });
    throw error;
  }
}

/**
 * 🔄 Update user's active conversation
 * @param {string} userId - User ID
 * @param {string} conversationId - Conversation ID
 */
async function updateUserActiveConversation(userId, conversationId) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ active_conversation_id: conversationId })
      .eq('id', userId);
    
    if (error) throw error;
    
    logger.info('🔄 Updated user active conversation', { 
      userId, 
      conversationId 
    });
    
  } catch (error) {
    logger.error('❌ Error updating active conversation', { 
      userId, 
      conversationId, 
      error: error.message 
    });
    throw error;
  }
}

module.exports = router; 