import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { code, state: userId, error } = req.query;
  if (error) {
    res.status(400).send(`
      <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>🚫 Authentication Failed</h2>
        <p>There was an error connecting to Google: ${error}</p>
        <p>Please try again by texting \"connect calendar\" to goodberry.</p>
      </body></html>
    `);
    return;
  }
  if (!code) {
    res.status(400).send(`
      <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>🚫 No Authorization Code</h2>
        <p>Google didn't provide the necessary authorization code.</p>
        <p>Please try again by texting \"connect calendar\" to goodberry.</p>
      </body></html>
    `);
    return;
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // For now, do not persist tokens. In production, store them in your DB.
    res.status(200).send(`
      <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>🎉 Google Calendar Connected!</h2>
        <p>Awesome! I can now see your calendar and help you schedule things via SMS.</p>
        <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>📅 Calendar connected for user: ${userId || 'unknown'}</h3>
        </div>
        <p>🧠 <strong>Try texting goodberry:</strong></p>
        <p style="background: #e6f3ff; padding: 15px; border-radius: 5px; font-style: italic;">
          \"Help me plan my week\" or \"Schedule client meeting Tuesday 10am\"
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          You can close this tab and go back to texting goodberry!
        </p>
      </body></html>
    `);
  } catch (err) {
    res.status(500).send(`
      <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>🚫 Connection Failed</h2>
        <p>Sorry, there was an error connecting your Google Calendar.</p>
        <p><strong>Error:</strong> ${err.message}</p>
        <p>Please try again by texting \"connect calendar\" to goodberry.</p>
      </body></html>
    `);
  }
} 