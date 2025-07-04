const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const logger = require('../utils/logger');

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'https://goodberry.ai/auth/google/callback' // Use environment variable for redirect URI
);

// Initialize Google APIs
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
const tasks = google.tasks({ version: 'v1', auth: oauth2Client });

/**
 * Generate OAuth2 authorization URL for user consent
 * @param {string} userId - The user's ID for state parameter
 * @returns {string} - Authorization URL
 */
const getAuthUrl = (userId) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/tasks'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: userId // Pass user ID to associate tokens later
  });

  logger.info('Generated Google OAuth URL', { userId });
  return authUrl;
};

/**
 * Exchange authorization code for access tokens
 * @param {string} code - Authorization code from Google
 * @returns {Promise<object>} - Token object
 */
const getTokensFromCode = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    logger.info('OAuth tokens received:', tokens); // Debug log for tokens
    logger.info('OAuth tokens (stringified):', JSON.stringify(tokens, null, 2)); // Stringified tokens
    logger.info('Successfully exchanged code for tokens');
    return tokens;
  } catch (error) {
    logger.error('Error exchanging code for tokens:', error);
    throw new Error('Failed to authenticate with Google');
  }
};

/**
 * Set user tokens for API calls
 * @param {object} tokens - User's access and refresh tokens
 */
const setUserTokens = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

/**
 * Read user's calendar events
 * @param {object} options - Query options
 * @returns {Promise<array>} - Array of calendar events
 */
const getCalendarEvents = async (options = {}) => {
  try {
    const {
      timeMin = new Date().toISOString(),
      timeMax = null,
      maxResults = 20,
      calendarId = 'primary'
    } = options;

    // Re-initialize calendar client with current credentials
    const { google } = require('googleapis');
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    logger.info('About to call calendar.events.list with credentials:', oauth2Client.credentials); // Debug log for credentials
    logger.info('oauth2Client.credentials (stringified):', JSON.stringify(oauth2Client.credentials, null, 2)); // Stringified credentials

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    logger.info('Retrieved calendar events', { 
      eventCount: events.length,
      calendarId 
    });

    return events.map(event => ({
      id: event.id,
      summary: event.summary || 'No title',
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      attendees: event.attendees?.map(a => a.email) || [],
      status: event.status,
      created: event.created,
      updated: event.updated
    }));
  } catch (error) {
    logger.error('Error fetching calendar events:');
    if (error.response && error.response.data) {
      logger.error('Google API error response:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.errors) {
      logger.error('Google API error.errors:', JSON.stringify(error.errors, null, 2));
    }
    logger.error('Error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    logger.error('Error message:', error.message);
    throw new Error('Failed to fetch calendar events');
  }
};

/**
 * Create a new calendar event
 * @param {object} eventData - Event details
 * @returns {Promise<object>} - Created event
 */
const createCalendarEvent = async (eventData) => {
  try {
    const {
      summary,
      description,
      startTime,
      endTime,
      location,
      attendees = [],
      calendarId = 'primary'
    } = eventData;

    const event = {
      summary,
      description,
      location,
      start: {
        dateTime: startTime,
        timeZone: 'America/New_York', // TODO: Use user's timezone
      },
      end: {
        dateTime: endTime,
        timeZone: 'America/New_York',
      },
      attendees: attendees.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      resource: event,
    });

    logger.info('Created calendar event', {
      eventId: response.data.id,
      summary: response.data.summary
    });

    return {
      id: response.data.id,
      summary: response.data.summary,
      htmlLink: response.data.htmlLink,
      start: response.data.start,
      end: response.data.end
    };
  } catch (error) {
    logger.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
};

/**
 * Get user's task lists
 * @returns {Promise<array>} - Array of task lists
 */
const getTaskLists = async () => {
  try {
    const response = await tasks.tasklists.list();
    const taskLists = response.data.items || [];

    logger.info('Retrieved task lists', { count: taskLists.length });

    return taskLists.map(taskList => ({
      id: taskList.id,
      title: taskList.title,
      updated: taskList.updated
    }));
  } catch (error) {
    logger.error('Error fetching task lists:', error);
    throw new Error('Failed to fetch task lists');
  }
};

/**
 * Get tasks from a specific task list
 * @param {string} taskListId - ID of the task list
 * @returns {Promise<array>} - Array of tasks
 */
const getTasks = async (taskListId) => {
  try {
    const response = await tasks.tasks.list({
      tasklist: taskListId,
      showCompleted: false, // Only get incomplete tasks
      maxResults: 50
    });

    const taskItems = response.data.items || [];

    logger.info('Retrieved tasks', { 
      taskListId, 
      taskCount: taskItems.length 
    });

    return taskItems.map(task => ({
      id: task.id,
      title: task.title,
      notes: task.notes,
      status: task.status,
      due: task.due,
      updated: task.updated,
      parent: task.parent // For subtasks
    }));
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

/**
 * Check if user has granted necessary permissions
 * @returns {Promise<boolean>} - True if user is authenticated
 */
const isAuthenticated = async () => {
  try {
    // Try to make a simple API call to test authentication
    await calendar.calendarList.list({ maxResults: 1 });
    return true;
  } catch (error) {
    logger.info('User not authenticated or tokens expired');
    return false;
  }
};

/**
 * Refresh expired access tokens
 * @returns {Promise<object>} - New tokens
 */
const refreshTokens = async () => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    
    logger.info('Successfully refreshed access tokens');
    return credentials;
  } catch (error) {
    logger.error('Error refreshing tokens:', error);
    throw new Error('Failed to refresh authentication tokens');
  }
};

module.exports = {
  getAuthUrl,
  getTokensFromCode,
  setUserTokens,
  getCalendarEvents,
  createCalendarEvent,
  getTaskLists,
  getTasks,
  isAuthenticated,
  refreshTokens
}; 