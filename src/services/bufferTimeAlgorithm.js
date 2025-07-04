const logger = require('../utils/logger');

/**
 * ADHD-friendly buffer time algorithm
 * Adds protective spacing around events to prevent overwhelm and support mental health
 */

/**
 * Calculate buffer time for an event based on ADHD-friendly principles
 * @param {object} eventData - Event data with startTime, endTime, duration
 * @param {object} userPreferences - User's buffer time preferences
 * @returns {object} - Event data with buffer time applied
 */
const calculateBufferTime = (eventData, userPreferences = {}) => {
  try {
    const {
      startTime,
      endTime,
      duration,
      title,
      eventType
    } = eventData;

    // Default buffer preferences (can be customized per user)
    const defaultPreferences = {
      preEventBuffer: 15, // minutes before event
      postEventBuffer: 30, // minutes after event
      meetingBuffer: 15, // extra buffer for meetings
      appointmentBuffer: 30, // extra buffer for appointments
      maxBufferTime: 60, // maximum buffer time in minutes
      respectMentalHealthGaps: true,
      bufferOnWeekends: false
    };

    const preferences = { ...defaultPreferences, ...userPreferences };

    // Calculate base buffer times
    let preBuffer = preferences.preEventBuffer;
    let postBuffer = preferences.postEventBuffer;

    // Adjust buffer based on event type
    if (eventType === 'meeting' || title?.toLowerCase().includes('meeting')) {
      preBuffer += preferences.meetingBuffer;
      postBuffer += preferences.meetingBuffer;
    }

    if (eventType === 'appointment' || title?.toLowerCase().includes('appointment')) {
      preBuffer += preferences.appointmentBuffer;
      postBuffer += preferences.appointmentBuffer;
    }

    // Adjust buffer based on event duration
    const durationHours = duration / 60;
    if (durationHours >= 2) {
      // Longer events need more recovery time
      postBuffer = Math.min(postBuffer * 1.5, preferences.maxBufferTime);
    }

    // Check if event is on weekend (if user prefers no weekend buffers)
    const eventDate = new Date(startTime);
    const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
    
    if (isWeekend && !preferences.bufferOnWeekends) {
      preBuffer = Math.min(preBuffer * 0.5, 15); // Reduce weekend buffers
      postBuffer = Math.min(postBuffer * 0.5, 30);
    }

    // Calculate new start and end times with buffers
    const originalStart = new Date(startTime);
    const originalEnd = new Date(endTime);
    
    const bufferedStart = new Date(originalStart.getTime() - (preBuffer * 60 * 1000));
    const bufferedEnd = new Date(originalEnd.getTime() + (postBuffer * 60 * 1000));

    const result = {
      ...eventData,
      originalStartTime: startTime,
      originalEndTime: endTime,
      bufferedStartTime: bufferedStart.toISOString(),
      bufferedEndTime: bufferedEnd.toISOString(),
      preBufferMinutes: preBuffer,
      postBufferMinutes: postBuffer,
      totalBufferMinutes: preBuffer + postBuffer,
      bufferApplied: true
    };

    logger.info('Buffer time calculated:', {
      eventTitle: title,
      originalDuration: duration,
      preBuffer,
      postBuffer,
      totalBuffer: preBuffer + postBuffer
    });

    return result;
  } catch (error) {
    logger.error('Error calculating buffer time:', error);
    return eventData; // Return original event data if buffer calculation fails
  }
};

/**
 * Check if adding buffer time would conflict with existing events
 * @param {object} bufferedEvent - Event with buffer time applied
 * @param {array} existingEvents - Array of existing calendar events
 * @returns {object} - Conflict analysis
 */
const checkBufferConflicts = (bufferedEvent, existingEvents) => {
  try {
    const conflicts = [];
    const bufferedStart = new Date(bufferedEvent.bufferedStartTime);
    const bufferedEnd = new Date(bufferedEvent.bufferedEndTime);

    existingEvents.forEach(existingEvent => {
      const existingStart = new Date(existingEvent.start);
      const existingEnd = new Date(existingEvent.end);

      // Check for overlap
      if (bufferedStart < existingEnd && bufferedEnd > existingStart) {
        conflicts.push({
          eventId: existingEvent.id,
          eventTitle: existingEvent.summary,
          conflictType: determineConflictType(bufferedStart, bufferedEnd, existingStart, existingEnd),
          overlapMinutes: calculateOverlap(bufferedStart, bufferedEnd, existingStart, existingEnd)
        });
      }
    });

    const hasConflicts = conflicts.length > 0;
    const severity = hasConflicts ? determineConflictSeverity(conflicts) : 'none';

    logger.info('Buffer conflict check:', {
      eventTitle: bufferedEvent.title,
      conflictsFound: conflicts.length,
      severity
    });

    return {
      hasConflicts,
      conflicts,
      severity,
      canProceed: severity !== 'critical'
    };
  } catch (error) {
    logger.error('Error checking buffer conflicts:', error);
    return {
      hasConflicts: false,
      conflicts: [],
      severity: 'none',
      canProceed: true
    };
  }
};

/**
 * Determine the type of conflict between events
 * @param {Date} newStart - New event start time
 * @param {Date} newEnd - New event end time
 * @param {Date} existingStart - Existing event start time
 * @param {Date} existingEnd - Existing event end time
 * @returns {string} - Conflict type
 */
const determineConflictType = (newStart, newEnd, existingStart, existingEnd) => {
  if (newStart >= existingStart && newEnd <= existingEnd) {
    return 'completely_overlaps';
  } else if (existingStart >= newStart && existingEnd <= newEnd) {
    return 'completely_contained';
  } else if (newStart < existingEnd && newEnd > existingStart) {
    return 'partial_overlap';
  }
  return 'no_conflict';
};

/**
 * Calculate overlap duration in minutes
 * @param {Date} start1 - First event start
 * @param {Date} end1 - First event end
 * @param {Date} start2 - Second event start
 * @param {Date} end2 - Second event end
 * @returns {number} - Overlap in minutes
 */
const calculateOverlap = (start1, end1, start2, end2) => {
  const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()));
  const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()));
  
  if (overlapStart >= overlapEnd) {
    return 0;
  }
  
  return Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60));
};

/**
 * Determine severity of conflicts
 * @param {array} conflicts - Array of conflict objects
 * @returns {string} - Severity level
 */
const determineConflictSeverity = (conflicts) => {
  const totalOverlap = conflicts.reduce((sum, conflict) => sum + conflict.overlapMinutes, 0);
  const criticalConflicts = conflicts.filter(c => c.conflictType === 'completely_overlaps').length;

  if (criticalConflicts > 0) {
    return 'critical';
  } else if (totalOverlap > 60) {
    return 'high';
  } else if (totalOverlap > 30) {
    return 'medium';
  } else {
    return 'low';
  }
};

/**
 * Generate ADHD-friendly buffer time explanation
 * @param {object} bufferedEvent - Event with buffer time applied
 * @returns {string} - User-friendly explanation
 */
const generateBufferExplanation = (bufferedEvent) => {
  const { preBufferMinutes, postBufferMinutes, title } = bufferedEvent;
  
  let explanation = `🧠 I've added some breathing room around "${title}" to support your beautiful brain:\n\n`;
  
  if (preBufferMinutes > 0) {
    explanation += `⏰ **${preBufferMinutes} minutes before** - Time to arrive, settle in, and get focused\n`;
  }
  
  if (postBufferMinutes > 0) {
    explanation += `🔄 **${postBufferMinutes} minutes after** - Recovery time to process, decompress, and transition\n`;
  }
  
  explanation += `\nThis helps prevent overwhelm and gives you space to be human! 💙`;
  
  return explanation;
};

/**
 * Suggest buffer time adjustments based on conflicts
 * @param {object} bufferedEvent - Event with buffer time
 * @param {array} conflicts - Array of conflicts
 * @returns {object} - Suggested adjustments
 */
const suggestBufferAdjustments = (bufferedEvent, conflicts) => {
  const suggestions = [];
  
  conflicts.forEach(conflict => {
    if (conflict.conflictType === 'partial_overlap') {
      if (conflict.overlapMinutes <= 15) {
        suggestions.push({
          type: 'reduce_buffer',
          message: `Reduce buffer time by ${conflict.overlapMinutes} minutes to avoid overlap with "${conflict.eventTitle}"`,
          adjustment: conflict.overlapMinutes
        });
      } else {
        suggestions.push({
          type: 'reschedule',
          message: `Consider rescheduling to avoid overlap with "${conflict.eventTitle}"`,
          adjustment: null
        });
      }
    }
  });
  
  return suggestions;
};

/**
 * Apply buffer time to an event with conflict resolution
 * @param {object} eventData - Original event data
 * @param {array} existingEvents - Existing calendar events
 * @param {object} userPreferences - User's buffer preferences
 * @returns {object} - Final event data with buffer time
 */
const applyBufferTimeWithConflicts = (eventData, existingEvents = [], userPreferences = {}) => {
  try {
    // Calculate buffer time
    const bufferedEvent = calculateBufferTime(eventData, userPreferences);
    
    // Check for conflicts
    const conflictAnalysis = checkBufferConflicts(bufferedEvent, existingEvents);
    
    if (conflictAnalysis.hasConflicts) {
      logger.info('Buffer conflicts detected:', conflictAnalysis);
      
      // Generate suggestions for conflict resolution
      const suggestions = suggestBufferAdjustments(bufferedEvent, conflictAnalysis.conflicts);
      
      return {
        ...bufferedEvent,
        conflicts: conflictAnalysis.conflicts,
        conflictSeverity: conflictAnalysis.severity,
        suggestions,
        needsUserDecision: conflictAnalysis.severity === 'high' || conflictAnalysis.severity === 'critical'
      };
    }
    
    // No conflicts - return buffered event
    return {
      ...bufferedEvent,
      conflicts: [],
      conflictSeverity: 'none',
      suggestions: [],
      needsUserDecision: false
    };
    
  } catch (error) {
    logger.error('Error applying buffer time with conflicts:', error);
    return eventData; // Return original event if buffer application fails
  }
};

module.exports = {
  calculateBufferTime,
  checkBufferConflicts,
  generateBufferExplanation,
  suggestBufferAdjustments,
  applyBufferTimeWithConflicts
}; 