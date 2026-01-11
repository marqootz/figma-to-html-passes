# Simple OAuth Fix - Use OAuth Playground

Google no longer supports out-of-band redirect URIs. The simplest solution is to use **OAuth Playground** - no redirect URI configuration needed!

## Quick Solution: OAuth Playground (Recommended)

### Step 1: Get Access Token from OAuth Playground

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click the **gear icon** ⚙️ (top right)
3. Check **"Use your own OAuth credentials"**
4. Enter:
   - **OAuth Client ID**: (your client ID)
   - **OAuth Client Secret**: (your client secret - get from Google Cloud Console)
5. Click **Close**

### Step 2: Authorize

1. In the left panel, scroll down and find:
   ```
   Drive API v3
   ```
2. Expand it and check:
   ```
   https://www.googleapis.com/auth/drive.file
   ```
3. Click **Authorize APIs** button
4. Sign in with your Google account
5. Click **Allow** to grant permissions

### Step 3: Get Token

1. Click **Exchange authorization code for tokens** button
2. You'll see:
   - **Access token**: (long string) ← **Copy this!**
   - Refresh token: (optional)
   - Expires in: (usually 3600 seconds = 1 hour)

### Step 4: Paste in Plugin

1. Open plugin in Figma
2. Click **Settings**
3. Paste the access token in **"Access Token"** field
4. Click **Save Settings**
5. Plugin should now show: **"Google Drive: Connected"** ✅

## Token Expiration

- Access tokens typically expire after 1 hour
- When expired, just repeat steps above to get a new token
- For longer-lived tokens, you can request a refresh token (more complex setup)

## Alternative: Use Backend Service

For a permanent solution that doesn't require manual token entry:

1. Set up a backend service that handles OAuth flow
2. Backend receives authorization code
3. Backend exchanges code for token (using client secret)
4. Backend returns token to plugin
5. Plugin stores token

This requires backend development but provides seamless experience.

## Why This Works

- ✅ No redirect URI configuration needed
- ✅ Works immediately
- ✅ No server setup required
- ✅ Simple copy/paste workflow
- ⚠️ Token expires (need to refresh periodically)

## For Production: Consider Backend

For a production setup where users shouldn't need to manually get tokens:
- Set up backend service for OAuth flow
- Or use service account with backend JWT signing
- Or implement refresh token flow
