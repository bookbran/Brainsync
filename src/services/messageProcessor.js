const logger = require('../utils/logger');
const { formatResponse } = require('./twilio');

/**
 * Process an incoming user message and generate a response
 * @param {string} userId - The user's ID
 * @param {string} message - The user's message
 * @returns {Promise<string>} - The formatted response message
 */
const processUserMessage = async (userId, message) => {
  try {
    logger.info('Processing user message:', {
      userId,
      message,
      timestamp: new Date().toISOString()
    });

    // For MVP, we'll start with a simple response
    // This will be enhanced in future steps with actual conversation processing
    return formatResponse(
      "Thanks for sharing that with me! I'm still learning how to help you best.",
      {
        sections: [
          { emoji: "💭", text: "I heard: " + message },
          { emoji: "🎯", text: "What's the most important thing you want to focus on?" }
        ]
      }
    );
  } catch (error) {
    logger.error('Error processing message:', error);
    return formatResponse(
      "I'm having trouble processing that right now.",
      { error: true }
    );
  }
};

module.exports = {
  processUserMessage
}; 