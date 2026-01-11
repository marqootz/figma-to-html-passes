# Admin Setup - One-Time Configuration Guide

This guide shows how to configure the plugin **once** at build time so that **all users** can use it without any configuration.

## Overview

By injecting the service account JSON and folder ID at build time, you create a pre-configured plugin that users can install and use immediately - no OAuth, no settings, no configuration needed!

## Prerequisites

1. **Service Account JSON key file** (downloaded from Google Cloud Console)
2. **Google Drive Folder ID** (from the shared folder URL)
3. **Backend service** (for JWT signing) OR **Pre-generated access token**

## Step 1: Get Service Account JSON

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable **Google Drive API**
4. Go to **IAM & Admin** → **Service Accounts**
5. Click **Create Service Account**
6. Name it (e.g., `figma-html-export`)
7. Grant role: **Editor** (or custom role with Drive API access)
8. Click **Keys** tab → **Add Key** → **Create new key**
9. Choose **JSON** format
10. Download the file (e.g., `service-account-key.json`)

## Step 2: Share Google Drive Folder

1. Open the JSON file and find `client_email`:
   ```json
   "client_email": "figma-html-export@your-project.iam.gserviceaccount.com"
   ```
2. Open your Google Drive folder
3. Click **Share**
4. Add the service account email (from step 1) as **Editor**
5. Copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```

## Step 3: Choose Authentication Method

You have 2 options for authentication:

### Option A: Backend Service (Recommended for Production)

Create a simple backend that handles JWT signing:

```javascript
// Example: Express.js endpoint
app.post('/api/google-drive/token', async (req, res) => {
  const { serviceAccount, scope } = req.body;
  
  // Sign JWT with service account private key
  const jwt = require('jsonwebtoken');
  const now = Math.floor(Date.now() / 1000);
  
  const token = jwt.sign(
    {
      iss: serviceAccount.client_email,
      scope: scope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    },
    serviceAccount.private_key,
    { algorithm: 'RS256' }
  );
  
  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    })
  });
  
  const data = await response.json();
  res.json({ accessToken: data.access_token });
});
```

Deploy this backend and note the URL (e.g., `https://your-backend.com/api`)

### Option B: Pre-Generated Access Token (Simpler, but Less Secure)

1. Use [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Configure it:
   - Click gear icon → Check "Use your own OAuth credentials"
   - Enter your OAuth Client ID and Secret
3. Select scope: `https://www.googleapis.com/auth/drive.file`
4. Click "Authorize APIs" → Sign in
5. Click "Exchange authorization code for tokens"
6. Copy the **Access token** (long-lived tokens can last weeks/months)
7. Store this token securely - you'll inject it at build time

## Step 4: Build Plugin with Configuration

### Method 1: Environment Variables (Recommended for CI/CD)

```bash
# Read service account JSON file content
export GOOGLE_SERVICE_ACCOUNT_JSON=$(cat service-account-key.json)

# Set folder ID
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id-here'

# Set backend URL (if using Option A)
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'

# OR set pre-generated token (if using Option B)
# Note: This would require modifying the code to inject token directly
# Better to use backend service

# Build the plugin
node build.js
```

### Method 2: Config File (Recommended for Local Development)

1. Create `config/service-account.json`:
   ```bash
   cp service-account-key.json config/service-account.json
   ```
   (This file is gitignored - won't be committed)

2. Set environment variables:
   ```bash
   export GOOGLE_DRIVE_FOLDER_ID='your-folder-id-here'
   export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'
   ```

3. Build:
   ```bash
   node build.js
   ```

The build script will:
- ✅ Read service account JSON from config file or env var
- ✅ Inject it as a constant in the plugin code
- ✅ Inject folder ID
- ✅ Inject backend URL (if provided)

## Step 5: Distribute Plugin

The built plugin in `figma-plugin/` or `dist/plugin/` is now **pre-configured**:

- ✅ Service account key is embedded (injected at build time)
- ✅ Folder ID is embedded
- ✅ Backend URL is embedded (if provided)
- ✅ Users can install and use immediately - **no configuration needed!**

## What Users See

Users who install your pre-configured plugin will:

1. **Open plugin** → See "Google Drive: Connected" (if backend is working)
2. **Select presentation** → Choose existing or create new
3. **Select wall** → wall1 or wall2
4. **Click Export** → Done!

**No OAuth, no settings, no configuration - it just works!**

## Security Notes

- ✅ **Service account JSON is injected at build time** - not in source code
- ✅ **Config file is gitignored** - never committed to repo
- ✅ **Environment variables** - secure for CI/CD pipelines
- ⚠️ **Built plugin contains service account key** - distribute securely (private distribution only)
- ⚠️ **Backend service** - Keep service account key secure on server, don't expose it

## Troubleshooting

### "Service account authentication failed"
- Verify service account email has access to Google Drive folder
- Check backend service is running and accessible
- Verify Drive API is enabled in Google Cloud project

### "Backend URL not configured"
- If using backend service, ensure `GOOGLE_AUTH_BACKEND_URL` is set at build time
- Or users can manually enter backend URL in Settings (but defeats purpose of one-time setup)

### "Folder ID not found"
- Verify folder ID is correct
- Ensure folder is shared with service account email
- Check folder ID was injected at build time (check build logs)

## Example Build Script

Create a `build-with-config.sh` script:

```bash
#!/bin/bash

# Load service account JSON
export GOOGLE_SERVICE_ACCOUNT_JSON=$(cat config/service-account.json)

# Set folder ID
export GOOGLE_DRIVE_FOLDER_ID='1ABC123xyz...'

# Set backend URL
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'

# Build
node build.js

echo "✅ Plugin built with pre-configured service account!"
echo "📦 Distribute figma-plugin/ folder to users"
```

Then run:
```bash
chmod +x build-with-config.sh
./build-with-config.sh
```
