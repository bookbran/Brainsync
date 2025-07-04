import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const { userId, redirect } = req.query;
    if (!userId) {
      res.status(400).json({ error: 'User ID required', message: 'Please provide userId parameter (phone number)' });
      return;
    }
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/tasks'
    ];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: userId
    });
    if (redirect === 'false') {
      res.status(200).json({ authUrl, message: 'Please visit this URL to connect your Google Calendar', userId });
    } else {
      res.writeHead(302, { Location: authUrl });
      res.end();
    }
  } catch (err) {
    // Log the error and show a debug message
    console.error('OAuth handler error:', err);
    res.status(500).send(`<pre>Server error: ${err.message || err}</pre>`);
  }
} 