# Google Drive Integration Setup Guide

This guide explains how to set up the Google Drive integration for the Figma to HTML plugin.

## Overview

The plugin can export HTML files directly to a shared Google Drive folder, automatically organizing them into the correct directory structure for the uxync-gdf-showroom system.

**Recommended Method: OAuth 2.0** (Simplest, no backend required)  
**Alternative: Service Account** (For managed deployments, requires backend for JWT signing)

## Prerequisites

1. **Google Cloud Project** with Drive API enabled
2. **OAuth 2.0 Credentials** (Client ID) - **Recommended**
3. **Google Drive Folder** for shared presentations
4. (Optional) **Backend Server** (Only needed for service account JWT signing)

## Setup Steps

### 1. Google Cloud Project Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Drive API**
4. Create **OAuth 2.0 Credentials**:
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Add authorized redirect URIs (your backend server URL)
   - Save the Client ID (you'll need this)

### 2. Google Drive Folder Setup

1. Create or select a Google Drive folder for presentations
2. Share it with the service account or users who will use the plugin
3. Get the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID
   ```
4. The folder ID is the long string after `/folders/`

### 3. Configure Plugin

The plugin needs two pieces of configuration:

#### A. Google Drive Folder ID (Required)

**Option 1: Via Settings (Recommended)**
1. Open plugin in Figma
2. Click **Settings** button
3. Enter folder ID in "Google Drive Folder ID" field
4. Click **Save Settings**

**Option 2: Build Time Environment Variable**
```bash
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id-here'
node build.js
```

**Option 3: In Code (Not Recommended)**
```javascript
// In plugin initialization
await figma.clientStorage.setAsync('googleDriveFolderId', 'YOUR_FOLDER_ID_HERE');
```

#### B. Authentication Method

**Method 1: OAuth 2.0 (Recommended - Simplest)**

1. **Configure OAuth Client ID:**
   - Open plugin → Click **Settings**
   - Paste OAuth Client ID in "OAuth Client ID" field
   - Click **Save Settings**

2. **Connect to Google Drive:**
   - Click **Connect to Google Drive** button
   - Authorize in browser popup
   - Copy `access_token` from redirect URL (after `#access_token=`)
   - Paste token in Settings → Access Token field
   - Click **Save Settings**

3. **Done!** Plugin is now connected via OAuth.

**Method 2: Service Account (Advanced - Managed Deployments)**

For company-wide deployments where admin configures once:

1. Create service account in Google Cloud Console
2. Download JSON key file
3. Configure at build time:
   ```bash
   export GOOGLE_SERVICE_ACCOUNT_JSON='<json-content>'
   export GOOGLE_DRIVE_FOLDER_ID='folder-id'
   export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'  # Required for JWT signing
   node build.js
   ```
4. Share Google Drive folder with service account email
5. Set up backend service for JWT signing (see SERVICE_ACCOUNT_SETUP.md)

**Method 3: Manual Token Entry (Testing Only)**

1. Get access token from [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Paste in Settings → Access Token field
3. Click **Save Settings**

### 4. Directory Structure

The plugin automatically creates this structure:

```
Google Drive Root/
└── presentations/
    └── {presentation-name}/
        ├── wall1/
        │   ├── wall1.html
        │   ├── rules/
        │   │   └── rules.json
        │   ├── img/
        │   ├── video/
        │   └── lottie/
        └── wall2/
            ├── wall2.html
            ├── rules/
            │   └── rules.json
            ├── img/
            ├── video/
            └── lottie/
```

## Usage

1. **Connect to Google Drive**: Click "Connect to Google Drive" button
2. **Select Presentation**: Choose existing or create new
3. **Select Wall**: Choose wall1 or wall2
4. **Export**: Click "Export to Showroom"

## Features

- ✅ Auto-sanitizes presentation names (e.g., "My Presentation" → "my-presentation")
- ✅ Checks for name conflicts and suggests alternatives
- ✅ Creates directory structure automatically
- ✅ Standardized file naming: `wall1.html`, `wall2.html`
- ✅ Uploads HTML and rules.json files
- ✅ Creates media directories (img/, video/, lottie/)

## Troubleshooting

### "Google Drive not connected"
- Ensure OAuth flow is properly implemented
- Check that access token is stored in clientStorage
- Verify token hasn't expired

### "Folder ID not configured"
- Set `googleDriveFolderId` in clientStorage
- Verify folder ID is correct from Google Drive URL

### "Failed to upload file"
- Check Google Drive API permissions
- Verify access token has write permissions
- Ensure folder is shared with the authenticated user

### "Presentation name conflict"
- Plugin will suggest alternative name (e.g., "my-presentation-2")
- User can accept suggestion or cancel and edit name

## Security Notes

- **Never commit OAuth client secrets to code**
- Use backend server for token exchange
- Store tokens securely in clientStorage (encrypted by Figma)
- Use minimal OAuth scopes: `https://www.googleapis.com/auth/drive.file`

## API Scopes Required

- `https://www.googleapis.com/auth/drive.file` - Create and edit files in user's Drive

## Next Steps

1. Implement OAuth flow (backend server or popup)
2. Configure folder ID
3. Test with a sample export
4. Deploy to team
