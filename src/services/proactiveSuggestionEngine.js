const logger = require('../utils/logger');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Proactive suggestion engine for calendar events
 * Generates personalized event suggestions based on onboarding insights
 */
class ProactiveSuggestionEngine {
  constructor() {
    this.anthropic = anthropic;
  }

  /**
   * Generate proactive event suggestions based on user's onboarding insights
   * @param {object} userInsights - User's onboarding insights and preferences
   * @param {string} userName - User's name
   * @returns {Promise<object>} - Generated suggestions with ADHD-friendly messaging
   */
  async generateProactiveSuggestions(userInsights, userName) {
    try {
      logger.info('🎯 Generating proactive suggestions for user:', { userName });

      // Extract key insights from onboarding
      const priorities = this.extractPriorities(userInsights);
      const energyPatterns = this.extractEnergyPatterns(userInsights);
      const values = this.extractValues(userInsights);
      const constraints = this.extractConstraints(userInsights);

      // Generate suggestions using AI
      const suggestions = await this.generateAISuggestions(
        priorities, 
        energyPatterns, 
        values, 
        constraints, 
        userName
      );

      // Format suggestions for ADHD-friendly presentation
      const formattedSuggestions = this.formatSuggestionsForUser(suggestions, userName);

      logger.info('✅ Generated proactive suggestions:', {
        suggestionCount: suggestions.length,
        userName
      });

      return {
        suggestions: formattedSuggestions,
        rawSuggestions: suggestions,
        userInsights: {
          priorities,
          energyPatterns,
          values,
          constraints
        }
      };

    } catch (error) {
      logger.error('❌ Error generating proactive suggestions:', error);
      return {
        suggestions: [],
        error: 'Failed to generate suggestions',
        fallbackMessage: `Hey ${userName}! Ready to start building your calendar? What would you like to schedule first? 💙`
      };
    }
  }

  /**
   * Extract priorities from user insights
   * @param {object} userInsights - User's onboarding insights
   * @returns {array} - Array of priorities
   */
  extractPriorities(userInsights) {
    const priorities = [];
    
    if (userInsights.priorities) {
      priorities.push(...userInsights.priorities);
    }
    
    if (userInsights.work_items) {
      priorities.push(...userInsights.work_items.map(item => ({ ...item, category: 'work' })));
    }
    
    if (userInsights.personal_items) {
      priorities.push(...userInsights.personal_items.map(item => ({ ...item, category: 'personal' })));
    }

    return priorities;
  }

  /**
   * Extract energy patterns from user insights
   * @param {object} userInsights - User's onboarding insights
   * @returns {object} - Energy patterns
   */
  extractEnergyPatterns(userInsights) {
    return {
      peakHours: userInsights.energy_triggers?.peak_hours || [],
      lowEnergyHours: userInsights.energy_triggers?.low_energy_hours || [],
      postActivityPatterns: userInsights.energy_triggers?.post_activity_patterns || {},
      weeklyPatterns: userInsights.energy_triggers?.weekly_patterns || {}
    };
  }

  /**
   * Extract values from user insights
   * @param {object} userInsights - User's onboarding insights
   * @returns {array} - Array of values
   */
  extractValues(userInsights) {
    const values = [];
    
    if (userInsights.core_values) {
      values.push(...userInsights.core_values);
    }
    
    if (userInsights.energizing_activities) {
      values.push(...userInsights.energizing_activities.map(activity => ({ 
        type: 'energizing', 
        activity 
      })));
    }

    return values;
  }

  /**
   * Extract constraints from user insights
   * @param {object} userInsights - User's onboarding insights
   * @returns {object} - Constraints
   */
  extractConstraints(userInsights) {
    return {
      nonNegotiables: userInsights.constraints?.non_negotiables || [],
      timeConstraints: userInsights.constraints?.time_constraints || [],
      energyConstraints: userInsights.constraints?.energy_constraints || [],
      adhdTaxTasks: userInsights.adhd_tax_tasks || []
    };
  }

  /**
   * Generate AI-powered event suggestions
   * @param {array} priorities - User's priorities
   * @param {object} energyPatterns - Energy patterns
   * @param {array} values - User's values
   * @param {object} constraints - User's constraints
   * @param {string} userName - User's name
   * @returns {Promise<array>} - Array of suggested events
   */
  async generateAISuggestions(priorities, energyPatterns, values, constraints, userName) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 800,
        system: `You are goodberry's proactive suggestion engine. Generate personalized calendar event suggestions based on the user's onboarding insights.

USER CONTEXT:
- Name: ${userName}
- Priorities: ${JSON.stringify(priorities)}
- Energy Patterns: ${JSON.stringify(energyPatterns)}
- Values: ${JSON.stringify(values)}
- Constraints: ${JSON.stringify(constraints)}

TASK: Generate 3-5 specific, actionable calendar event suggestions that:
1. Align with their priorities and values
2. Respect their energy patterns and constraints
3. Include ADHD-friendly buffer time
4. Are specific enough to actually schedule
5. Celebrate their choices and progress

For each suggestion, provide:
- Event title
- Suggested timing (day/time)
- Duration
- Why this matters for them specifically
- Buffer time considerations
- Priority level (high/medium/low)

Return ONLY a JSON array of suggestions:
[
  {
    "title": "Event title",
    "suggestedTime": "day and time",
    "duration": "minutes",
    "reasoning": "Why this matters for them",
    "bufferTime": "buffer considerations",
    "priority": "high/medium/low",
    "category": "work/personal/health/family",
    "adhdFriendly": "ADHD-specific considerations"
  }
]

Make suggestions feel personal, celebratory, and aligned with their unique patterns.`,
        messages: [
          {
            role: 'user',
            content: `Generate proactive calendar suggestions for ${userName} based on their onboarding insights.`
          }
        ]
      });

      const aiResponse = response.content[0].text;
      
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('AI response did not contain valid JSON array');
      }

      const suggestions = JSON.parse(jsonMatch[0]);
      
      logger.info('AI generated suggestions:', { count: suggestions.length });
      
      return suggestions;

    } catch (error) {
      logger.error('Error generating AI suggestions:', error);
      
      // Fallback suggestions
      return this.generateFallbackSuggestions(priorities, values, userName);
    }
  }

  /**
   * Generate fallback suggestions when AI fails
   * @param {array} priorities - User's priorities
   * @param {array} values - User's values
   * @param {string} userName - User's name
   * @returns {array} - Fallback suggestions
   */
  generateFallbackSuggestions(priorities, values, userName) {
    const suggestions = [];

    // Add priority-based suggestions
    if (priorities.length > 0) {
      const topPriority = priorities[0];
      suggestions.push({
        title: `Focus on ${topPriority.title || topPriority}`,
        suggestedTime: "tomorrow morning",
        duration: 60,
        reasoning: `You mentioned this is important to you`,
        bufferTime: "Add 15 minutes before and 30 minutes after",
        priority: "high",
        category: "work",
        adhdFriendly: "Schedule during your peak energy time"
      });
    }

    // Add value-based suggestions
    if (values.length > 0) {
      const energizingValue = values.find(v => v.type === 'energizing');
      if (energizingValue) {
        suggestions.push({
          title: energizingValue.activity,
          suggestedTime: "this week",
          duration: 90,
          reasoning: `This energizes you and aligns with your values`,
          bufferTime: "Add 30 minutes after for recovery",
          priority: "medium",
          category: "personal",
          adhdFriendly: "Pair with a reward to make it more appealing"
        });
      }
    }

    // Add ADHD-friendly buffer time suggestion
    suggestions.push({
      title: "Mental Health Gap",
      suggestedTime: "Friday afternoon",
      duration: 60,
      reasoning: "Protected time for decompression and processing",
      bufferTime: "No additional buffer needed",
      priority: "high",
      category: "personal",
      adhdFriendly: "Essential for preventing overwhelm"
    });

    return suggestions;
  }

  /**
   * Format suggestions for ADHD-friendly presentation
   * @param {array} suggestions - Raw suggestions
   * @param {string} userName - User's name
   * @returns {object} - Formatted suggestions with user-friendly messaging
   */
  formatSuggestionsForUser(suggestions, userName) {
    if (!suggestions || suggestions.length === 0) {
      return {
        message: `Hey ${userName}! Ready to start building your calendar? What would you like to schedule first? 💙`,
        options: []
      };
    }

    let message = `🎉 Amazing job completing your onboarding, ${userName}! Now let's build your personalized calendar system.\n\n`;
    message += `Based on everything you shared, here are some events I think would work beautifully for you:\n\n`;

    const options = suggestions.map((suggestion, index) => {
      const emoji = suggestion.priority === 'high' ? '🔥' : suggestion.priority === 'medium' ? '⭐' : '💫';
      const optionText = `${emoji} **${suggestion.title}**\n`;
      const details = `   📅 ${suggestion.suggestedTime}\n`;
      const duration = `   ⏰ ${suggestion.duration} minutes\n`;
      const reasoning = `   💭 ${suggestion.reasoning}\n`;
      
      return {
        id: `suggestion_${index}`,
        text: optionText + details + duration + reasoning,
        suggestion: suggestion,
        priority: suggestion.priority
      };
    });

    message += options.map(option => option.text).join('\n');
    message += `\n**What would you like to do?**\n\n`;
    message += `1️⃣ **Schedule one of these** - Tell me which one!\n`;
    message += `2️⃣ **Modify a suggestion** - Let me know what to change\n`;
    message += `3️⃣ **Start fresh** - What's on your mind?\n`;
    message += `4️⃣ **Take a break** - We can pick this up later\n\n`;
    message += `Whatever you choose, I celebrate it! 💙`;

    return {
      message,
      options,
      suggestions: suggestions
    };
  }

  // Add a function to extract busy times from user onboarding insights
  getBusyTimesFromOnboarding(userInsights) {
    // Example: extract gym times, work blocks, etc. from userInsights
    // This should be expanded based on your onboarding schema
    const busyTimes = [];
    if (userInsights && userInsights.gym_days && userInsights.gym_time) {
      userInsights.gym_days.forEach(day => {
        busyTimes.push({ day, time: userInsights.gym_time });
      });
    }
    // Add more extraction logic as needed for work, family, etc.
    return busyTimes;
  }

  // Add a function to check if a suggestion conflicts with busy times
  isTimeConflict(suggestion, busyTimes) {
    if (!suggestion.suggestedTime) return false;
    // Simple check: if suggestedTime contains a busy day and time, return true
    return busyTimes.some(busy => {
      return (
        suggestion.suggestedTime.toLowerCase().includes(busy.day.toLowerCase()) &&
        suggestion.suggestedTime.toLowerCase().includes(busy.time.toLowerCase())
      );
    });
  }

  // Add a function to get the next valid suggestion
  getNextValidSuggestion(suggestions, busyTimes, currentIndex) {
    for (let i = currentIndex; i < suggestions.length; i++) {
      if (!this.isTimeConflict(suggestions[i], busyTimes)) {
        return { suggestion: suggestions[i], index: i };
      }
    }
    return { suggestion: null, index: suggestions.length };
  }

  // Refactor generateFollowUpResponse to present one suggestion at a time
  async generateFollowUpResponse(userResponse, originalSuggestions, userInsights, userName, state) {
    // Get busy times from onboarding
    const busyTimes = this.getBusyTimesFromOnboarding(userInsights);
    // Track current suggestion index in state
    let currentIndex = state && state.currentSuggestionIndex ? state.currentSuggestionIndex : 0;
    // If user accepted, increment index
    let userIntent = 'clarify';
    let lowerResponse = userResponse.toLowerCase();
    if (lowerResponse.includes('yes') || lowerResponse.includes('schedule') || lowerResponse.includes('ok')) {
      userIntent = 'accept';
      currentIndex++;
    } else if (lowerResponse.includes('skip') || lowerResponse.includes('next') || lowerResponse.includes('no')) {
      userIntent = 'skip';
      currentIndex++;
    } else if (lowerResponse.includes('modify') || lowerResponse.includes('change')) {
      userIntent = 'modify';
    }
    // Get the next valid suggestion
    const { suggestion, index } = this.getNextValidSuggestion(originalSuggestions, busyTimes, currentIndex);
    if (!suggestion) {
      return {
        action: 'done',
        message: `🎉 You've reviewed all suggestions! Would you like to add something new or revisit any?`,
        currentSuggestionIndex: index
      };
    }
    // Present one suggestion at a time, with context-aware time
    let message = `Here's a suggestion: \n\n`;
    message += `**${suggestion.title}**\n`;
    message += `📅 ${suggestion.suggestedTime}\n`;
    message += `⏰ ${suggestion.duration} minutes\n`;
    message += `💭 ${suggestion.reasoning}\n`;
    message += `\nWould you like to schedule this? (yes/skip/modify)`;
    // If time is a conflict, suggest an alternative
    if (this.isTimeConflict(suggestion, busyTimes)) {
      message += `\nNote: This time may conflict with your existing routine. Would you like to pick another time?`;
    }
    return {
      action: 'present_suggestion',
      suggestion,
      message,
      currentSuggestionIndex: index
    };
  }
}

module.exports = ProactiveSuggestionEngine; 