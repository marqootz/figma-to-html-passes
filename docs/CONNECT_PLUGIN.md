# How to Connect Plugin to Google Drive

The plugin is built with service account and folder ID, but needs authentication to work.

## Quick Solution: Connect via OAuth (2 minutes)

### Step 1: Get OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `uxync-drive-integration`
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: `Figma HTML Export Plugin`
7. Authorized redirect URIs: `https://www.figma.com`
8. Click **Create**
9. **Copy the Client ID** (you'll need this)

### Step 2: Configure Plugin

1. **Open the plugin in Figma**
2. **Click "Settings" button**
3. **Enter OAuth Client ID:**
   - Paste the Client ID from Step 1
   - Click **Save Settings**
4. **Enter Google Drive Folder ID** (if not already set):
   - Folder ID: `1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq`
   - Click **Save Settings**

### Step 3: Connect

1. **Click "Connect to Google Drive" button**
2. Browser opens → Sign in with Google
3. **Authorize** the plugin to access Google Drive
4. After redirect, **copy the access token** from URL:
   - Look for `#access_token=TOKEN_HERE` in the URL
   - Copy everything after `access_token=` (until the next `&`)
5. **Paste token** in Settings → "Access Token" field
6. **Click "Save Settings"**

### Step 4: Verify

- Plugin should now show: **"Google Drive: Connected"** ✅
- You can now export HTML to Google Drive!

## Alternative: Pre-Generate Access Token (For Testing)

If you want to avoid the OAuth flow:

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon → Check "Use your own OAuth credentials"
3. Enter your OAuth Client ID and Secret
4. Select scope: `https://www.googleapis.com/auth/drive.file`
5. Click "Authorize APIs" → Sign in
6. Click "Exchange authorization code for tokens"
7. Copy the **Access token**
8. Paste in plugin Settings → "Access Token" field
9. Click **Save Settings**

## Why This Is Needed

Even though the plugin has:
- ✅ Service account JSON embedded
- ✅ Folder ID embedded

It still needs an **access token** to authenticate with Google Drive API. Service accounts require JWT signing (needs backend), so OAuth is the simplest solution for now.

## Future: Backend Service (Zero-Config)

To make it truly zero-config for users, set up a backend service that:
1. Receives service account JSON
2. Signs JWT with private key
3. Exchanges JWT for access token
4. Returns token to plugin

Then rebuild with:
```bash
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'
export GOOGLE_DRIVE_FOLDER_ID='1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq'
export GOOGLE_SERVICE_ACCOUNT_JSON=$(cat config/service-account.json)
node build.js
```

Then users won't need to configure anything!
