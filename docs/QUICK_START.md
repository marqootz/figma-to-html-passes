# Quick Start Guide - Google Drive Integration

Get started with exporting HTML to Google Drive in 3 simple steps using OAuth (recommended method).

## Step 1: Get OAuth Client ID (One-time setup)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable **Google Drive API**:
   - Go to "APIs & Services" → "Library"
   - Search "Google Drive API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `Figma HTML Export Plugin`
   - Authorized redirect URIs: `https://www.figma.com`
   - Click "Create"
   - Copy the **Client ID** (you'll need this)

## Step 2: Get Google Drive Folder ID

1. Open your Google Drive folder in browser
2. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
   The folder ID is the long string after `/folders/`

## Step 3: Configure Plugin

1. **Open plugin in Figma**
2. **Click "Settings" button**
3. **Enter OAuth Client ID:**
   - Paste the Client ID from Step 1
   - Click **Save Settings**
4. **Enter Google Drive Folder ID:**
   - Paste the folder ID from Step 2
   - Click **Save Settings**
5. **Click "Connect to Google Drive"**
   - Browser opens for authorization
   - Sign in with Google account
   - Authorize access
   - After redirect, copy `access_token` from URL (part after `#access_token=`)
   - Paste token in Settings → "Access Token" field
   - Click **Save Settings**

## Done! 🎉

Plugin is now connected. You can:
- Select an existing presentation or create new one
- Choose wall (wall1 or wall2)
- Click **Export to Showroom**

---

## Alternative: Managed Deployment (Service Account)

For company-wide deployments where admin configures once at build time:

```bash
# Set environment variables
export GOOGLE_SERVICE_ACCOUNT_JSON='<paste-json-content>'
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'  # Required for JWT signing

# Build plugin
node build.js
```

Then distribute the built plugin. Users don't need to configure anything!

**Note:** Service account requires a backend service for JWT signing. If you don't have a backend, use OAuth instead (simpler, no backend needed).

See [SERVICE_ACCOUNT_SETUP.md](./SERVICE_ACCOUNT_SETUP.md) for detailed service account setup.
