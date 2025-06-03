const express = require('express');
const { AIAnalyzer } = require('../services/aiAnalyzer');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Generate AI analysis for a specific user
 */
router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'userId is required',
        example: { userId: '8ded07e7-9f3d-4737-a4f7-18fb1d6564c0' }
      });
    }

    logger.info(`🤖 Starting AI analysis via API for user ${userId}`);
    
    const analysisResult = await AIAnalyzer.generateUserAnalysis(userId);
    
    res.json({
      success: true,
      message: 'AI analysis completed successfully',
      result: {
        userId: analysisResult.userId,
        reportId: analysisResult.reportId,
        hasAnalysis: !!analysisResult.analysis,
        hasEmailContent: !!analysisResult.emailContent,
        emailSubject: analysisResult.emailContent?.subject,
        analysisPreview: analysisResult.analysis ? 
          analysisResult.analysis.substring(0, 200) + '...' : null
      },
      timestamp: analysisResult.timestamp
    });

  } catch (error) {
    logger.error('AI analysis API error:', error);
    res.status(500).json({
      error: 'AI analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Generate AI analysis for all active users (bulk operation)
 */
router.post('/generate-all', async (req, res) => {
  try {
    logger.info('🤖 Starting bulk AI analysis for all active users');
    
    const activeUsers = await Database.getActiveUsers();
    const results = [];
    
    for (const user of activeUsers) {
      try {
        const analysisResult = await AIAnalyzer.generateUserAnalysis(user.id);
        results.push({
          userId: user.id,
          email: user.email,
          success: true,
          reportId: analysisResult.reportId,
          hasAnalysis: !!analysisResult.analysis
        });
        logger.info(`✅ AI analysis completed for user ${user.email}`);
      } catch (error) {
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: error.message
        });
        logger.warn(`❌ AI analysis failed for user ${user.email}:`, error.message);
      }
    }

    const summary = {
      totalUsers: activeUsers.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };

    logger.info('📊 Bulk AI analysis completed:', summary);

    res.json({
      success: true,
      message: 'Bulk AI analysis completed',
      summary,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Bulk AI analysis API error:', error);
    res.status(500).json({
      error: 'Bulk AI analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get the full analysis content for a report
 */
router.get('/report/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    
    // In a real implementation, you'd have a method to get report by ID
    // For now, let's create a simple query
    const { data, error } = await require('../utils/database').supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        error: 'Report not found',
        message: `Report ${reportId} not found`
      });
    }

    res.json({
      success: true,
      report: {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        content: data.content,
        aiAnalysis: data.ai_analysis,
        sentAt: data.sent_at,
        opened: data.opened,
        engagementScore: data.engagement_score
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get report API error:', error);
    res.status(500).json({
      error: 'Failed to retrieve report',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get recent reports for a user
 */
router.get('/reports/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, type = null } = req.query;
    
    let query = require('../utils/database').supabase
      .from('reports')
      .select('id, type, sent_at, opened, engagement_score')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(parseInt(limit));
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;

    res.json({
      success: true,
      userId,
      totalReports: data?.length || 0,
      reports: data || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get user reports API error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user reports',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get analysis statistics and insights
 */
router.get('/stats', async (req, res) => {
  try {
    // Get basic statistics
    const activeUsers = await Database.getActiveUsers();
    
    // You could enhance this with more detailed analytics
    const stats = {
      totalActiveUsers: activeUsers.length,
      analysisTypes: [
        'daily_gentle_email',
        'weekly_progress_report',
        'choice_pattern_insight'
      ],
      lastAnalysisTime: new Date().toISOString(),
      system: {
        anthropicConfigured: !!process.env.ANTHROPIC_API_KEY,
        status: 'operational',
        version: '1.0.0'
      },
      adhd_approach: {
        philosophy: 'Choice empowerment over forced productivity',
        tone: 'Gentle, understanding, zero guilt/shame',
        focus: 'Celebrating conscious decision-making'
      }
    };

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Analysis stats API error:', error);
    res.status(500).json({
      error: 'Failed to get analysis statistics',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Test AI analysis with sample data
 */
router.post('/test', async (req, res) => {
  try {
    const { userId, sampleData = null } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId',
        message: 'userId is required for testing'
      });
    }

    logger.info(`🧪 Testing AI analysis for user ${userId}`);

    let analysisData;
    
    if (sampleData) {
      // Use provided sample data
      analysisData = sampleData;
    } else {
      // Gather real data
      analysisData = await AIAnalyzer.gatherAnalysisData(userId);
    }

    // Generate AI insights only (don't store as report)
    const aiInsights = await AIAnalyzer.generateAIInsights(analysisData);
    
    res.json({
      success: true,
      message: 'AI analysis test completed',
      test: {
        userId,
        usedSampleData: !!sampleData,
        dataPointsFound: analysisData.recent_data?.data_points_found || 0,
        choicePromptsFound: analysisData.choice_patterns?.total_prompts || 0,
        aiInsights: aiInsights ? aiInsights.substring(0, 500) + '...' : null,
        fullInsightsLength: aiInsights?.length || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('AI analysis test error:', error);
    res.status(500).json({
      error: 'AI analysis test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get analysis data structure for a user (for debugging)
 */
router.get('/data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    logger.info(`🔍 Gathering analysis data structure for user ${userId}`);
    
    const analysisData = await AIAnalyzer.gatherAnalysisData(userId);
    
    // Return structure without sensitive data
    const dataStructure = {
      user_info: {
        id: analysisData.user_info.id,
        email: analysisData.user_info.email,
        timezone: analysisData.user_info.timezone,
        subscription_tier: analysisData.user_info.subscription_tier
      },
      current_context: analysisData.current_context,
      data_summary: {
        calendar_events_count: analysisData.recent_data.calendar_events?.length || 0,
        has_weather_data: !!analysisData.recent_data.weather_data,
        has_habitica_data: !!analysisData.recent_data.habitica_data,
        total_data_points: analysisData.recent_data.data_points_found
      },
      choice_patterns: analysisData.choice_patterns,
      engagement_summary: {
        response_rate: analysisData.user_engagement.response_rate,
        avg_satisfaction: analysisData.user_engagement.avg_satisfaction,
        recent_feedback_count: analysisData.user_engagement.recent_feedback?.length || 0
      }
    };

    res.json({
      success: true,
      userId,
      dataStructure,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get analysis data API error:', error);
    res.status(500).json({
      error: 'Failed to get analysis data structure',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 