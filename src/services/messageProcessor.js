const logger = require('../utils/logger');
const { formatResponse } = require('./twilio');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple in-memory user store (will be replaced with database later)
const userMemory = new Map();

/**
 * Get or create user context from memory
 * @param {string} phoneNumber - The user's phone number
 * @returns {object} - User context object
 */
const getUserContext = (phoneNumber) => {
  if (!userMemory.has(phoneNumber)) {
    userMemory.set(phoneNumber, {
      phoneNumber,
      conversationHistory: [],
      preferences: {},
      calendarEvents: [],
      lastInteraction: null,
      isNewUser: true
    });
  }
  
  const context = userMemory.get(phoneNumber);
  context.lastInteraction = new Date().toISOString();
  return context;
};

/**
 * Add message to user's conversation history
 * @param {string} phoneNumber - The user's phone number
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message content
 */
const addToHistory = (phoneNumber, role, content) => {
  const context = getUserContext(phoneNumber);
  context.conversationHistory.push({
    role,
    content,
    timestamp: new Date().toISOString()
  });
  
  // Keep last 10 messages to maintain context without hitting token limits
  if (context.conversationHistory.length > 10) {
    context.conversationHistory = context.conversationHistory.slice(-10);
  }
};

/**
 * Detect user intent from their message
 * @param {string} message - The user's message
 * @returns {string} - Detected intent
 */
const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Calendar planning intents
  if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || 
      lowerMessage.includes('calendar') || lowerMessage.includes('week')) {
    return 'calendar_planning';
  }
  
  // Specific event scheduling
  if (lowerMessage.includes('meeting') || lowerMessage.includes('appointment') || 
      lowerMessage.includes('call') || lowerMessage.includes('presentation')) {
    return 'event_scheduling';
  }
  
  // Time expressions indicate scheduling
  if (lowerMessage.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/) ||
      lowerMessage.match(/\b\d{1,2}:\d{2}\b/) || lowerMessage.match(/\b\d{1,2}(am|pm)\b/)) {
    return 'event_scheduling';
  }
  
  // ADHD support keywords
  if (lowerMessage.includes('overwhelm') || lowerMessage.includes('stress') || 
      lowerMessage.includes('focus') || lowerMessage.includes('procrastinat')) {
    return 'adhd_support';
  }
  
  // Greeting/introduction
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
      lowerMessage.includes('hey') || lowerMessage.includes('start')) {
    return 'greeting';
  }
  
  return 'general';
};

/**
 * Extract calendar events from user message
 * @param {string} message - The user's message
 * @returns {array} - Array of potential calendar events
 */
const extractCalendarEvents = (message) => {
  const events = [];
  const lowerMessage = message.toLowerCase();
  
  // Look for day + time patterns
  const dayTimePattern = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+.*?(\d{1,2}:\d{2}|\d{1,2}(am|pm))/gi;
  const matches = message.match(dayTimePattern);
  
  if (matches) {
    matches.forEach(match => {
      events.push({
        rawText: match.trim(),
        type: 'potential_event',
        needsConfirmation: true
      });
    });
  }
  
  // Look for event type keywords
  const eventTypes = ['meeting', 'appointment', 'call', 'presentation', 'dentist', 'doctor'];
  eventTypes.forEach(type => {
    if (lowerMessage.includes(type)) {
      events.push({
        eventType: type,
        rawText: message,
        needsConfirmation: true
      });
    }
  });
  
  return events;
};

/**
 * Generate ADHD-friendly AI response using Anthropic
 * @param {object} userContext - The user's context and history
 * @param {string} currentMessage - The current message from user
 * @param {string} intent - The detected intent
 * @returns {Promise<string>} - AI-generated response
 */
const generateAIResponse = async (userContext, currentMessage, intent) => {
  try {
    const systemPrompt = `You are goodberry, an ADHD-friendly calendar assistant with a genuinely funny, understanding personality. You help people with ADHD manage their schedules through conversation.

PERSONALITY TRAITS:
- Genuinely funny and quirky (not fake-friendly AI)
- Understands ADHD challenges deeply
- Uses humor to make planning feel less overwhelming
- Celebrates every choice, even "creative" ones
- Always offers 3 options, never binary choices
- Uses inclusive, person-first language

LANGUAGE GUIDELINES - NEVER USE STIGMATIZING LANGUAGE:
❌ DON'T SAY: "your ADHD brain", "ADHD brains need", "your neurodivergent brain"
✅ DO SAY: "you", "your brain", "you might find helpful", "many people find"
❌ DON'T: Separate the person from their neurodivergence
✅ DO: Speak to the whole person with understanding and respect

CONVERSATION STYLE:
- Use emojis naturally (🧠💙📅⚡🎯)
- Keep responses concise but warm
- Ask ONE question at a time
- Acknowledge challenges authentically without othering
- Make planning feel energizing, not pressuring
- Use "beautiful chaos" and "brain trap" sparingly and naturally

CURRENT INTENT: ${intent}

USER CONTEXT:
- Phone: ${userContext.phoneNumber}
- New user: ${userContext.isNewUser}
- Previous messages: ${userContext.conversationHistory.length}

CONVERSATION HISTORY:
${userContext.conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: currentMessage
        }
      ]
    });

    return response.content[0].text;
  } catch (error) {
    logger.error('Error generating AI response:', error);
    
    // Fallback responses based on intent
    switch (intent) {
      case 'greeting':
        return "🧠 Hey there! I'm goodberry, your calendar buddy! Ready to turn that beautiful chaos into a plan that actually works? What's on your mind? 💙";
      
      case 'calendar_planning':
        return "📅 Love the planning energy! Let's make this week work for you. What's the most important thing you want to focus on? 🎯";
      
      case 'event_scheduling':
        return "⚡ Got it! I can help you schedule that. When were you thinking, and should I add some buffer time so you're not running from thing to thing? 💙";
      
      case 'adhd_support':
        return "💙 I totally get it. You deserve strategies that work for you. Want to break this down into smaller, less overwhelming pieces? You've got this! 🧠";
      
      default:
        return "🧠 Thanks for sharing that! I'm here to help make your calendar work for you. What can we tackle together? 💙";
    }
  }
};

/**
 * Process an incoming user message and generate a response
 * @param {string} phoneNumber - The user's phone number (from Twilio)
 * @param {string} message - The user's message
 * @returns {Promise<string>} - The formatted response message
 */
const processUserMessage = async (phoneNumber, message) => {
  try {
    logger.info('Processing user message:', {
      phoneNumber,
      message,
      timestamp: new Date().toISOString()
    });

    // Get user context and add current message to history
    const userContext = getUserContext(phoneNumber);
    addToHistory(phoneNumber, 'user', message);
    
    // Detect intent and extract potential events
    const intent = detectIntent(message);
    const potentialEvents = extractCalendarEvents(message);
    
    logger.info('Detected intent and events:', {
      phoneNumber,
      intent,
      eventsFound: potentialEvents.length
    });
    
    // Generate AI response
    const aiResponse = await generateAIResponse(userContext, message, intent);
    
    // Add AI response to history
    addToHistory(phoneNumber, 'assistant', aiResponse);
    
    // Mark user as no longer new after first interaction
    if (userContext.isNewUser) {
      userContext.isNewUser = false;
    }
    
    // Store potential events for future processing
    if (potentialEvents.length > 0) {
      userContext.calendarEvents.push(...potentialEvents);
    }
    
    logger.info('Generated AI response:', {
      phoneNumber,
      responseLength: aiResponse.length,
      historyLength: userContext.conversationHistory.length
    });

    return aiResponse;
    
  } catch (error) {
    logger.error('Error processing message:', error);
    return "🧠💙 I'm having a moment! Can you try again in a bit? My ADHD brain is buffering... 😅";
  }
};

module.exports = {
  processUserMessage,
  getUserContext,
  detectIntent,
  extractCalendarEvents
}; 