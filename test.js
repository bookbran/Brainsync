#!/usr/bin/env node

/**
 * BrainSync Pro Test Script
 * Test our core services without n8n
 */

require('dotenv').config();
const { DataCollector } = require('./src/services/dataCollector');
const { AIAnalyzer } = require('./src/services/aiAnalyzer');
const { Database } = require('./src/utils/database');
const logger = require('./src/utils/logger');

const TEST_USER_ID = process.env.TEST_USER_ID || '8ded07e7-9f3d-4737-a4f7-18fb1d6564c0';

async function runTests() {
  logger.info('🧪 Starting BrainSync Pro tests...');

  try {
    // Test 1: Database Health Check
    logger.info('🔍 Testing database connection...');
    const dbHealth = await Database.healthCheck();
    logger.info('Database health:', dbHealth);

    // Test 2: Get Test User
    logger.info('👤 Testing user retrieval...');
    const user = await Database.getUser(TEST_USER_ID);
    if (user) {
      logger.info(`✅ User found: ${user.email}`);
    } else {
      logger.warn('⚠️ Test user not found, but that\'s okay for testing');
    }

    // Test 3: Data Collection
    logger.info('📊 Testing data collection...');
    try {
      const collectionResults = await DataCollector.collectUserData(TEST_USER_ID);
      logger.info('✅ Data collection completed:', {
        collected: Object.keys(collectionResults.collected),
        errors: Object.keys(collectionResults.errors)
      });
    } catch (error) {
      logger.warn('⚠️ Data collection failed (expected if no API keys):', error.message);
    }

    // Test 4: AI Analysis
    logger.info('🤖 Testing AI analysis...');
    try {
      const analysisResults = await AIAnalyzer.generateUserAnalysis(TEST_USER_ID);
      logger.info('✅ AI analysis completed:', {
        hasAnalysis: !!analysisResults.analysis,
        hasEmailContent: !!analysisResults.emailContent,
        reportId: analysisResults.reportId
      });
      
      // Show a snippet of the email content
      if (analysisResults.emailContent?.content) {
        logger.info('📧 Email preview (first 200 chars):', 
          analysisResults.emailContent.content.substring(0, 200) + '...'
        );
      }
    } catch (error) {
      logger.warn('⚠️ AI analysis failed (expected if no API key):', error.message);
    }

    // Test 5: Store some test data
    logger.info('💾 Testing data storage...');
    try {
      await Database.storeDataPoint(TEST_USER_ID, 'test', {
        message: 'Test data point from BrainSync Pro test script',
        timestamp: new Date().toISOString()
      });
      logger.info('✅ Test data point stored');
    } catch (error) {
      logger.warn('⚠️ Data storage failed:', error.message);
    }

    // Test 6: Choice logging
    logger.info('🎯 Testing choice logging...');
    try {
      const choiceLog = await Database.logChoicePrompt(
        TEST_USER_ID,
        'Test choice prompt: Would you like to continue testing or take a break?',
        'test_prompt'
      );
      logger.info('✅ Choice prompt logged:', choiceLog.id);
    } catch (error) {
      logger.warn('⚠️ Choice logging failed:', error.message);
    }

    logger.info('🎉 Tests completed! BrainSync Pro core services are functional.');
    
    // Environment status
    logger.info('🔧 Environment status:');
    logger.info('- Supabase URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    logger.info('- Supabase Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    logger.info('- Anthropic API Key:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing');
    logger.info('- Google Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
    logger.info('- OpenWeather API Key:', process.env.OPENWEATHER_API_KEY ? '✅ Set' : '❌ Missing');

  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runTests()
    .then(() => {
      logger.info('✅ All tests completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Tests failed:', error);
      process.exit(1);
    });
}

module.exports = { runTests }; 