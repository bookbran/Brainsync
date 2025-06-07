const twilio = require('twilio');
const logger = require('../utils/logger');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send an SMS message
 * @param {string} to - The recipient's phone number
 * @param {string} message - The message to send
 * @returns {Promise<object>} - The message object from Twilio
 */
const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    logger.info('SMS sent successfully:', {
      to,
      messageId: result.sid,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    logger.error('Failed to send SMS:', {
      error: error.message,
      to,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

/**
 * Format a response message in an ADHD-friendly way
 * @param {string} message - The main message content
 * @param {object} options - Additional formatting options
 * @returns {string} - Formatted message
 */
const formatResponse = (message, options = {}) => {
  const {
    emoji = '🧠',
    sections = [],
    error = false
  } = options;

  let formattedMessage = `${emoji} ${message}\n\n`;

  if (sections.length > 0) {
    sections.forEach(section => {
      formattedMessage += `${section.emoji} ${section.text}\n`;
    });
  }

  if (error) {
    formattedMessage += "\n💙 No worries - we can try again whenever you're ready!";
  }

  return formattedMessage;
};

module.exports = {
  sendSMS,
  formatResponse
}; 