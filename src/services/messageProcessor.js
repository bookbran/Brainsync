const logger = require('../utils/logger');
const { formatResponse } = require('./twilio');
const { Anthropic } = require('@anthropic-ai/sdk');
const { 
  getCalendarEvents, 
  createCalendarEvent, 
  getTaskLists,
  isAuthenticated,
  setUserTokens 
} = require('./googleApi');

// Import new event creation services
const { parseEventFromMessage, formatEventConfirmation } = require('./eventParser');
const { applyBufferTimeWithConflicts, generateBufferExplanation } = require('./bufferTimeAlgorithm');
const { 
  generateConfirmationMessage, 
  parseConfirmationResponse, 
  generateSuccessMessage, 
  generateErrorMessage 
} = require('./confirmationSystem');

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
      isNewUser: true,
      googleTokens: null,
      isGoogleConnected: false,
      lastCalendarCheck: null
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
 * Use Claude to extract user intent and potential events from a message
 * @param {string} message - The user's message
 * @param {object} userContext - The user's context (for personalization)
 * @returns {Promise<{ intent: string, events: array }>}
 */
const getIntentAndEventsFromClaude = async (message, userContext) => {
  const prompt = `You are Goodberry, an ADHD-friendly calendar assistant. Analyze the following user message and return a JSON object with two fields:

1. intent: One of the following (choose the best match):
   - connect_calendar: user wants to connect or link their Google Calendar
   - view_calendar: user wants to see their schedule or calendar
   - calendar_planning: user wants to plan, organize, or discuss their week/calendar
   - event_scheduling: user wants to schedule a specific event/meeting/appointment
   - adhd_support: user is asking for ADHD support, focus, overwhelm, or motivation
   - greeting: user is just saying hi, hello, or starting a conversation
   - general: anything else
2. events: An array of objects, each with:
   - rawText: the text describing a potential event (if any)
   - type: 'potential_event' or a more specific type if you can infer it (e.g. 'meeting', 'appointment')
   - needsConfirmation: true if you are not sure about the event details

User message: "${message}"

Respond ONLY with a JSON object like:
{"intent": "event_scheduling", "events": [{"rawText": "meeting with Alex Tuesday 2pm", "type": "meeting", "needsConfirmation": true}]}"`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 300,
    system: prompt,
    messages: [
      { role: 'user', content: message }
    ]
  });

  try {
    return JSON.parse(response.content[0].text);
  } catch (e) {
    return { intent: 'general', events: [] };
  }
};

/**
 * Get user's real calendar events from Google
 * @param {object} userContext - User's context with tokens
 * @returns {Promise<string>} - Formatted calendar summary
 */
const getCalendarSummary = async (userContext) => {
  try {
    if (!userContext.isGoogleConnected || !userContext.googleTokens) {
      return "🔗 I don't have access to your calendar yet! Text 'connect calendar' to get started.";
    }
    
    // Set user tokens for Google API
    setUserTokens(userContext.googleTokens);
    
    // Get today and next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const events = await getCalendarEvents({
      timeMin: today.toISOString(),
      timeMax: nextWeek.toISOString(),
      maxResults: 10
    });
    
    if (events.length === 0) {
      return "📅 Your calendar is beautifully empty for the next week! Perfect time to add some intentional plans. What would you like to schedule? 🌟";
    }
    
    // Format events by day
    const eventsByDay = {};
    events.forEach(event => {
      const eventDate = new Date(event.start);
      const dayKey = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!eventsByDay[dayKey]) {
        eventsByDay[dayKey] = [];
      }
      
      const timeStr = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      eventsByDay[dayKey].push(`${timeStr} - ${event.summary}`);
    });
    
    let summary = "📅 Here's your upcoming schedule:\n\n";
    Object.keys(eventsByDay).forEach(day => {
      summary += `**${day}**\n${eventsByDay[day].join('\n')}\n\n`;
    });
    
    summary += "🧠 Want to add something, move things around, or talk about managing this schedule? I'm here! 💙";
    
    return summary;
    
  } catch (error) {
    logger.error('Error getting calendar summary:', error);
    return "📅 I'm having trouble accessing your calendar right now. Try again in a moment, or text 'connect calendar' if we need to refresh the connection! 🔄";
  }
};

/**
 * Create a calendar event from user's natural language
 * @param {object} userContext - User's context
 * @param {string} eventDescription - Natural language event description
 * @returns {Promise<string>} - Confirmation message
 */
const createEventFromDescription = async (userContext, eventDescription) => {
  try {
    if (!userContext.isGoogleConnected || !userContext.googleTokens) {
      return "🔗 I need access to your calendar to create events! Text 'connect calendar' first.";
    }
    
    // Set user tokens for Google API
    setUserTokens(userContext.googleTokens);
    
    logger.info('Starting event creation process:', { 
      eventDescription, 
      phoneNumber: userContext.phoneNumber 
    });
    
    // Step 1: Parse the event from natural language
    const parsedEvent = await parseEventFromMessage(eventDescription);
    
    if (!parsedEvent.success) {
      logger.info('Event parsing failed, requesting clarification');
      return parsedEvent.error || "I couldn't quite understand the event details. Can you help me clarify?";
    }
    
    // Step 2: Get existing events to check for conflicts
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const existingEvents = await getCalendarEvents({
      timeMin: today.toISOString(),
      timeMax: nextWeek.toISOString(),
      maxResults: 50
    });
    
    // Step 3: Apply ADHD-friendly buffer time
    const userPreferences = userContext.bufferPreferences || {};
    const bufferedEvent = applyBufferTimeWithConflicts(parsedEvent, existingEvents, userPreferences);
    
    // Step 4: Generate confirmation message
    const confirmationMessage = generateConfirmationMessage(
      bufferedEvent, 
      bufferedEvent.bufferApplied ? bufferedEvent : null,
      bufferedEvent.conflicts || []
    );
    
    // Store the pending event in user context for confirmation
    userContext.pendingEvent = {
      originalEvent: parsedEvent,
      bufferedEvent: bufferedEvent,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Event creation confirmation ready:', {
      eventTitle: bufferedEvent.title,
      hasConflicts: bufferedEvent.conflicts?.length > 0,
      needsUserDecision: bufferedEvent.needsUserDecision
    });
    
    return confirmationMessage;
    
  } catch (error) {
    logger.error('Error in event creation process:', error);
    return generateErrorMessage(error.message);
  }
};

/**
 * Handle user confirmation of pending calendar event
 * @param {object} userContext - User's context
 * @param {string} userResponse - User's confirmation response
 * @returns {Promise<string>} - Response message
 */
const handleEventConfirmation = async (userContext, userResponse) => {
  try {
    if (!userContext.pendingEvent) {
      return "I don't see any pending events to confirm. What would you like to schedule? 📅";
    }

    const { originalEvent, bufferedEvent } = userContext.pendingEvent;
    
    // Parse user's confirmation response
    const confirmation = parseConfirmationResponse(userResponse);
    
    switch (confirmation.action) {
      case 'confirm':
        // User confirmed - create the event
        logger.info('User confirmed event creation:', { eventTitle: bufferedEvent.title });
        
        // Set user tokens for Google API
        setUserTokens(userContext.googleTokens);
        
        // Create the event in Google Calendar
        const eventData = {
          summary: bufferedEvent.title,
          description: bufferedEvent.description || `Created by goodberry - your ADHD-friendly calendar assistant`,
          startTime: bufferedEvent.bufferedStartTime || bufferedEvent.startTime,
          endTime: bufferedEvent.bufferedEndTime || bufferedEvent.endTime,
          location: bufferedEvent.location,
          attendees: bufferedEvent.attendees
        };
        
        const createdEvent = await createCalendarEvent(eventData);
        
        // Clear pending event
        delete userContext.pendingEvent;
        
        // Generate success message
        return generateSuccessMessage(createdEvent, bufferedEvent.bufferApplied ? bufferedEvent : null);
        
      case 'modify':
        // User wants to modify the event
        return "What would you like to change about this event?\n\n" +
               `• Title: "${bufferedEvent.title}"\n` +
               `• Time: ${new Date(bufferedEvent.startTime).toLocaleString()}\n` +
               `• Duration: ${bufferedEvent.duration} minutes\n` +
               `• Location: ${bufferedEvent.location || 'Not set'}\n` +
               `• Attendees: ${bufferedEvent.attendees?.join(', ') || 'None'}`;
        
      case 'adjust_time':
        return "What time would you prefer for this event?";
        
      case 'adjust_buffer':
        return "How much breathing room would you like around this event?\n\n" +
               `Current: ${bufferedEvent.preBufferMinutes || 15} min before, ${bufferedEvent.postBufferMinutes || 30} min after\n\n` +
               `Options:\n` +
               `• More buffer (30 min before, 45 min after)\n` +
               `• Less buffer (5 min before, 15 min after)\n` +
               `• No buffer (just the event time)\n` +
               `• Custom amount`;
        
      case 'cancel':
        // User cancelled - clear pending event
        delete userContext.pendingEvent;
        return "No problem! Event cancelled. What else can I help you with? 💙";
        
      case 'clarify':
        return confirmation.message;
        
      default:
        return "I'm not sure what you'd like to do. Can you be more specific?\n\n" +
               "✅ Yes - Create the event\n" +
               "🔄 Modify - Change something\n" +
               "❌ Cancel - Never mind";
    }
    
  } catch (error) {
    logger.error('Error handling event confirmation:', error);
    
    // Clear pending event on error
    delete userContext.pendingEvent;
    
    return generateErrorMessage(error.message);
  }
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
    // FORCE Enhanced Onboarding for any user without conversation history
    // This ensures comprehensive onboarding explanation is always shown to new users
    const needsOnboarding = userContext.conversationHistory.length === 0;
    
    // Debug logging
    logger.info('🔍 FORCED Onboarding check:', {
      isNewUser: userContext.isNewUser,
      historyLength: userContext.conversationHistory.length,
      needsOnboarding: needsOnboarding,
      phoneNumber: userContext.phoneNumber,
      reason: needsOnboarding ? 'NO_CONVERSATION_HISTORY' : 'HAS_HISTORY'
    });
    
    let systemPrompt;
    
    if (needsOnboarding) {
      logger.info('🎯 Using FORCED COMPREHENSIVE ONBOARDING prompt');
      systemPrompt = `You are goodberry, an ADHD-friendly calendar assistant. This is a NEW USER who MUST receive the complete comprehensive onboarding explanation.

ABSOLUTELY MANDATORY: You MUST explain the complete 10-phase system and get buy-in before any task help. DO NOT ask what's on their mind or jump into brain dumps.

COMPREHENSIVE ONBOARDING EXPLANATION - INCLUDE EVERY ELEMENT:

1. WARM WELCOME acknowledging their name and that scheduling/priorities can feel overwhelming

2. EXPLAIN WHY THE FOUNDATION MATTERS: Don't just dive into random task help - explain that you have a special system that transforms scattered thoughts into systematic, values-aligned calendars that actually work long-term

3. TIME COMMITMENT REASSURANCE: This is about 10 focused conversations they can have at their own pace - not overwhelming, not rushed

4. COMPLETE 10-PHASE OVERVIEW (explain what each phase accomplishes):
   - Phase 1: Brain dump & discovery (safely get everything out of your head)
   - Phase 2: Organization (sort work vs personal priorities)  
   - Phase 3: ADHD patterns (understand what planning approaches work/don't work for you)
   - Phase 4: Energy patterns (identify when you're most/least effective)
   - Phase 5: Values & joy (discover what actually energizes vs drains you)
   - Phase 6: Constraints & reality (understand what you're realistically working with)
   - Phase 7: Calendar preferences (how you actually like to schedule things)
   - Phase 8: ADHD tax transformation (turn boring/draining tasks into energizing plans)
   - Phase 9: Systematic ranking (prioritize everything with confidence using 4 criteria)
   - Phase 10: Calendar building (create your personalized, sustainable system)

5. FLEXIBILITY PROMISE: Emphasize they can pause anytime, come back later, and the system remembers exactly where they left off

6. WHY THIS FOUNDATION IS ESSENTIAL: Explain that this process allows you to give truly personalized help instead of generic advice - it's what makes all future interactions valuable

7. READY CHECK: Ask if they're ready to start this important foundation work together, emphasizing this first part is crucial for you to be of real service

TONE: Warm, genuine excitement about helping them build something that really works. Confident in the value without being pushy. Make it sound genuinely worth doing.

LANGUAGE GUIDELINES:
❌ DON'T SAY: "your ADHD brain", "ADHD brains need", "your neurodivergent brain"  
✅ DO SAY: "you", "your brain", "you might find helpful", "many people find"

USER MESSAGE: "${currentMessage}"

Generate a complete onboarding explanation that builds genuine buy-in for the structured process instead of jumping into ad-hoc task help.`;
    } else {
      logger.info('🔄 Using REGULAR conversation prompt for returning user');
      systemPrompt = `You are goodberry, an ADHD-friendly calendar assistant with a genuinely funny, understanding personality. You help people with ADHD manage their schedules through conversation.

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
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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
    
    // Fallback responses based on intent (some are async)
    try {
      switch (intent) {
        case 'greeting':
          return "🧠 Hey there! I'm goodberry, your calendar buddy! I'm here to help you structure your priorities and build calendars you'll actually love using. Ready to get started? 💙";
        
        case 'connect_calendar':
          return generateCalendarConnectionResponse(userContext.phoneNumber);
        
        case 'view_calendar':
          return await getCalendarSummary(userContext);
        
        case 'calendar_planning':
          if (userContext.isGoogleConnected) {
            return await getCalendarSummary(userContext);
          } else {
            return "📅 Love the planning energy! First, let's connect your Google Calendar so I can see what you're working with. Text 'connect calendar' to get started! 🎯";
          }
        
        case 'event_scheduling':
          return await createEventFromDescription(userContext, currentMessage);
        
        case 'adhd_support':
          return "💙 I totally get it. You deserve strategies that work for you. Want to break this down into smaller, less overwhelming pieces? You've got this! 🧠";
        
        default:
          return "🧠 Thanks for sharing that! I'm here to help make your calendar work for you. What can we tackle together? 💙";
      }
    } catch (fallbackError) {
      logger.error('Error in fallback response:', fallbackError);
      return "🧠💙 I'm having a moment! Can you try again in a bit? My brain is buffering... 😅";
    }
  }
};

/**
 * Generate Google Calendar connection URL for SMS
 * @param {string} phoneNumber - User's phone number
 * @returns {string} - Connection URL and instructions
 */
const generateCalendarConnectionResponse = (phoneNumber) => {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(phoneNumber)}`;
  
  return `🔗 Let's connect your Google Calendar! 

Click this link to give me access to your calendar:
${authUrl}

I'll need permission to:
📅 Read your calendar events
✅ Create new events for you
📝 Access your task lists

Once connected, I can actually see your schedule and help you plan like a pro! 🧠💙`;
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

    // Get user context and check for onboarding BEFORE adding to history
    const userContext = getUserContext(phoneNumber);
    
    // Check if user has a pending event confirmation first
    if (userContext.pendingEvent) {
      const timeSincePending = new Date() - new Date(userContext.pendingEvent.timestamp);
      const pendingTimeout = 30 * 60 * 1000; // 30 minutes
      
      if (timeSincePending > pendingTimeout) {
        // Pending event has expired
        delete userContext.pendingEvent;
        logger.info('Pending event expired:', { phoneNumber });
      } else {
        // Handle event confirmation
        logger.info('Handling event confirmation:', { phoneNumber });
        const confirmationResponse = await handleEventConfirmation(userContext, message);
        
        // Add both messages to history
        addToHistory(phoneNumber, 'user', message);
        addToHistory(phoneNumber, 'assistant', confirmationResponse);
        
        return confirmationResponse;
      }
    }
    
    // Use Claude to extract intent and events
    const { intent, events: potentialEvents } = await getIntentAndEventsFromClaude(message, userContext);
    
    logger.info('Claude intent and events:', {
      phoneNumber,
      intent,
      eventsFound: potentialEvents.length,
      isGoogleConnected: userContext.isGoogleConnected
    });
    
    // Handle special calendar intents immediately (bypass AI for direct functionality)
    let aiResponse;
    if (intent === 'connect_calendar') {
      aiResponse = generateCalendarConnectionResponse(phoneNumber);
    } else if (intent === 'view_calendar') {
      aiResponse = await getCalendarSummary(userContext);
    } else {
      // Generate AI response for other intents (onboarding check happens here BEFORE adding to history)
      aiResponse = await generateAIResponse(userContext, message, intent);
    }
    
    // NOW add both messages to history AFTER the AI response is generated
    addToHistory(phoneNumber, 'user', message);
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
  generateCalendarConnectionResponse,
  getCalendarSummary,
  createEventFromDescription,
  handleEventConfirmation
}; 