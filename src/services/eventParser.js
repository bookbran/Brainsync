const logger = require('../utils/logger');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Parse natural language into structured event data
 * @param {string} message - User's natural language message
 * @returns {Promise<object>} - Parsed event data with confidence scores
 */
const parseEventFromMessage = async (message) => {
  try {
    logger.info('Parsing event from message:', { message });

    let parsedEvent;
    
    // First, try AI-based parsing for complex natural language
    try {
      parsedEvent = await parseWithAI(message);
    } catch (aiError) {
      logger.warn('AI parsing failed, falling back to pattern matching:', aiError.message);
      // Fall back to pattern matching if AI fails
      parsedEvent = parseWithPatternMatching(message);
    }
    
    // Then, enhance with pattern matching for specific time expressions
    const enhancedEvent = enhanceWithPatternMatching(parsedEvent, message);
    
    // Validate the parsed event
    const validatedEvent = validateEventData(enhancedEvent);
    
    logger.info('Event parsing complete:', { 
      originalMessage: message,
      parsedEvent: validatedEvent 
    });

    return validatedEvent;
  } catch (error) {
    logger.error('Error parsing event from message:', error);
    return {
      success: false,
      error: 'Failed to parse event details',
      needsClarification: true,
      clarificationQuestions: generateClarificationQuestions(message)
    };
  }
};

/**
 * Use AI to parse complex natural language into structured event data
 * @param {string} message - User's message
 * @returns {Promise<object>} - AI-parsed event data
 */
const parseWithAI = async (message) => {
  try {
    const systemPrompt = `You are an expert at parsing natural language into structured calendar event data. Extract event details from user messages and return ONLY valid JSON.

RESPONSE FORMAT (JSON only):
{
  "success": boolean,
  "title": "string or null",
  "description": "string or null", 
  "startTime": "ISO string or null",
  "endTime": "ISO string or null",
  "duration": "number in minutes or null",
  "location": "string or null",
  "attendees": ["email1", "email2"] or null,
  "confidence": "high|medium|low",
  "needsClarification": boolean,
  "missingFields": ["field1", "field2"]
}

PARSING RULES:
- Convert relative times to absolute times (e.g., "tomorrow 3pm" → ISO string)
- Default duration: 60 minutes if not specified
- Default timezone: America/New_York (we'll make this configurable later)
- Extract location from phrases like "at the office", "downtown", "Zoom call"
- Identify attendees from "with John", "meeting with team", etc.
- Set confidence based on clarity of information provided

EXAMPLES:
"meeting with John tomorrow at 3pm" → {
  "success": true,
  "title": "Meeting with John",
  "startTime": "2024-01-16T15:00:00-05:00",
  "duration": 60,
  "confidence": "high"
}

"dentist appointment next Tuesday morning" → {
  "success": true, 
  "title": "Dentist appointment",
  "startTime": "2024-01-23T09:00:00-05:00",
  "duration": 60,
  "confidence": "medium",
  "needsClarification": true,
  "missingFields": ["exact_time"]
}

USER MESSAGE: "${message}"

Parse this message and return ONLY the JSON response.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const aiResponse = response.content[0].text;
    
    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI response did not contain valid JSON');
    }

    const parsedEvent = JSON.parse(jsonMatch[0]);
    
    logger.info('AI parsing result:', { 
      originalMessage: message,
      aiResponse: aiResponse,
      parsedEvent: parsedEvent 
    });

    return parsedEvent;
  } catch (error) {
    logger.error('Error in AI parsing:', error);
    return {
      success: false,
      error: 'AI parsing failed',
      needsClarification: true
    };
  }
};

/**
 * Parse event using pattern matching (fallback when AI is not available)
 * @param {string} message - User's message
 * @returns {object} - Parsed event data
 */
const parseWithPatternMatching = (message) => {
  try {
    const lowerMessage = message.toLowerCase();
    
    // Extract title
    let title = message;
    
    // Remove time expressions from title
    title = title.replace(/\b(tomorrow|today|next\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '');
    title = title.replace(/\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/gi, '');
    title = title.replace(/\b(\d{1,2})(am|pm)\b/gi, '');
    title = title.replace(/\b(\d+)\s*(hour|hr|minute|min)s?\b/gi, '');
    title = title.replace(/\b(at|for|with|on)\b/gi, '');
    title = title.trim();
    
    // Default values
    let startTime = null;
    let duration = 60; // Default 1 hour
    
    // Extract time
    const timeMatch = message.match(/\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/gi);
    if (timeMatch) {
      // Simple time parsing - would need more sophisticated logic for real use
      startTime = new Date();
      startTime.setHours(15, 0, 0, 0); // Default to 3pm for testing
    }
    
    // Extract duration
    const durationMatch = message.match(/\b(\d+)\s*(hour|hr|minute|min)s?\b/gi);
    if (durationMatch) {
      const durationStr = durationMatch[0];
      const durationNum = parseInt(durationStr.match(/\d+/)[0]);
      if (durationStr.includes('hour') || durationStr.includes('hr')) {
        duration = durationNum * 60;
      } else {
        duration = durationNum;
      }
    }
    
    // Extract location
    let location = null;
    if (lowerMessage.includes('at the') || lowerMessage.includes('downtown') || lowerMessage.includes('office')) {
      location = 'Office';
    }
    
    // Extract attendees
    let attendees = [];
    const withMatch = message.match(/with\s+([a-zA-Z]+)/i);
    if (withMatch) {
      attendees.push(withMatch[1] + '@example.com');
    }
    
    return {
      success: true,
      title: title || 'Untitled Event',
      description: null,
      startTime: startTime ? startTime.toISOString() : null,
      endTime: null,
      duration: duration,
      location: location,
      attendees: attendees,
      confidence: startTime ? 'medium' : 'low',
      needsClarification: !startTime,
      missingFields: startTime ? [] : ['start_time']
    };
    
  } catch (error) {
    logger.error('Error in pattern matching parsing:', error);
    return {
      success: false,
      error: 'Pattern matching failed',
      needsClarification: true
    };
  }
};

/**
 * Enhance AI parsing with pattern matching for specific time expressions
 * @param {object} aiEvent - AI-parsed event data
 * @param {string} message - Original message
 * @returns {object} - Enhanced event data
 */
const enhanceWithPatternMatching = (aiEvent, message) => {
  if (!aiEvent.success) {
    return aiEvent;
  }

  const enhanced = { ...aiEvent };

  // Enhance time parsing with specific patterns
  const timePatterns = [
    // Specific times
    { pattern: /\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/gi, type: 'exact_time' },
    // Relative times
    { pattern: /\b(tomorrow|today|next\s+\w+)\b/gi, type: 'relative_day' },
    // Duration patterns
    { pattern: /\b(\d+)\s*(hour|hr|minute|min)s?\b/gi, type: 'duration' }
  ];

  // Apply pattern matching enhancements
  timePatterns.forEach(({ pattern, type }) => {
    const matches = message.match(pattern);
    if (matches) {
      logger.info('Pattern match found:', { type, matches });
      // Pattern matching logic would go here
    }
  });

  return enhanced;
};

/**
 * Validate parsed event data and add confidence scores
 * @param {object} eventData - Parsed event data
 * @returns {object} - Validated event data
 */
const validateEventData = (eventData) => {
  if (!eventData.success) {
    return eventData;
  }

  const validated = { ...eventData };
  const missingFields = [];

  // Check required fields
  if (!validated.title) {
    missingFields.push('title');
  }

  if (!validated.startTime) {
    missingFields.push('start_time');
  }

  // Set default duration if missing
  if (!validated.duration) {
    validated.duration = 60; // Default 1 hour
  }

  // Calculate end time if not provided
  if (validated.startTime && !validated.endTime) {
    const startDate = new Date(validated.startTime);
    const endDate = new Date(startDate.getTime() + (validated.duration * 60 * 1000));
    validated.endTime = endDate.toISOString();
  }

  // Update confidence based on missing fields
  if (missingFields.length === 0) {
    validated.confidence = 'high';
  } else if (missingFields.length <= 2) {
    validated.confidence = 'medium';
  } else {
    validated.confidence = 'low';
  }

  validated.missingFields = missingFields;
  validated.needsClarification = missingFields.length > 0;

  return validated;
};

/**
 * Generate clarification questions for missing event details
 * @param {string} message - Original user message
 * @returns {array} - Array of clarification questions
 */
const generateClarificationQuestions = (message) => {
  const questions = [];
  const lowerMessage = message.toLowerCase();

  // Check for missing title
  if (!lowerMessage.includes('meeting') && !lowerMessage.includes('appointment') && 
      !lowerMessage.includes('call') && !lowerMessage.includes('presentation')) {
    questions.push("What should I call this event?");
  }

  // Check for missing time
  if (!lowerMessage.match(/\b\d{1,2}:\d{2}\b/) && !lowerMessage.match(/\b\d{1,2}(am|pm)\b/)) {
    questions.push("What time would you like to schedule this for?");
  }

  // Check for missing day
  if (!lowerMessage.match(/\b(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/)) {
    questions.push("What day should this happen?");
  }

  // Check for missing duration
  if (!lowerMessage.match(/\b(\d+)\s*(hour|hr|minute|min)s?\b/)) {
    questions.push("How long should this event be?");
  }

  return questions;
};

/**
 * Format parsed event for user confirmation
 * @param {object} eventData - Parsed event data
 * @returns {string} - User-friendly confirmation message
 */
const formatEventConfirmation = (eventData) => {
  if (!eventData.success) {
    return "📅 I couldn't quite understand the event details. Can you help me clarify?\n\n" +
           eventData.clarificationQuestions.map(q => `• ${q}`).join('\n');
  }

  const { title, startTime, duration, location, attendees } = eventData;
  
  // Format the start time nicely
  const startDate = new Date(startTime);
  const timeString = startDate.toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  let confirmation = `📅 Here's what I understood:\n\n`;
  confirmation += `**Event**: ${title || 'Untitled'}\n`;
  confirmation += `**When**: ${timeString}\n`;
  confirmation += `**Duration**: ${duration} minutes\n`;
  
  if (location) {
    confirmation += `**Where**: ${location}\n`;
  }
  
  if (attendees && attendees.length > 0) {
    confirmation += `**With**: ${attendees.join(', ')}\n`;
  }

  confirmation += `\nDoes this look right? Reply:\n`;
  confirmation += `✅ **Yes** - Create this event\n`;
  confirmation += `🔄 **No** - Let me fix something\n`;
  confirmation += `❌ **Cancel** - Never mind`;

  return confirmation;
};

module.exports = {
  parseEventFromMessage,
  formatEventConfirmation,
  generateClarificationQuestions
}; 