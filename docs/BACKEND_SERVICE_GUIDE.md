# Backend Service for Simple OAuth Login

This guide explains how a backend service enables a simple "login" experience for users who can't use CLI tools or cloud console.

## How It Works

### The Problem
- Figma plugins **cannot receive HTTP redirects** (no local server)
- Users **cannot install CLI tools** (no `oauth2l`)
- Users **cannot access Google Cloud Console** (no manual setup)

### The Solution: Backend Service
A backend service acts as a **proxy** that handles the OAuth flow:

1. **Plugin** → "Connect" button clicked
2. **Plugin** → Sends request to backend: "I need a token"
3. **Backend** → Generates Google OAuth URL with redirect to backend
4. **Backend** → Returns auth URL to plugin
5. **Plugin** → Opens auth URL in user's browser (via `figma.openExternal()`)
6. **User** → Signs in and authorizes in browser
7. **Google** → Redirects to backend with authorization code
8. **Backend** → Exchanges code for access token (has client secret)
9. **Backend** → Stores token temporarily (session/cache)
10. **Plugin** → Polls backend: "Did user authorize? Any token yet?"
11. **Backend** → Returns token when ready
12. **Plugin** → Stores token in `clientStorage`

### Result
**Users just click "Connect" and authorize in browser** - that's it! ✅

---

## Backend Implementation

### Required Endpoints

#### 1. POST `/api/google-drive/oauth-token` - Initiate OAuth Flow

**Request:**
```json
{
  "clientId": "your-client-id.apps.googleusercontent.com",
  "clientSecret": "your-client-secret",
  "scope": "https://www.googleapis.com/auth/drive"
}
```

**Response (Option A - Polling):**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/auth?client_id=...",
  "sessionId": "unique-session-id-12345"
}
```

**Response (Option B - WebSocket/Push):**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/auth?state=session-id&...",
  "websocketUrl": "wss://your-backend.com/ws/session-id"
}
```

#### 2. GET `/api/google-drive/oauth-token/:sessionId` - Check Token Status (Polling)

**Response (still authorizing):**
```json
{
  "status": "pending",
  "message": "Waiting for user authorization..."
}
```

**Response (token ready):**
```json
{
  "status": "ready",
  "accessToken": "ya29.a0AfH6...",
  "refreshToken": "1//0g...",
  "expiresIn": 3600
}
```

**Response (error):**
```json
{
  "status": "error",
  "message": "Authorization denied or failed"
}
```

#### 3. GET `/api/google-drive/oauth/callback` - OAuth Redirect Handler

This is where Google redirects after user authorizes.

**Query Parameters:**
- `code` - Authorization code
- `state` - Session ID (from authUrl)
- `error` - Error if user denied

**Action:**
- Exchange `code` for access token using client secret
- Store token in cache/database keyed by `state` (session ID)
- Return success page to user

---

## Complete Backend Example (Node.js/Express)

```javascript
const express = require('express');
const { google } = require('googleapis');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// In-memory token storage (use Redis/database in production)
const tokenStore = new Map();

// 1. Initiate OAuth Flow
app.post('/api/google-drive/oauth-token', async (req, res) => {
  const { clientId, clientSecret, scope } = req.body;
  
  if (!clientId) {
    return res.status(400).json({ error: 'clientId required' });
  }
  
  // Generate unique session ID
  const sessionId = crypto.randomBytes(16).toString('hex');
  
  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret || null,
    `${req.protocol}://${req.get('host')}/api/google-drive/oauth/callback`
  );
  
  // Generate authorization URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scope || 'https://www.googleapis.com/auth/drive',
    prompt: 'consent',
    state: sessionId // Pass session ID in state parameter
  });
  
  // Initialize token store entry
  tokenStore.set(sessionId, {
    status: 'pending',
    createdAt: Date.now()
  });
  
  // Clean up old entries (older than 10 minutes)
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, value] of tokenStore.entries()) {
    if (value.createdAt < tenMinutesAgo) {
      tokenStore.delete(key);
    }
  }
  
  res.json({
    authUrl,
    sessionId
  });
});

// 2. Check Token Status (Polling)
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
    
    return res.json({
      status: 'ready',
      accessToken,
      refreshToken,
      expiresIn
    });
  }
  
  if (entry.status === 'error') {
    tokenStore.delete(sessionId);
    return res.json({
      status: 'error',
      message: entry.message || 'Authorization failed'
    });
  }
});

// 3. OAuth Callback Handler
app.get('/api/google-drive/oauth/callback', async (req, res) => {
  const { code, state: sessionId, error } = req.query;
  
  if (error) {
    const entry = tokenStore.get(sessionId);
    if (entry) {
      entry.status = 'error';
      entry.message = `Authorization denied: ${error}`;
    }
    
    res.send(`
      <html>
        <body>
          <h1>Authorization Failed</h1>
          <p>You denied access or an error occurred: ${error}</p>
          <p>You can close this window and try again.</p>
        </body>
      </html>
    `);
    return;
  }
  
  if (!code || !sessionId) {
    res.status(400).send('Missing code or state parameter');
    return;
  }
  
  const entry = tokenStore.get(sessionId);
  if (!entry) {
    res.status(404).send('Session not found or expired');
    return;
  }
  
  try {
    // Get client credentials from entry or config
    // In production, you'd store these securely
    const clientId = process.env.GOOGLE_CLIENT_ID; // or from database
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // or from database
    
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${req.protocol}://${req.get('host')}/api/google-drive/oauth/callback`
    );
    
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens
    entry.status = 'ready';
    entry.accessToken = tokens.access_token;
    entry.refreshToken = tokens.refresh_token;
    entry.expiresIn = tokens.expiry_date ? 
      Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600;
    
    // Show success page
    res.send(`
      <html>
        <body>
          <h1>✅ Authorization Successful!</h1>
          <p>You can close this window and return to Figma.</p>
          <p>The plugin will automatically detect your authorization.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Token exchange error:', error);
    entry.status = 'error';
    entry.message = error.message;
    
    res.status(500).send(`
      <html>
        <body>
          <h1>Authorization Failed</h1>
          <p>Error: ${error.message}</p>
          <p>You can close this window and try again.</p>
        </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
});
```

---

## Plugin Integration (✅ Complete Implementation)

The plugin **fully supports** backend service with automatic polling. Here's how it works:

### Complete Flow:
1. User clicks "Connect to Google Drive"
2. Plugin checks for `GOOGLE_AUTH_BACKEND_URL` (build time) or Settings → Backend URL
3. Plugin sends POST request to `/api/google-drive/oauth-token`
4. Backend returns `authUrl` and `sessionId`
5. Plugin opens `authUrl` in browser (`figma.openExternal()`)
6. User authorizes in browser
7. **Plugin automatically polls backend** every 2 seconds for up to 2 minutes
8. Backend returns token when ready
9. Plugin stores token automatically
10. User sees "Connected to Google Drive!" ✅

### Implementation Details:

The plugin includes `pollForBackendToken()` method that:
- Polls `/api/google-drive/oauth-token/:sessionId` every 2 seconds
- Handles `pending`, `ready`, and `error` statuses
- Automatically stores token when `ready`
- Shows appropriate error messages
- Times out after 2 minutes (60 attempts)

---

## Setup for Users (Simple!)

Once backend is set up:

1. **Admin** sets backend URL at build time: `GOOGLE_AUTH_BACKEND_URL=https://your-backend.com`
2. **Admin** sets client ID/secret in backend environment variables
3. **Users** just click "Connect to Google Drive" button
4. **Browser** opens for Google login
5. **Users** authorize
6. **Done!** ✅

**No CLI tools, no cloud console, no manual token copying!**

---

## Security Considerations

1. **Client Secret**: Must be stored securely on backend (never in plugin)
2. **Session IDs**: Should be cryptographically random and time-limited
3. **Token Storage**: Tokens stored in plugin `clientStorage` (encrypted by Figma)
4. **HTTPS**: Backend must use HTTPS in production
5. **CORS**: Configure CORS to only allow Figma plugin origin

---

## Implementation Status

✅ **Complete!** All components are implemented:

1. ✅ Backend endpoint structure (documented above)
2. ✅ Plugin polling mechanism (fully implemented)
3. ✅ Token storage (automatic)
4. ✅ Error handling (comprehensive)
5. ✅ UI feedback (status messages)

## Testing the Backend Flow

1. **Set up backend** using the example code above
2. **Configure backend URL** in plugin:
   - Build time: `GOOGLE_AUTH_BACKEND_URL=https://your-backend.com`
   - Or Settings → Backend URL
3. **Set client ID** in Settings (or backend can use env vars)
4. **Click "Connect to Google Drive"**
5. **Authorize in browser**
6. **Plugin automatically detects and stores token** ✅

The flow is now **fully automated** - users just click and authorize!