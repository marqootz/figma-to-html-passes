# Service Account Setup Guide (Option 3: Environment Variable)

This guide explains how to set up Google Drive integration using a **Service Account** with environment variable configuration. This is an **advanced option** for managed deployments where an admin configures once at build time.

**⚠️ Important:** Service accounts require JWT signing, which needs a backend service or pre-generated token. For most users, **OAuth is simpler** (see [QUICK_START.md](./QUICK_START.md)).

## Overview

The service account JSON key is injected at **build time** via environment variables, so no user interaction is needed after deployment. The plugin uses this key to authenticate with Google Drive API automatically.

## Prerequisites

1. **Google Cloud Project** with Drive API enabled
2. **Service Account** created in Google Cloud Console
3. **Service Account JSON Key** file downloaded
4. **Google Drive Folder** shared with service account email

## Setup Steps

### 1. Create Service Account in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Click **Create Service Account**
4. Fill in details:
   - Name: `figma-to-html-plugin`
   - Description: `Service account for Figma HTML export plugin`
5. Click **Create and Continue**
6. Grant role: **Editor** (or custom role with Drive API access)
7. Click **Done**

### 2. Create Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create** - key file downloads automatically
6. **Important**: Save this file securely - you cannot download it again!

### 3. Share Google Drive Folder with Service Account

1. Get the service account email from the JSON file: `"client_email": "xxx@xxx.iam.gserviceaccount.com"`
2. Open your Google Drive folder
3. Click **Share** button
4. Add the service account email as **Editor**
5. Click **Send**

### 4. Configure Plugin at Build Time

**Option A: Environment Variable (Recommended for CI/CD)**

```bash
# Set environment variables before building
export GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...",...}'
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id-here'

# Build the plugin
node build.js
```

**Option B: Config File (For Local Development)**

1. Create `config/service-account.json` (gitignored):
```bash
cp service-account-key.json config/service-account.json
```

2. Set folder ID in environment variable or Settings:
```bash
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id-here'
```

3. Build:
```bash
node build.js
```

**Option C: Manual Configuration in Plugin Settings**

1. Build plugin normally (without env vars)
2. Open plugin in Figma
3. Click **Settings** button
4. Paste service account JSON content in "Service Account JSON" field
5. Enter Google Drive Folder ID
6. Click **Save Settings**

## Service Account JSON Format

The JSON file should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## JWT Signing (Required for Service Accounts)

Service accounts require JWT (JSON Web Token) signing to get access tokens. This requires cryptographic libraries that Figma plugins don't have.

**Solution Options:**

### Option 1: Backend Service (Recommended)

Create a simple backend service that:
1. Receives service account key (or has it pre-configured)
2. Creates JWT signed with private key
3. Exchanges JWT for access token
4. Returns access token to plugin

**Configure Backend URL:**
- Build time: `export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'`
- Or in Settings: Paste backend URL

### Option 2: Pre-Generated Access Token

Generate a long-lived access token manually and store it in Settings → Access Token field. This bypasses JWT signing but tokens expire.

### Option 3: Domain-Wide Delegation (Enterprise)

If using Google Workspace, configure domain-wide delegation. Allows service account to impersonate users without JWT signing.

## Build Process

The build script automatically:
1. Reads `GOOGLE_SERVICE_ACCOUNT_JSON` environment variable
2. Or reads `config/service-account.json` file
3. Injects service account key as a constant in the plugin code
4. Injects `GOOGLE_DRIVE_FOLDER_ID` if provided

## Security Notes

- ✅ **Service account JSON is injected at build time** - not in source code
- ✅ **Config file is gitignored** - never committed
- ✅ **Environment variables** - secure for CI/CD pipelines
- ✅ **clientStorage** - encrypted by Figma (for manual configuration)

## Usage After Setup

Once configured:
1. Plugin automatically authenticates using service account
2. No user login required
3. Works company-wide (one service account for all users)
4. Export to Showroom works immediately

## Troubleshooting

### "Service account authentication failed"
- Verify service account JSON is valid
- Check service account email has access to Google Drive folder
- Verify Drive API is enabled in Google Cloud project

### "JWT signing requires backend service"
- Set up backend service for JWT signing (Option 1)
- Or use pre-generated access token (Option 2)
- Or use OAuth flow instead (configure in Settings)

### "Folder ID not found"
- Verify folder ID is correct from Google Drive URL
- Ensure folder is shared with service account email
- Check folder ID is set (env var or Settings)
