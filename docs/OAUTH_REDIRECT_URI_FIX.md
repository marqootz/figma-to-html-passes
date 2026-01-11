# Fix: OAuth Redirect URI Mismatch Error

## The Problem

You're getting `Error 400: redirect_uri_mismatch` because the redirect URI in your OAuth client doesn't match what the plugin is using.

## Solution 1: Use Out-of-Band Redirect (Recommended for Figma)

Figma plugins can't receive HTTP redirects, so we use Google's "out-of-band" redirect URI.

### Step 1: Update OAuth Client Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   urn:ietf:wg:oauth:2.0:oob
   ```
5. Click **Save**

### Step 2: Rebuild Plugin

The plugin code has been updated to use this redirect URI. Rebuild:

```bash
export GOOGLE_DRIVE_FOLDER_ID='1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq'
export GOOGLE_SERVICE_ACCOUNT_JSON=$(cat config/service-account.json)
node build.js
```

### Step 3: Connect

1. Open plugin → Click **Settings**
2. Paste OAuth Client ID → **Save**
3. Click **Connect to Google Drive**
4. After authorizing, Google will show the token on the page (not in URL)
5. Copy the entire token and paste in Settings → Access Token → **Save**

## Solution 2: Use OAuth Playground (Alternative - No Configuration Needed)

If you don't want to configure redirect URIs:

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon ⚙️ → Check **"Use your own OAuth credentials"**
3. Enter your OAuth Client ID and Client Secret
4. In left panel, find and select:
   ```
   https://www.googleapis.com/auth/drive.file
   ```
5. Click **Authorize APIs** → Sign in with Google
6. Click **Exchange authorization code for tokens**
7. Copy the **Access token** (long string)
8. Paste in plugin Settings → Access Token field → **Save**

This bypasses the redirect URI issue entirely!

## Solution 3: Use Localhost Redirect (For Testing)

If you prefer a local redirect:

1. In Google Cloud Console → OAuth Client settings
2. Add to **Authorized redirect URIs**:
   ```
   http://localhost:8080
   http://127.0.0.1:8080
   ```
3. Update plugin code to use `http://localhost:8080` as redirect URI
4. Run a local server on port 8080 to catch the redirect
5. Extract token from redirect URL

**Note:** This requires running a local server, which is more complex.

## Why Out-of-Band (OOB) Works Best for Figma

- ✅ No server needed
- ✅ No redirect configuration needed (just add one URI)
- ✅ Token is displayed directly on Google's page
- ✅ Works from any environment (no localhost needed)
- ✅ Simple for users - just copy and paste token

## Quick Fix Summary

**Easiest solution:**
1. Add `urn:ietf:wg:oauth:2.0:oob` to OAuth Client redirect URIs in Google Cloud Console
2. Rebuild plugin
3. Use "Connect to Google Drive" - token will appear on page (not in URL)

**Fastest solution:**
- Use OAuth Playground (Solution 2) - no redirect URI configuration needed at all!
