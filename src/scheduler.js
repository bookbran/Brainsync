const cron = require('node-cron');
const { DataCollector } = require('./services/dataCollector');
const { AIAnalyzer } = require('./services/aiAnalyzer');
const { Database } = require('./utils/database');
const logger = require('./utils/logger');

/**
 * Background Job Scheduler for BrainSync Pro
 * Replaces n8n cron triggers with Node.js cron jobs
 */
class Scheduler {
  
  static jobs = [];

  /**
   * Initialize all scheduled jobs
   */
  static initializeScheduler() {
    logger.info('🔄 Initializing BrainSync Pro scheduler...');

    // Data Collection Job - Every 30 minutes during active hours
    const dataCollectionJob = cron.schedule('*/30 8-22 * * *', async () => {
      await this.runDataCollection();
    }, {
      scheduled: false,
      timezone: 'America/Los_Angeles'
    });

    // AI Analysis Job - Daily at 6 AM
    const aiAnalysisJob = cron.schedule('0 6 * * *', async () => {
      await this.runAIAnalysis();
    }, {
      scheduled: false,
      timezone: 'America/Los_Angeles'
    });

    // Choice Prompts Job - Every 15 minutes during active hours
    const choicePromptsJob = cron.schedule('*/15 9-21 * * *', async () => {
      await this.runChoicePrompts();
    }, {
      scheduled: false,
      timezone: 'America/Los_Angeles'
    });

    // Weekly Reports Job - Sundays at 8 AM
    const weeklyReportsJob = cron.schedule('0 8 * * 0', async () => {
      await this.runWeeklyReports();
    }, {
      scheduled: false,
      timezone: 'America/Los_Angeles'
    });

    // Health Check Job - Every 5 minutes
    const healthCheckJob = cron.schedule('*/5 * * * *', async () => {
      await this.runHealthCheck();
    }, {
      scheduled: false
    });

    // Store job references
    this.jobs = [
      { name: 'Data Collection', job: dataCollectionJob, schedule: 'Every 30 minutes (8 AM - 10 PM)' },
      { name: 'AI Analysis', job: aiAnalysisJob, schedule: 'Daily at 6 AM' },
      { name: 'Choice Prompts', job: choicePromptsJob, schedule: 'Every 15 minutes (9 AM - 9 PM)' },
      { name: 'Weekly Reports', job: weeklyReportsJob, schedule: 'Sundays at 8 AM' },
      { name: 'Health Check', job: healthCheckJob, schedule: 'Every 5 minutes' }
    ];

    // Start all jobs
    this.startAllJobs();

    logger.info(`✅ Scheduler initialized with ${this.jobs.length} jobs`);
  }

  /**
   * Start all scheduled jobs
   */
  static startAllJobs() {
    this.jobs.forEach(({ name, job }) => {
      job.start();
      logger.info(`📅 Started job: ${name}`);
    });
  }

  /**
   * Stop all scheduled jobs
   */
  static stopAllJobs() {
    this.jobs.forEach(({ name, job }) => {
      job.stop();
      logger.info(`⏹️ Stopped job: ${name}`);
    });
  }

  /**
   * Get status of all jobs
   */
  static getJobStatus() {
    return this.jobs.map(({ name, job, schedule }) => ({
      name,
      schedule,
      running: job.getStatus() === 'scheduled',
      nextRun: 'Not available' // node-cron doesn't provide next run time
    }));
  }

  /**
   * Data Collection Job - Every 30 minutes
   */
  static async runDataCollection() {
    try {
      logger.info('🔄 Starting scheduled data collection...');
      
      const activeUsers = await Database.getActiveUsers();
      let successCount = 0;
      let errorCount = 0;

      for (const user of activeUsers) {
        try {
          await DataCollector.collectUserData(user.id);
          successCount++;
        } catch (error) {
          errorCount++;
          logger.warn(`Data collection failed for user ${user.email}:`, error.message);
        }
      }

      logger.info(`📊 Data collection completed: ${successCount} successful, ${errorCount} failed`);

    } catch (error) {
      logger.error('Scheduled data collection failed:', error);
    }
  }

  /**
   * AI Analysis Job - Daily at 6 AM
   */
  static async runAIAnalysis() {
    try {
      logger.info('🤖 Starting scheduled AI analysis...');
      
      const activeUsers = await Database.getActiveUsers();
      let successCount = 0;
      let errorCount = 0;

      for (const user of activeUsers) {
        try {
          await AIAnalyzer.generateUserAnalysis(user.id);
          successCount++;
        } catch (error) {
          errorCount++;
          logger.warn(`AI analysis failed for user ${user.email}:`, error.message);
        }
      }

      logger.info(`🧠 AI analysis completed: ${successCount} successful, ${errorCount} failed`);

    } catch (error) {
      logger.error('Scheduled AI analysis failed:', error);
    }
  }

  /**
   * Choice Prompts Job - Every 15 minutes during active hours
   */
  static async runChoicePrompts() {
    try {
      logger.info('🎯 Starting scheduled choice prompts...');
      
      // TODO: Implement intelligent choice prompt logic
      // - Check user activity patterns
      // - Send prompts at optimal times
      // - Avoid spamming users
      
      const activeUsers = await Database.getActiveUsers();
      let promptsSent = 0;

      for (const user of activeUsers) {
        try {
          // Simple example: send choice prompt if user has been active
          const recentData = await Database.getRecentDataPoints(user.id, 2, 1);
          
          if (recentData.length > 0) {
            // Send a gentle check-in prompt
            await Database.logChoicePrompt(
              user.id,
              `🧠💙 Hey! How's your current task going? Want to keep going, switch it up, or find a compromise? No pressure - just checking in! 😊`,
              'activity_check'
            );
            promptsSent++;
          }
        } catch (error) {
          logger.warn(`Choice prompt failed for user ${user.email}:`, error.message);
        }
      }

      logger.info(`🎯 Choice prompts completed: ${promptsSent} prompts sent`);

    } catch (error) {
      logger.error('Scheduled choice prompts failed:', error);
    }
  }

  /**
   * Weekly Reports Job - Sundays at 8 AM
   */
  static async runWeeklyReports() {
    try {
      logger.info('📊 Starting scheduled weekly reports...');
      
      const activeUsers = await Database.getActiveUsers();
      let reportsGenerated = 0;

      for (const user of activeUsers) {
        try {
          // TODO: Implement weekly report generation
          // - Summarize week's choices and patterns
          // - Celebrate progress and wins
          // - Offer gentle insights for next week
          
          const weeklyData = {
            userId: user.id,
            reportType: 'weekly_progress',
            generatedAt: new Date().toISOString()
          };

          // Store placeholder weekly report
          await Database.storeReport(
            user.id,
            'weekly_progress_report',
            `Weekly progress report for ${user.email}`,
            weeklyData
          );
          
          reportsGenerated++;
        } catch (error) {
          logger.warn(`Weekly report failed for user ${user.email}:`, error.message);
        }
      }

      logger.info(`📈 Weekly reports completed: ${reportsGenerated} reports generated`);

    } catch (error) {
      logger.error('Scheduled weekly reports failed:', error);
    }
  }

  /**
   * Health Check Job - Every 5 minutes
   */
  static async runHealthCheck() {
    try {
      const health = await Database.healthCheck();
      
      if (health.status !== 'healthy') {
        logger.warn('System health check warning:', health);
        // TODO: Send alerts to administrators
      }

    } catch (error) {
      logger.error('Health check failed:', error);
      // TODO: Send critical alerts
    }
  }

  /**
   * Manual job execution (for testing/debugging)
   */
  static async runJob(jobName) {
    switch (jobName.toLowerCase()) {
      case 'data-collection':
        return await this.runDataCollection();
      case 'ai-analysis':
        return await this.runAIAnalysis();
      case 'choice-prompts':
        return await this.runChoicePrompts();
      case 'weekly-reports':
        return await this.runWeeklyReports();
      case 'health-check':
        return await this.runHealthCheck();
      default:
        throw new Error(`Unknown job: ${jobName}`);
    }
  }
}

/**
 * Initialize scheduler (called from server.js)
 */
function initializeScheduler() {
  if (process.env.NODE_ENV === 'test') {
    logger.info('Skipping scheduler initialization in test environment');
    return;
  }

  Scheduler.initializeScheduler();
}

module.exports = { 
  Scheduler, 
  initializeScheduler
}; 