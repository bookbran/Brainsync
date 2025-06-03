const Anthropic = require('@anthropic-ai/sdk');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');

/**
 * AI Analysis Service for BrainSync Pro
 * Replaces n8n AI analysis workflow with direct Anthropic integration
 */
class AIAnalyzer {

  static anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  /**
   * Generate complete AI analysis for a user
   */
  static async generateUserAnalysis(userId) {
    logger.aiLog('analysis_started', { userId });

    try {
      // Gather all user data
      const analysisData = await this.gatherAnalysisData(userId);
      
      // Generate AI insights
      const aiInsights = await this.generateAIInsights(analysisData);
      
      // Create formatted email content
      const emailContent = await this.formatGentleEmail(analysisData, aiInsights);
      
      // Store the analysis
      const report = await Database.storeReport(
        userId,
        'daily_gentle_email',
        emailContent,
        aiInsights
      );

      logger.aiLog('analysis_completed', { 
        userId, 
        reportId: report.id,
        hasInsights: !!aiInsights 
      });

      return {
        userId,
        analysis: aiInsights,
        emailContent,
        reportId: report.id,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('AI analysis failed:', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Gather all data needed for analysis
   */
  static async gatherAnalysisData(userId) {
    try {
      // Get user info
      const user = await Database.getUser(userId);
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      // Get recent data points (last 24 hours)
      const dataPoints = await Database.getRecentDataPoints(userId, 24, 10);
      
      // Get recent choice history (last 7 days)
      const choiceHistory = await Database.getRecentChoices(userId, 7, 20);
      
      // Get recent feedback (last 14 days)
      const feedback = await Database.getRecentFeedback(userId, 14, 10);

      // Process data points by category
      const processedData = {
        calendar: null,
        weather: null,
        habitica: null
      };

      dataPoints.forEach(point => {
        if (point.category && processedData.hasOwnProperty(point.category)) {
          processedData[point.category] = point.data;
        }
      });

      // Calculate choice statistics
      const choiceStats = this.calculateChoiceStatistics(choiceHistory);
      
      // Calculate feedback statistics
      const feedbackStats = this.calculateFeedbackStatistics(feedback);

      const analysisData = {
        user_info: {
          id: user.id,
          email: user.email,
          timezone: user.timezone || 'UTC',
          subscription_tier: user.subscription_tier || 'free',
          preferences: user.preferences || {}
        },
        current_context: {
          date: new Date().toLocaleDateString(),
          day_of_week: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
          current_time: new Date().toLocaleTimeString(),
          user_location: user.preferences?.location || 'Portland, OR'
        },
        recent_data: {
          calendar_events: processedData.calendar?.events || [],
          weather_data: processedData.weather?.current || null,
          habitica_data: processedData.habitica || null,
          data_points_found: dataPoints.length
        },
        choice_patterns: choiceStats,
        user_engagement: {
          response_rate: choiceStats.response_rate,
          avg_satisfaction: choiceStats.avg_satisfaction,
          recent_feedback: feedback.slice(0, 3).map(f => f.feedback_text).filter(Boolean),
          feedback_stats: feedbackStats
        },
        collection_step: 'all_data_ready_for_ai'
      };

      logger.debug('Analysis data gathered:', {
        userId,
        dataPointsCount: dataPoints.length,
        choiceHistoryCount: choiceHistory.length,
        feedbackCount: feedback.length
      });

      return analysisData;

    } catch (error) {
      logger.error('Failed to gather analysis data:', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Generate AI insights using Anthropic
   */
  static async generateAIInsights(analysisData) {
    try {
      const prompt = this.buildAIPrompt(analysisData);
      
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1200,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const aiContent = response.content[0]?.text || null;
      
      if (!aiContent) {
        logger.warn('Empty response from Anthropic API');
        return this.getFallbackInsights(analysisData);
      }

      logger.aiLog('insights_generated', { 
        userId: analysisData.user_info.id,
        contentLength: aiContent.length 
      });

      return aiContent;

    } catch (error) {
      logger.error('Anthropic API error:', { error: error.message });
      return this.getFallbackInsights(analysisData);
    }
  }

  /**
   * Build the AI prompt with user context
   */
  static buildAIPrompt(analysisData) {
    return `You are BrainSync Pro, an AI life optimization agent specifically designed for people with ADHD. Your role is to be a gentle, understanding friend who celebrates all choices - productive or otherwise.

CORE PHILOSOPHY:
- Honor the user's autonomy and right to choose
- Celebrate conscious decision-making over forced productivity
- Use humor and understanding, never guilt or shame
- Acknowledge that some days are harder than others
- Validate ADHD struggles while offering gentle support

USER CONTEXT:
${JSON.stringify(analysisData, null, 2)}

ANALYSIS FRAMEWORK:
1. Choice Empowerment: Celebrate recent conscious decisions
2. Energy Management: Based on patterns and current context
3. Gentle Guidance: Offer options without pressure
4. Pattern Recognition: Note trends with compassion
5. ADHD Understanding: Account for hyperfocus, executive function, emotional regulation

OUTPUT FORMAT:
🌅 Morning Energy Check: "How's your brain feeling today?"
🎯 Gentle Opportunities: "Some options for today (if you're feeling it):"
💖 Choice Celebration: "Recently you actively chose [specific examples] - that's self-awareness!"
🌊 Flow State Honor: "If you're deep in something else, that's valuable too"
💡 Gentle Insight: One understanding observation about their patterns
🎉 Progress Win: Acknowledge any form of progress or self-care

TONE: Friend who has ADHD too, gentle humor, zero pressure, maximum understanding
LENGTH: 250-350 words total

SAMPLE STYLE:
- "Your calendar says 'deep work block' but I see you've been researching random Wikipedia articles for 2 hours. Plot twist: that IS deep work for your brain! Want to keep going or gently shift gears?"
- "Looks like you planned to do laundry today. Your options: 1) Actually do laundry (revolutionary!), 2) Do something else and feel good about it, 3) Compromise and just move it to the dryer. All valid choices!"
- "Your habit tracker is giving you gentle side-eye about that morning routine. But hey, you're reading this message, which means you're thinking about your day. That's already a win! 🏆"

Generate a gentle, empowering daily analysis based on their data:`;
  }

  /**
   * Fallback insights when AI fails
   */
  static getFallbackInsights(analysisData) {
    const userName = analysisData.user_info.email.split('@')[0];
    
    return `🌅 **Morning Energy Check**
Hey ${userName}! 🧠💙 Your brain is online and thinking about the day ahead - that's already a win!

🎯 **Gentle Opportunities** 
Some options for today (if you're feeling it):
• Honor whatever energy level you're at right now
• Maybe tackle one small thing that feels doable
• Or just focus on existing - that's valid too!

💖 **Choice Celebration**
You're here, reading this message, which means you're actively choosing to think about your day. That's self-awareness in action! 

🌊 **Flow State Honor**
If you're deep in something else when you read this, that's valuable too. ADHD hyperfocus is a superpower when it strikes.

💡 **Gentle Insight**
Some days our tech doesn't cooperate (just like our ADHD brains!), but what matters is that you're showing up for yourself.

🎉 **Progress Win**
Every moment of self-awareness counts. You're here, you're thinking about your choices, and that's exactly what BrainSync Pro is about - celebrating conscious decision-making! 🏆

Unable to generate your personalized gentle guidance at this time, but that's okay - some days the tech doesn't cooperate, just like our ADHD brains! What we do know: You're here, you're thinking about your day, and that's already a win. Every moment of self-awareness counts!`;
  }

  /**
   * Format the complete email content
   */
  static async formatGentleEmail(analysisData, aiInsights) {
    const userName = analysisData.user_info.email.split('@')[0];
    
    const subjectOptions = [
      `🧠💙 Your Gentle Daily Guide - ${analysisData.current_context.date}`,
      `✨ Choice Celebration Time - ${analysisData.current_context.day_of_week}`,
      `🌈 Your ADHD-Friendly Day Ahead - ${analysisData.current_context.date}`,
      `💝 Gentle Nudges & Celebration - ${analysisData.current_context.day_of_week}`
    ];

    const emailSubject = subjectOptions[Math.floor(Math.random() * subjectOptions.length)];

    const emailContent = `Hi ${userName}! 👋

Your gentle, ADHD-friendly guide for ${analysisData.current_context.day_of_week}, ${analysisData.current_context.date}:

${aiInsights}

---

📊 **Your Choice Stats This Week:**
• Active decisions made: ${analysisData.choice_patterns.responses} out of ${analysisData.choice_patterns.total_prompts} prompts
• Times you chose to switch tasks: ${analysisData.choice_patterns.switch_choices}
• Times you chose to keep going: ${analysisData.choice_patterns.continue_choices}
• Compromise solutions: ${analysisData.choice_patterns.compromise_choices}
• Your response rate: ${analysisData.choice_patterns.response_rate}% (that's self-awareness!)

🎯 **Your World Today:**
• Weather: ${analysisData.recent_data.weather_data ? 
  `${analysisData.recent_data.weather_data.temperature}°F, ${analysisData.recent_data.weather_data.description}` : 
  'Taking a data break'}
• Calendar: ${analysisData.recent_data.calendar_events?.length || 0} events planned
• Habits: ${analysisData.recent_data.habitica_data ? 
  `Level ${analysisData.recent_data.habitica_data.profile?.level || 0} adventurer!` : 
  'Offline mode'}
• Data sources: ${analysisData.recent_data.data_points_found} fresh data points collected

💌 **How did this land with you?** Reply with:
🎯 "Helpful" if it resonated
🤗 "Gentle" if the tone felt right
🔄 "Different" if you want something adjusted

---
BrainSync Pro - Celebrating your choices, honoring your brain
Choice is power: https://brainsyncpro.com/choices`;

    return {
      subject: emailSubject,
      content: emailContent,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate choice statistics from choice history
   */
  static calculateChoiceStatistics(choiceHistory) {
    const stats = {
      total_prompts: choiceHistory.length,
      responses: choiceHistory.filter(item => item.user_response !== 'no_response').length,
      switch_choices: choiceHistory.filter(item => item.user_response === 'switch').length,
      continue_choices: choiceHistory.filter(item => item.user_response === 'continue').length,
      compromise_choices: choiceHistory.filter(item => item.user_response === 'compromise').length
    };

    // Calculate response rate
    stats.response_rate = stats.total_prompts > 0 ? 
      parseFloat((stats.responses / stats.total_prompts * 100).toFixed(1)) : 0;

    // Calculate average satisfaction
    const satisfactionScores = choiceHistory
      .filter(item => item.user_satisfaction && item.user_satisfaction > 0)
      .map(item => item.user_satisfaction);

    stats.avg_satisfaction = satisfactionScores.length > 0 ?
      parseFloat((satisfactionScores.reduce((a, b) => a + b) / satisfactionScores.length).toFixed(1)) : 0;

    return stats;
  }

  /**
   * Calculate feedback statistics
   */
  static calculateFeedbackStatistics(feedback) {
    const stats = {
      total_feedback: feedback.length,
      avg_rating: 0,
      positive_feedback: 0
    };

    if (feedback.length > 0) {
      const ratings = feedback.map(item => item.rating || 3);
      stats.avg_rating = parseFloat((ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1));
      stats.positive_feedback = feedback.filter(item => (item.rating || 3) >= 4).length;
    }

    return stats;
  }
}

module.exports = { AIAnalyzer }; 