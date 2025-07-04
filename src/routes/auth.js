const express = require('express');
const { 
  getAuthUrl, 
  getTokensFromCode, 
  setUserTokens,
  getCalendarEvents,
  getTaskLists 
} = require('../services/googleApi');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Start Google OAuth flow
 * GET /auth/google?userId=phoneNumber
 */
router.get('/google', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID required',
        message: 'Please provide userId parameter (phone number)'
      });
    }

    const authUrl = getAuthUrl(userId);
    
    logger.info('Starting Google OAuth flow', { userId });
    
    // For SMS users, we'll send them the auth URL
    // For web users, we redirect directly
    if (req.query.redirect === 'false') {
      res.json({
        authUrl,
        message: 'Please visit this URL to connect your Google Calendar',
        userId
      });
    } else {
      res.redirect(authUrl);
    }
    
  } catch (error) {
    logger.error('Error starting Google OAuth:', error);
    res.status(500).json({
      error: 'OAuth initialization failed',
      message: error.message
    });
  }
});

/**
 * Handle Google OAuth callback
 * GET /auth/google/callback?code=...&state=userId
 */
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state: userId, error } = req.query;
    
    if (error) {
      logger.error('Google OAuth error:', error);
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>🚫 Authentication Failed</h2>
            <p>There was an error connecting to Google: ${error}</p>
            <p>Please try again by texting "connect calendar" to goodberry.</p>
          </body>
        </html>
      `);
    }
    
    if (!code) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>🚫 No Authorization Code</h2>
            <p>Google didn't provide the necessary authorization code.</p>
            <p>Please try again by texting "connect calendar" to goodberry.</p>
          </body>
        </html>
      `);
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    
    // TODO: Store tokens in database associated with userId (phone number)
    // For now, we'll store in memory (this is temporary)
    logger.info('Successfully authenticated user', { userId, hasTokens: !!tokens });
    
    // Test the connection by fetching a few calendar events
    setUserTokens(tokens);
    const events = await getCalendarEvents({ maxResults: 3 });
    const taskLists = await getTaskLists();
    
    logger.info('Connected user calendar and tasks', {
      userId,
      eventCount: events.length,
      taskListCount: taskLists.length
    });

    // Success page
    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>🎉 Google Calendar Connected!</h2>
          <p>Awesome! I can now see your calendar and help you schedule things via SMS.</p>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>📅 What I found:</h3>
            <p><strong>${events.length}</strong> upcoming calendar events</p>
            <p><strong>${taskLists.length}</strong> task lists available</p>
          </div>
          
          <p>🧠 <strong>Try texting goodberry:</strong></p>
          <p style="background: #e6f3ff; padding: 15px; border-radius: 5px; font-style: italic;">
            "Help me plan my week" or "Schedule client meeting Tuesday 10am"
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            You can close this tab and go back to texting goodberry!
          </p>
        </body>
      </html>
    `);
    
  } catch (error) {
    logger.error('Error in Google OAuth callback:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>🚫 Connection Failed</h2>
          <p>Sorry, there was an error connecting your Google Calendar.</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <p>Please try again by texting "connect calendar" to goodberry.</p>
        </body>
      </html>
    `);
  }
});

/**
 * Test endpoint to check Google API connection
 * GET /auth/google/test?userId=phoneNumber
 */
router.get('/google/test', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID required',
        message: 'Please provide userId parameter (phone number)'
      });
    }

    // TODO: Get user tokens from database
    // For now, this will only work immediately after authentication
    
    const events = await getCalendarEvents({ maxResults: 5 });
    const taskLists = await getTaskLists();
    
    res.json({
      success: true,
      userId,
      calendar: {
        eventCount: events.length,
        recentEvents: events.map(e => ({
          summary: e.summary,
          start: e.start
        }))
      },
      tasks: {
        taskListCount: taskLists.length,
        taskLists: taskLists.map(tl => ({
          title: tl.title,
          id: tl.id
        }))
      }
    });
    
  } catch (error) {
    logger.error('Error testing Google API connection:', error);
    res.status(500).json({
      error: 'Google API test failed',
      message: error.message,
      authenticated: false
    });
  }
});

module.exports = router; 