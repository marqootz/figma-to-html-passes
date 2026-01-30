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

require('dotenv').config();

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
 * PKCE: generate code_verifier and S256 code_challenge (no client_secret needed).
 */
function generatePkce() {
  const code_verifier = crypto.randomBytes(32).toString('base64url');
  const digest = crypto.createHash('sha256').update(code_verifier).digest();
  const code_challenge = digest.toString('base64url');
  return { code_verifier, code_challenge };
}

/**
 * 1. POST /api/google-drive/oauth-token - Initiate OAuth Flow (PKCE)
 *
 * PKCE-only: only GOOGLE_CLIENT_ID required (use Desktop app OAuth client). client_secret optional for Web application client.
 *
 * Request body:
 * {
 *   "clientId": "your-client-id.apps.googleusercontent.com",
 *   "clientSecret": "optional-for-Web-application-client",
 *   "scope": "https://www.googleapis.com/auth/drive"
 * }
 *
 * Response:
 * {
 *   "authUrl": "https://accounts.google.com/o/oauth2/auth?...",
 *   "sessionId": "unique-session-id"
 * }
 */
function trimEnv(value) {
  if (typeof value !== 'string') return value;
  const t = value.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

app.post('/api/google-drive/oauth-token', async (req, res) => {
  try {
    const { clientId, clientSecret, scope } = req.body;

    const finalClientId = trimEnv(clientId || process.env.GOOGLE_CLIENT_ID);
    const finalClientSecret = trimEnv(clientSecret || process.env.GOOGLE_CLIENT_SECRET);

    if (!finalClientId) {
      return res.status(400).json({
        error: 'clientId required. Provide in request body or set GOOGLE_CLIENT_ID environment variable.'
      });
    }
    // PKCE-only: client_secret is optional. Use Desktop app OAuth client for PKCE-only (no secret).

    const sessionId = crypto.randomBytes(16).toString('hex');
    const callbackUrl = process.env.CALLBACK_URL ||
      `${req.protocol}://${req.get('host')}/api/google-drive/oauth/callback`;

    const { code_verifier, code_challenge } = generatePkce();

    console.log(`🔐 Initiating OAuth flow (PKCE) for session: ${sessionId}`);
    console.log(`   Client ID: ${finalClientId.substring(0, 30)}...`);
    console.log(`   Callback URL: ${callbackUrl}`);

    const oauth2Client = new google.auth.OAuth2(
      finalClientId,
      finalClientSecret || '',
      callbackUrl
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scope || 'https://www.googleapis.com/auth/drive',
      prompt: 'consent',
      state: sessionId,
      code_challenge,
      code_challenge_method: 'S256'
    });

    tokenStore.set(sessionId, {
      status: 'pending',
      createdAt: Date.now(),
      clientId: finalClientId,
      clientSecret: finalClientSecret || null,
      code_verifier,
      code_challenge
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
 * Response (pending): { "status": "pending", "message": "..." }
 * Response (code_received): { "status": "code_received" } — plugin should POST code_verifier to exchange
 * Response (ready): { "status": "ready", "accessToken", "refreshToken", "expiresIn" }
 * Response (error): { "status": "error", "message": "..." }
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

  if (entry.status === 'code_received') {
    return res.json({
      status: 'code_received',
      message: 'Authorization code received. Send code_verifier to exchange endpoint.'
    });
  }

  if (entry.status === 'ready') {
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
    console.log(`✅ Authorization code received for session: ${sessionId} (PKCE: plugin will exchange)`);
    entry.code = code;
    entry.status = 'code_received';

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
            <p>You can close this window and return to Figma. The plugin will automatically complete the connection.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(`❌ Callback error for session ${sessionId}:`, error);
    entry.status = 'error';
    entry.message = error.message || 'Callback failed';
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Error</h1>
          <p>${error.message}</p>
          <p>Please try again.</p>
        </body>
      </html>
    `);
  }
});

/**
 * 3b. POST /api/google-drive/oauth-token/:sessionId/exchange - PKCE token exchange
 *
 * No body required. Backend uses stored code_verifier + code; client_secret included only if set (PKCE-only for Desktop app).
 *
 * Response: { "status": "ready", "accessToken", "refreshToken", "expiresIn" }
 */
app.post('/api/google-drive/oauth-token/:sessionId/exchange', async (req, res) => {
  const { sessionId } = req.params;
  const entry = tokenStore.get(sessionId);

  if (!entry) {
    return res.status(404).json({
      status: 'error',
      message: 'Session not found or expired'
    });
  }
  if (entry.status !== 'code_received' || !entry.code || !entry.code_verifier) {
    return res.status(400).json({
      status: 'error',
      message: 'Session not ready for exchange or code/code_verifier missing'
    });
  }

  const callbackUrl = process.env.CALLBACK_URL ||
    `${req.protocol}://${req.get('host')}/api/google-drive/oauth/callback`;

  // PKCE-only: token exchange uses code_verifier; client_secret optional (required only for Web application client).
  const tokenParams = {
    code: entry.code,
    client_id: entry.clientId,
    code_verifier: entry.code_verifier,
    redirect_uri: callbackUrl,
    grant_type: 'authorization_code'
  };
  if (entry.clientSecret) {
    tokenParams.client_secret = entry.clientSecret;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams).toString()
    });

    const data = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error(`❌ Token exchange failed for session ${sessionId}:`, data);
      entry.status = 'error';
      entry.message = data.error_description || data.error || 'Token exchange failed';
      return res.json({
        status: 'error',
        message: entry.message
      });
    }

    entry.status = 'ready';
    entry.accessToken = data.access_token;
    entry.refreshToken = data.refresh_token || null;
    entry.expiresIn = data.expires_in || 3600;
    delete entry.code;
    delete entry.code_verifier;
    delete entry.clientSecret;
    tokenStore.set(sessionId, entry);

    console.log(`✅ Token exchange successful for session: ${sessionId}`);

    return res.json({
      status: 'ready',
      accessToken: entry.accessToken,
      refreshToken: entry.refreshToken,
      expiresIn: entry.expiresIn
    });
  } catch (error) {
    console.error(`❌ Token exchange error for session ${sessionId}:`, error);
    entry.status = 'error';
    entry.message = error.message || 'Token exchange failed';
    return res.status(500).json({
      status: 'error',
      message: entry.message
    });
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

// Start server when run directly (node server.js); export for Electron when required
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📋 Endpoints:`);
    console.log(`   POST /api/google-drive/oauth-token - Initiate OAuth flow (PKCE)`);
    console.log(`   GET  /api/google-drive/oauth-token/:sessionId - Poll token status`);
    console.log(`   POST /api/google-drive/oauth-token/:sessionId/exchange - PKCE token exchange`);
    console.log(`   GET  /api/google-drive/oauth/callback - OAuth callback handler`);
    console.log(`   GET  /health - Health check`);
    console.log(`\n💡 OAuth (PKCE): only GOOGLE_CLIENT_ID required (Desktop app client). client_secret optional.`);
    console.log(`   1. Set GOOGLE_CLIENT_ID in .env (GOOGLE_CLIENT_SECRET optional)`);
    console.log(`   2. Add http://localhost:${PORT}/api/google-drive/oauth/callback to Google OAuth redirect URIs`);
    console.log(`   3. Update plugin build with GOOGLE_AUTH_BACKEND_URL=http://localhost:${PORT}\n`);
  });
} else {
  module.exports = { app, PORT };
}
