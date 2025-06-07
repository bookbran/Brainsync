const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Database helper methods for BrainSync Pro
 */
class Database {
  
  /**
   * Users table operations
   */
  static async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get user:', { userId, error: error.message });
      throw error;
    }
  }

  static async getActiveUsers() {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('onboarding_completed', true)
        .gte('last_active', sevenDaysAgo);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Failed to get active users:', { error: error.message });
      throw error;
    }
  }

  static async updateUserLastActive(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to update user last active:', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Data points operations
   */
  static async storeDataPoint(userId, category, data, metadata = {}) {
    try {
      const { data: result, error } = await supabase
        .from('data_points')
        .insert({
          user_id: userId,
          category,
          data,
          metadata,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      logger.debug(`📊 Stored ${category} data for user ${userId}`);
      return result;
    } catch (error) {
      logger.error('Failed to store data point:', { userId, category, error: error.message });
      throw error;
    }
  }

  static async getRecentDataPoints(userId, hoursBack = 24, limit = 10) {
    try {
      const timeThreshold = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('data_points')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', timeThreshold)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Failed to get recent data points:', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Choice logs operations
   */
  static async logChoicePrompt(userId, promptText, promptType = 'task_switch') {
    try {
      const { data, error } = await supabase
        .from('choice_logs')
        .insert({
          user_id: userId,
          prompt_text: promptText,
          prompt_type: promptType,
          prompt_sent: new Date().toISOString(),
          user_response: 'no_response'
        })
        .select()
        .single();
      
      if (error) throw error;
      logger.choiceLog(userId, 'prompt_sent', { promptType, promptId: data.id });
      return data;
    } catch (error) {
      logger.error('Failed to log choice prompt:', { userId, error: error.message });
      throw error;
    }
  }

  static async updateChoiceResponse(choiceId, response, satisfaction = null) {
    try {
      const updateData = {
        user_response: response,
        response_received: new Date().toISOString()
      };
      
      if (satisfaction !== null) {
        updateData.user_satisfaction = satisfaction;
      }

      const { data, error } = await supabase
        .from('choice_logs')
        .update(updateData)
        .eq('id', choiceId)
        .select()
        .single();
      
      if (error) throw error;
      logger.choiceLog(data.user_id, 'response_received', { response, satisfaction });
      return data;
    } catch (error) {
      logger.error('Failed to update choice response:', { choiceId, error: error.message });
      throw error;
    }
  }

  static async getRecentChoices(userId, daysBack = 7, limit = 20) {
    try {
      const timeThreshold = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('choice_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('prompt_sent', timeThreshold)
        .order('prompt_sent', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Failed to get recent choices:', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Feedback operations
   */
  static async storeFeedback(userId, feedbackText, rating = null, context = {}) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: userId,
          feedback_text: feedbackText,
          rating,
          context,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`💌 Stored feedback from user ${userId}`, { rating });
      return data;
    } catch (error) {
      logger.error('Failed to store feedback:', { userId, error: error.message });
      throw error;
    }
  }

  static async getRecentFeedback(userId, daysBack = 14, limit = 10) {
    try {
      const timeThreshold = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', timeThreshold)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Failed to get recent feedback:', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Reports operations
   */
  static async storeReport(userId, type, content, aiAnalysis = null) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: userId,
          type,
          content,
          ai_analysis: aiAnalysis,
          sent_at: new Date().toISOString(),
          opened: false,
          engagement_score: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`📧 Stored ${type} report for user ${userId}`);
      return data;
    } catch (error) {
      logger.error('Failed to store report:', { userId, type, error: error.message });
      throw error;
    }
  }

  /**
   * Health check
   */
  static async healthCheck() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      logger.error('Database health check failed:', { error: error.message });
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }

  /**
   * Look up a user by phone number (stub for now)
   */
  static async getUserByPhone(phone) {
    // TODO: Implement real lookup logic
    return null;
  }
}

module.exports = { Database, supabase }; 