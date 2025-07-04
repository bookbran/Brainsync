const logger = require('../utils/logger');

/**
 * ADHD-friendly confirmation system for calendar events
 * Handles user approval, modifications, and cancellation with gentle language
 */

/**
 * Generate confirmation message for a parsed event
 * @param {object} eventData - Parsed event data
 * @param {object} bufferInfo - Buffer time information
 * @param {array} conflicts - Any conflicts detected
 * @returns {string} - User-friendly confirmation message
 */
const generateConfirmationMessage = (eventData, bufferInfo = null, conflicts = []) => {
  try {
    const { title, startTime, duration, location, attendees, confidence } = eventData;
    
    // Format the time nicely
    const startDate = new Date(startTime);
    const timeString = startDate.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    let message = `📅 Here's what I understood:\n\n`;
    
    // Event details
    message += `**Event**: ${title || 'Untitled'}\n`;
    message += `**When**: ${timeString}\n`;
    message += `**Duration**: ${duration} minutes\n`;
    
    if (location) {
      message += `**Where**: ${location}\n`;
    }
    
    if (attendees && attendees.length > 0) {
      message += `**With**: ${attendees.join(', ')}\n`;
    }

    // Add confidence indicator
    if (confidence === 'low') {
      message += `\n⚠️ I'm not totally sure about some details - please check carefully!\n`;
    }

    // Add buffer time explanation if applied
    if (bufferInfo && bufferInfo.bufferApplied) {
      message += `\n🧠 **ADHD-Friendly Buffer Time Added**:\n`;
      if (bufferInfo.preBufferMinutes > 0) {
        message += `• ${bufferInfo.preBufferMinutes} minutes before to arrive & settle\n`;
      }
      if (bufferInfo.postBufferMinutes > 0) {
        message += `• ${bufferInfo.postBufferMinutes} minutes after to recover & transition\n`;
      }
    }

    // Add conflict warnings if any
    if (conflicts && conflicts.length > 0) {
      message += `\n⚠️ **Potential Conflicts Detected**:\n`;
      conflicts.forEach(conflict => {
        message += `• Overlaps with "${conflict.eventTitle}"\n`;
      });
      message += `\nI can help you resolve these conflicts! 💙\n`;
    }

    // Confirmation options
    message += `\n**What would you like to do?**\n\n`;
    message += `✅ **Yes** - Create this event\n`;
    message += `🔄 **Modify** - Let me fix something\n`;
    message += `⏰ **Adjust Time** - Change when it happens\n`;
    message += `🧠 **Adjust Buffer** - Change the breathing room\n`;
    message += `❌ **Cancel** - Never mind`;

    return message;
  } catch (error) {
    logger.error('Error generating confirmation message:', error);
    return "📅 I'm having trouble formatting the confirmation. Can you try again? 🔄";
  }
};

/**
 * Parse user's confirmation response
 * @param {string} userResponse - User's response to confirmation
 * @returns {object} - Parsed confirmation action
 */
const parseConfirmationResponse = (userResponse) => {
  try {
    const lowerResponse = userResponse.toLowerCase().trim();
    
    // Check for positive confirmations
    if (lowerResponse.includes('yes') || lowerResponse.includes('yep') || 
        lowerResponse.includes('sure') || lowerResponse.includes('ok') ||
        lowerResponse.includes('create') || lowerResponse.includes('add') ||
        lowerResponse.includes('✅') || lowerResponse.includes('yes')) {
      return {
        action: 'confirm',
        confidence: 'high',
        message: 'Event confirmed! Creating now...'
      };
    }
    
    // Check for modifications
    if (lowerResponse.includes('modify') || lowerResponse.includes('fix') || 
        lowerResponse.includes('change') || lowerResponse.includes('edit') ||
        lowerResponse.includes('🔄') || lowerResponse.includes('no')) {
      return {
        action: 'modify',
        confidence: 'high',
        message: 'What would you like to change?'
      };
    }
    
    // Check for time adjustments
    if (lowerResponse.includes('time') || lowerResponse.includes('when') || 
        lowerResponse.includes('schedule') || lowerResponse.includes('⏰')) {
      return {
        action: 'adjust_time',
        confidence: 'high',
        message: 'What time would you prefer?'
      };
    }
    
    // Check for buffer adjustments
    if (lowerResponse.includes('buffer') || lowerResponse.includes('breathing') || 
        lowerResponse.includes('space') || lowerResponse.includes('🧠')) {
      return {
        action: 'adjust_buffer',
        confidence: 'high',
        message: 'How much buffer time would you like?'
      };
    }
    
    // Check for cancellations
    if (lowerResponse.includes('cancel') || lowerResponse.includes('never mind') || 
        lowerResponse.includes('no thanks') || lowerResponse.includes('❌')) {
      return {
        action: 'cancel',
        confidence: 'high',
        message: 'No problem! Event cancelled.'
      };
    }
    
    // Ambiguous response - ask for clarification
    return {
      action: 'clarify',
      confidence: 'low',
      message: "I'm not sure what you'd like to do. Can you be more specific?\n\n" +
               "✅ Yes - Create the event\n" +
               "🔄 Modify - Change something\n" +
               "❌ Cancel - Never mind"
    };
    
  } catch (error) {
    logger.error('Error parsing confirmation response:', error);
    return {
      action: 'clarify',
      confidence: 'low',
      message: 'I had trouble understanding. Can you try again?'
    };
  }
};

/**
 * Generate modification prompts based on what user wants to change
 * @param {string} modificationType - Type of modification requested
 * @param {object} currentEvent - Current event data
 * @returns {string} - Modification prompt
 */
const generateModificationPrompt = (modificationType, currentEvent) => {
  try {
    const { title, startTime, duration, location, attendees } = currentEvent;
    
    switch (modificationType) {
      case 'title':
        return `What should I call this event? Currently: "${title}"`;
        
      case 'time':
        const currentTime = new Date(startTime).toLocaleString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        return `When would you like this to happen? Currently: ${currentTime}`;
        
      case 'duration':
        return `How long should this event be? Currently: ${duration} minutes`;
        
      case 'location':
        return `Where should this take place? Currently: ${location || 'No location set'}`;
        
      case 'attendees':
        const currentAttendees = attendees && attendees.length > 0 ? attendees.join(', ') : 'No attendees';
        return `Who should be there? Currently: ${currentAttendees}`;
        
      case 'buffer':
        return `How much breathing room would you like around this event?\n\n` +
               `Current: 15 min before, 30 min after\n\n` +
               `Options:\n` +
               `• More buffer (30 min before, 45 min after)\n` +
               `• Less buffer (5 min before, 15 min after)\n` +
               `• No buffer (just the event time)\n` +
               `• Custom amount`;
        
      default:
        return `What would you like to change about this event?\n\n` +
               `• Title: "${title}"\n` +
               `• Time: ${new Date(startTime).toLocaleString()}\n` +
               `• Duration: ${duration} minutes\n` +
               `• Location: ${location || 'Not set'}\n` +
               `• Attendees: ${attendees?.join(', ') || 'None'}`;
    }
  } catch (error) {
    logger.error('Error generating modification prompt:', error);
    return 'What would you like to change about this event?';
  }
};

/**
 * Handle conflict resolution suggestions
 * @param {array} conflicts - Array of conflicts
 * @returns {string} - Conflict resolution message
 */
const generateConflictResolutionMessage = (conflicts) => {
  try {
    if (!conflicts || conflicts.length === 0) {
      return null;
    }
    
    let message = `⚠️ I found some potential conflicts:\n\n`;
    
    conflicts.forEach((conflict, index) => {
      message += `${index + 1}. **"${conflict.eventTitle}"**\n`;
      message += `   Overlap: ${conflict.overlapMinutes} minutes\n`;
      message += `   Type: ${conflict.conflictType.replace('_', ' ')}\n\n`;
    });
    
    message += `**How would you like to handle this?**\n\n`;
    message += `✅ **Proceed anyway** - Create the event with overlap\n`;
    message += `🔄 **Reschedule** - Find a different time\n`;
    message += `⏰ **Reduce buffer** - Less breathing room to avoid conflict\n`;
    message += `❌ **Cancel** - Don't create this event`;
    
    return message;
  } catch (error) {
    logger.error('Error generating conflict resolution message:', error);
    return 'I found some conflicts but had trouble explaining them. Should we proceed anyway?';
  }
};

/**
 * Generate success message after event creation
 * @param {object} createdEvent - Created event data
 * @param {object} bufferInfo - Buffer time information
 * @returns {string} - Success message
 */
const generateSuccessMessage = (createdEvent, bufferInfo = null) => {
  try {
    const { title, startTime, htmlLink } = createdEvent;
    
    const startDate = new Date(startTime);
    const timeString = startDate.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    let message = `🎉 **Event Created Successfully!**\n\n`;
    message += `**${title}**\n`;
    message += `📅 ${timeString}\n`;
    
    if (bufferInfo && bufferInfo.bufferApplied) {
      message += `🧠 Added ${bufferInfo.totalBufferMinutes} minutes of breathing room\n`;
    }
    
    if (htmlLink) {
      message += `\n📱 View in Google Calendar: ${htmlLink}`;
    }
    
    message += `\n\nYou're all set! Your beautiful brain has one less thing to remember. 💙`;
    
    return message;
  } catch (error) {
    logger.error('Error generating success message:', error);
    return '🎉 Event created successfully! Check your Google Calendar to see it.';
  }
};

/**
 * Generate error message for failed event creation
 * @param {string} error - Error details
 * @returns {string} - User-friendly error message
 */
const generateErrorMessage = (error) => {
  try {
    let message = `😅 I had trouble creating that event.\n\n`;
    
    // Provide specific guidance based on error type
    if (error.includes('authentication') || error.includes('token')) {
      message += `It looks like I need to reconnect to your Google Calendar. `;
      message += `Text 'connect calendar' to fix this! 🔗`;
    } else if (error.includes('conflict') || error.includes('overlap')) {
      message += `There might be a scheduling conflict. `;
      message += `Want to try a different time? ⏰`;
    } else if (error.includes('time') || error.includes('date')) {
      message += `The time or date might be unclear. `;
      message += `Can you be more specific? 📅`;
    } else {
      message += `This sometimes happens. Want to try again? 🔄`;
    }
    
    return message;
  } catch (error) {
    logger.error('Error generating error message:', error);
    return '😅 Something went wrong. Can you try again?';
  }
};

module.exports = {
  generateConfirmationMessage,
  parseConfirmationResponse,
  generateModificationPrompt,
  generateConflictResolutionMessage,
  generateSuccessMessage,
  generateErrorMessage
}; 