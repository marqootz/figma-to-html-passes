# Universal Settings Configuration Guide

This guide explains how to configure universal settings at build time so users don't need access to Settings.

## Overview

Universal settings (same for all users) can be configured via environment variables at build time. Users only need access to **Folder ID** in Settings (in case it changes).

## Build-Time Configuration

### Environment Variables

Set these environment variables before running `node build.js`:

```bash
# OAuth Client ID (universal - same for all users)
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'

# Backend URL (universal - same for all users)
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'

# Service Account JSON (universal - for managed deployments)
export GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Google Drive Folder ID (can be overridden by users in Settings)
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id-here'
```

### Build Command

```bash
# Set environment variables and build
export GOOGLE_CLIENT_ID='your-client-id'
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'
node build.js
```

Or use a `.env` file with a build script:

```bash
# .env file
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_AUTH_BACKEND_URL=https://your-backend.com/api
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

```bash
# build-with-env.sh
#!/bin/bash
set -a
source .env
set +a
node build.js
```

## What Users See

### When Universal Settings Are Configured

**Settings Panel Shows:**
- ✅ **Folder ID** field (users can override if folder changes)
- ✅ **Access Token** field (for manual fallback only)
- ℹ️ **Notice**: "Pre-configured Settings: OAuth Client ID, Backend URL, Service Account"
- ❌ **Hidden**: OAuth Client ID field (configured at build time)
- ❌ **Hidden**: Backend URL field (configured at build time)
- ❌ **Hidden**: Service Account section (configured at build time)

### When Universal Settings Are NOT Configured

**Settings Panel Shows:**
- ✅ All fields visible
- ✅ Users can configure everything manually

## Priority Order

### Folder ID
1. **User Settings** (clientStorage) - highest priority (users can override)
2. Build-time config (GOOGLE_DRIVE_FOLDER_ID) - fallback

### OAuth Client ID
1. **Build-time config** (GOOGLE_CLIENT_ID) - highest priority
2. User Settings (clientStorage) - fallback

### Backend URL
1. **Build-time config** (GOOGLE_AUTH_BACKEND_URL) - highest priority
2. User Settings (clientStorage) - fallback

### Service Account
1. **Build-time config** (GOOGLE_SERVICE_ACCOUNT_JSON) - highest priority
2. User Settings (clientStorage) - fallback

## Recommended Setup

### For Organizations (Managed Deployment)

```bash
# .env (kept secure, not committed)
GOOGLE_CLIENT_ID=your-org-client-id.apps.googleusercontent.com
GOOGLE_AUTH_BACKEND_URL=https://your-org-backend.com/api
GOOGLE_DRIVE_FOLDER_ID=your-shared-folder-id
# Service account optional - only if not using OAuth backend
```

**Result:**
- Users only see Folder ID in Settings (can override if needed)
- All other settings are pre-configured
- Users just click "Connect" and authorize

### For Individual Users

```bash
# No .env file - users configure via Settings
# Or minimal .env with just folder ID
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

**Result:**
- Users see all Settings fields
- Users configure OAuth Client ID, Backend URL, etc. manually

## Example: Complete Setup

```bash
# 1. Create .env file
cat > .env << 'EOF'
GOOGLE_CLIENT_ID=1071952475950-8u22rr33n7p02idu07u8dqfj9bg1rvpi.apps.googleusercontent.com
GOOGLE_AUTH_BACKEND_URL=https://your-backend.com/api
GOOGLE_DRIVE_FOLDER_ID=1niY69DtVtp8t7TRY_1Nr1llpKHKBy3F2
EOF

# 2. Build with environment variables
set -a
source .env
set +a
node build.js

# 3. Distribute plugin
# Users install plugin → Only need to click "Connect" → Done!
```

## Security Notes

- ✅ **Never commit `.env` file** to git
- ✅ **Add `.env` to `.gitignore`**
- ✅ **Client Secret**: Should be stored on backend, not in plugin
- ✅ **Service Account JSON**: Keep secure, only in build environment
- ✅ **Folder ID**: Can be public (it's just a folder identifier)

## User Experience

### With Universal Settings Configured

1. User opens plugin
2. Sees: "Google Drive: Not connected"
3. Clicks "Connect to Google Drive"
4. Browser opens → User authorizes
5. Plugin automatically detects token
6. Done! ✅

**No Settings needed!**

### If Folder ID Changes

1. User opens Settings
2. Sees Folder ID field (only field visible)
3. Updates Folder ID
4. Saves
5. Clicks Refresh on presentations dropdown

**Only one field to manage!**

## Troubleshooting

### "Settings are pre-configured but not working"

- Check build logs for injected values
- Verify environment variables were set before build
- Check that `.env` file was sourced correctly

### "Users can't override Folder ID"

- Folder ID priority: User Settings > Build-time
- Users can always override in Settings
- Build-time value is just a default

### "Backend URL not working"

- Verify `GOOGLE_AUTH_BACKEND_URL` was set at build time
- Check backend is accessible
- Verify backend endpoints match expected format (see BACKEND_SERVICE_GUIDE.md)