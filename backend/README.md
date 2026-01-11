# Backend Server for Figma Plugin OAuth

This backend server enables the "Connect to Google Drive" button in the Figma plugin.

## ⚠️ Important: One Backend for All Users

**You only need ONE backend server for your entire organization/team.**

- ✅ **Admin/DevOps**: Deploy the backend once (to a shared server)
- ✅ **All Users**: Use the same backend URL (configured at plugin build time)
- ❌ **Users do NOT need to run their own backend server**

The backend URL is configured at **build time** via `GOOGLE_AUTH_BACKEND_URL`, so users don't need to configure anything - they just click "Connect" and it works!

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install express googleapis
```

Or from project root:
```bash
npm install express googleapis
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your Google OAuth credentials:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
PORT=3000
```

### 3. Configure Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/google-drive/oauth/callback
   ```
5. For production, also add your production URL:
   ```
   https://your-domain.com/api/google-drive/oauth/callback
   ```
6. Click **Save**

### 4. Start the Server

```bash
node backend/server.js
```

The server will start on `http://localhost:3000`

### 5. Configure Plugin Build (Admin/DevOps Only)

**This step is done ONCE by an admin/DevOps person.** After building with the backend URL, all users can use the plugin without any setup.

Rebuild the plugin with the backend URL:

**For development/testing:**
```bash
export GOOGLE_AUTH_BACKEND_URL='http://localhost:3000'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
node build.js
```

**For production (shared by all users):**
```bash
export GOOGLE_AUTH_BACKEND_URL='https://your-domain.com'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
node build.js
```

**After building:**
- Distribute the built plugin to all users
- Users just install the plugin and click "Connect to Google Drive"
- No configuration needed - backend URL is already set!

## Testing

1. Start the backend server: `node backend/server.js`
2. Open the Figma plugin
3. Click "Connect to Google Drive"
4. A browser window should open asking for authorization
5. After authorizing, the plugin should automatically receive the token

## Production Deployment

For production, you'll need to:

1. **Deploy the server** to a hosting service (Heroku, Railway, Render, etc.)
2. **Set environment variables** on your hosting platform
3. **Update redirect URI** in Google Cloud Console to your production URL
4. **Rebuild plugin** with production backend URL

### Example: Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Set environment variables
railway variables set GOOGLE_CLIENT_ID=your-client-id
railway variables set GOOGLE_CLIENT_SECRET=your-client-secret
railway variables set PORT=3000

# Deploy
railway up
```

## Troubleshooting

### "Session not found or expired"
- The session expired (10 minute timeout)
- Try clicking "Connect" again

### "clientId required"
- Make sure `GOOGLE_CLIENT_ID` is set in `.env` or passed in request
- Check that the plugin build includes `GOOGLE_CLIENT_ID`

### "Failed to exchange authorization code"
- Check that `GOOGLE_CLIENT_SECRET` is set correctly
- Verify the redirect URI matches exactly in Google Cloud Console
- Check server logs for detailed error messages

### Browser doesn't open
- Check console logs in Figma (F12)
- Verify `GOOGLE_AUTH_BACKEND_URL` is set in plugin build
- Verify `GOOGLE_CLIENT_ID` is set in plugin build
- Check that backend server is running and accessible

## API Endpoints

- `POST /api/google-drive/oauth-token` - Initiate OAuth flow
- `GET /api/google-drive/oauth-token/:sessionId` - Check token status (polling)
- `GET /api/google-drive/oauth/callback` - OAuth redirect handler
- `GET /health` - Health check

See `docs/BACKEND_SERVICE_GUIDE.md` for detailed API documentation.
