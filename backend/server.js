/**
 * Backend Service for Figma Plugin OAuth Flow
 * 
 * This server handles OAuth 2.0 flow for Google Drive authentication.
 * It enables the "Connect to Google Drive" button in the Figma plugin.
 * 
 * Setup:
 * 1. Install dependencies: npm install express googleapis
 * 2. Set environment variables (see .env.example)
 * 3. Run: node backend/server.js
 * 
 * The server will run on http://localhost:3000 by default.
 * Update GOOGLE_AUTH_BACKEND_URL in plugin build to point to this server.
 */

const express = require('express');
const { google } = require('googleapis');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Optional: serve static files

// Enable CORS for Figma plugin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory token storage (use Redis/database in production)
const tokenStore = new Map();

// Clean up old sessions every 5 minutes
setInterval(() => {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, value] of tokenStore.entries()) {
    if (value.createdAt < tenMinutesAgo) {
      console.log(`🧹 Cleaning up expired session: ${key}`);
      tokenStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * 1. POST /api/google-drive/oauth-token - Initiate OAuth Flow
 * 
 * Request body:
 * {
 *   "clientId": "your-client-id.apps.googleusercontent.com",
 *   "clientSecret": "your-client-secret" (optional if set in env),
 *   "scope": "https://www.googleapis.com/auth/drive"
 * }
 * 
 * Response:
 * {
 *   "authUrl": "https://accounts.google.com/o/oauth2/auth?...",
 *   "sessionId": "unique-session-id"
 * }
 */
app.post('/api/google-drive/oauth-token', async (req, res) => {
  try {
    const { clientId, clientSecret, scope } = req.body;
    
    // Use clientId from request, or fall back to environment variable
    const finalClientId = clientId || process.env.GOOGLE_CLIENT_ID;
    const finalClientSecret = clientSecret || process.env.GOOGLE_CLIENT_SECRET;
    
    if (!finalClientId) {
      return res.status(400).json({ 
        error: 'clientId required. Provide in request body or set GOOGLE_CLIENT_ID environment variable.' 
      });
    }
    
    // Generate unique session ID
    const sessionId = crypto.randomBytes(16).toString('hex');
    
    // Determine callback URL
    const callbackUrl = process.env.CALLBACK_URL || 
      `${req.protocol}://${req.get('host')}/api/google-drive/oauth/callback`;
    
    console.log(`🔐 Initiating OAuth flow for session: ${sessionId}`);
    console.log(`   Client ID: ${finalClientId.substring(0, 30)}...`);
    console.log(`   Callback URL: ${callbackUrl}`);
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      finalClientId,
      finalClientSecret || null,
      callbackUrl
    );
    
    // Generate authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scope || 'https://www.googleapis.com/auth/drive',
      prompt: 'consent',
      state: sessionId // Pass session ID in state parameter
    });
    
    // Store session info
    tokenStore.set(sessionId, {
      status: 'pending',
      createdAt: Date.now(),
      clientId: finalClientId,
      clientSecret: finalClientSecret
    });
    
    console.log(`✅ Generated auth URL for session: ${sessionId}`);
    
    res.json({
      authUrl,
      sessionId
    });
  } catch (error) {
    console.error('❌ Error initiating OAuth flow:', error);
    res.status(500).json({ 
      error: 'Failed to initiate OAuth flow',
      message: error.message 
    });
  }
});

/**
 * 2. GET /api/google-drive/oauth-token/:sessionId - Check Token Status (Polling)
 * 
 * Response (pending):
 * {
 *   "status": "pending",
 *   "message": "Waiting for user authorization..."
 * }
 * 
 * Response (ready):
 * {
 *   "status": "ready",
 *   "accessToken": "ya29.a0AfH6...",
 *   "refreshToken": "1//0g...",
 *   "expiresIn": 3600
 * }
 * 
 * Response (error):
 * {
 *   "status": "error",
 *   "message": "Authorization denied or failed"
 * }
 */
app.get('/api/google-drive/oauth-token/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const entry = tokenStore.get(sessionId);
  
  if (!entry) {
    return res.status(404).json({
      status: 'error',
      message: 'Session not found or expired'
    });
  }
  
  if (entry.status === 'pending') {
    return res.json({
      status: 'pending',
      message: 'Waiting for user authorization...'
    });
  }
  
  if (entry.status === 'ready') {
    // Return token and clean up
    const { accessToken, refreshToken, expiresIn } = entry;
    tokenStore.delete(sessionId);
    
    console.log(`✅ Token ready for session: ${sessionId}`);
    
    return res.json({
      status: 'ready',
      accessToken,
      refreshToken,
      expiresIn
    });
  }
  
  if (entry.status === 'error') {
    const message = entry.message || 'Authorization failed';
    tokenStore.delete(sessionId);
    
    console.log(`❌ Token error for session: ${sessionId} - ${message}`);
    
    return res.json({
      status: 'error',
      message
    });
  }
});

/**
 * 3. GET /api/google-drive/oauth/callback - OAuth Redirect Handler
 * 
 * This is where Google redirects after user authorizes.
 * Query parameters:
 * - code: Authorization code
 * - state: Session ID (from authUrl)
 * - error: Error if user denied
 */
app.get('/api/google-drive/oauth/callback', async (req, res) => {
  const { code, state: sessionId, error } = req.query;
  
  if (error) {
    console.error(`❌ OAuth callback error for session ${sessionId}:`, error);
    
    const entry = tokenStore.get(sessionId);
    if (entry) {
      entry.status = 'error';
      entry.message = `Authorization denied: ${error}`;
    }
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .error {
              background: #fee;
              border: 1px solid #fcc;
              padding: 20px;
              border-radius: 8px;
              color: #c33;
            }
            .success {
              background: #efe;
              border: 1px solid #cfc;
              padding: 20px;
              border-radius: 8px;
              color: #3c3;
            }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>❌ Authorization Failed</h1>
            <p>You denied access or an error occurred: <strong>${error}</strong></p>
            <p>You can close this window and try again in the Figma plugin.</p>
          </div>
        </body>
      </html>
    `);
    return;
  }
  
  if (!code || !sessionId) {
    res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Error</h1>
          <p>Missing code or state parameter</p>
        </body>
      </html>
    `);
    return;
  }
  
  const entry = tokenStore.get(sessionId);
  if (!entry) {
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Error</h1>
          <p>Session not found or expired. Please try again.</p>
        </body>
      </html>
    `);
    return;
  }
  
  try {
    console.log(`🔄 Exchanging authorization code for token for session: ${sessionId}`);
    
    // Get client credentials from stored entry
    const { clientId, clientSecret } = entry;
    
    if (!clientId) {
      throw new Error('Client ID not found in session');
    }
    
    // Determine callback URL
    const callbackUrl = process.env.CALLBACK_URL || 
      `${req.protocol}://${req.get('host')}/api/google-drive/oauth/callback`;
    
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret || null,
      callbackUrl
    );
    
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log(`✅ Successfully obtained tokens for session: ${sessionId}`);
    
    // Store tokens in session entry
    entry.status = 'ready';
    entry.accessToken = tokens.access_token;
    entry.refreshToken = tokens.refresh_token;
    entry.expiresIn = tokens.expiry_date ? 
      Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600;
    
    // Show success page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .success {
              background: #efe;
              border: 1px solid #cfc;
              padding: 20px;
              border-radius: 8px;
              color: #3c3;
            }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✅ Authorization Successful!</h1>
            <p>You have successfully authorized the Figma plugin to access Google Drive.</p>
            <p>You can close this window and return to Figma. The plugin will automatically detect the authorization.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(`❌ Error exchanging code for token for session ${sessionId}:`, error);
    
    entry.status = 'error';
    entry.message = error.message || 'Failed to exchange authorization code';
    
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Error</h1>
          <p>Failed to exchange authorization code: ${error.message}</p>
          <p>Please try again.</p>
        </body>
      </html>
    `);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeSessions: tokenStore.size
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST /api/google-drive/oauth-token - Initiate OAuth flow`);
  console.log(`   GET  /api/google-drive/oauth-token/:sessionId - Check token status`);
  console.log(`   GET  /api/google-drive/oauth/callback - OAuth callback handler`);
  console.log(`   GET  /health - Health check`);
  console.log(`\n💡 Make sure to:`);
  console.log(`   1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables`);
  console.log(`   2. Add http://localhost:${PORT}/api/google-drive/oauth/callback to Google OAuth redirect URIs`);
  console.log(`   3. Update plugin build with GOOGLE_AUTH_BACKEND_URL=http://localhost:${PORT}\n`);
});
