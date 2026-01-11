# Get Google Drive Token Using gcloud CLI

**Quick guide for getting OAuth access tokens using Google Cloud SDK's `gcloud` CLI.**

## Prerequisites

- Google Cloud SDK installed (`gcloud` command available)
- Google account with access to Google Drive

## Quick Start (2 Steps)

### Step 1: Authenticate

```bash
# Authenticate with required scopes (gcloud requires cloud-platform scope)
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive
```

This will:
- Open your browser
- Ask you to sign in with Google
- Request authorization for both cloud-platform and drive access
- Save credentials locally (~/.config/gcloud/)

**Important:** Include both `cloud-platform` and `drive` scopes when authenticating. The `cloud-platform` scope is required by gcloud, and `drive` scope is needed for Google Drive API access.

**Note:** If you see an error about invalid scope, you may need to authenticate first with:
```bash
gcloud auth login
```

Then use `application-default login` for tokens.

### Step 2: Get Token

```bash
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
```

**Important:** Use the full `drive` scope (not `drive.file` or `drive.readonly`). The full `drive` scope is required for listing children of shared folders.

The command will output a long token string like:
```
ya29.a0AfH6cBxyz123...
```

## Use Token in Plugin

1. **Copy the token** from terminal output
2. **Open plugin in Figma** → Click **Settings**
3. **Paste token** in "Access Token" field
4. **Click "Save Settings"**
5. **Click "Connect to Google Drive"** → Should show "Connected!" ✅

## Install Google Cloud SDK

**If you don't have `gcloud` installed:**

### macOS
```bash
# Install Google Cloud SDK
brew install google-cloud-sdk

# After installation, initialize gcloud (first time only)
gcloud init
```

### Linux
```bash
# Download and install from:
# https://cloud.google.com/sdk/docs/install
```

### Windows
```bash
# Download installer from:
# https://cloud.google.com/sdk/docs/install
```

## Token Expiration

**OAuth access tokens expire after ~1 hour.** When your token expires:

1. **Run the command again:**
   ```bash
   gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
   ```

2. **Copy the new token** and paste in plugin Settings → Access Token

3. **Save** and continue using the plugin

**Note:** As long as your `gcloud` credentials are valid, the token will be automatically refreshed.

## Using Different Google Accounts

If you need to authenticate with a different Google account:

```bash
# List current accounts
gcloud auth list

# Authenticate with different account
gcloud auth application-default login --account=your-email@example.com

# Or revoke and re-authenticate
gcloud auth application-default revoke
gcloud auth application-default login
```

## Troubleshooting

### "gcloud: command not found"
- Install Google Cloud SDK (see Install section above)

### "Application Default Credentials not found"
- Run `gcloud auth application-default login` first
- Make sure you completed the browser authentication

### "Access denied" or "Insufficient permissions"
- Make sure you're using full `drive` scope: `https://www.googleapis.com/auth/drive`
- Check that Google Drive API is enabled in your Google Cloud project

### "Token expired"
- Just run `gcloud auth print-access-token` again to get a new token
- No need to re-authenticate unless credentials were revoked

## Scope Options

**Recommended (full access):**
```bash
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
```

**Note:** The full `drive` scope is required for:
- Listing children of shared folders
- Full folder access
- All Google Drive operations

**Limited scopes (may not work for all features):**
```bash
# Read-only access (may not list folder children)
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive.readonly

# File-level access only (limited functionality)
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive.file
```

## Comparison with Other Methods

| Method | Speed | Setup | Refresh |
|--------|-------|-------|---------|
| **gcloud CLI** | ⚡⚡⚡ Fastest (if installed) | ✅ Simple | ✅ Auto |
| oauth2l | ⚡⚡ Fast | ✅ Simple | ✅ Auto |
| OAuth Playground | ⚡ Medium | ✅ Web-based | ❌ Manual |
| Manual OAuth | ⚡ Slow | ⚠️ Complex | ❌ Manual |

## Advantages of gcloud CLI

✅ **Fastest method** (if you already have gcloud installed)  
✅ **Automatic token refresh** (no need to re-authenticate)  
✅ **No OAuth credentials needed** (uses your Google account)  
✅ **No browser interaction** (after initial auth)  
✅ **Works offline** (cached credentials)

## Disadvantages

❌ Requires Google Cloud SDK installation  
❌ Requires Google account (not service account tokens)  
❌ Tokens expire after ~1 hour (but easy to refresh)

---

**See also:**
- `docs/USING_PLUGIN_WITHOUT_BACKEND.md` - Complete guide for using plugin without backend
- `docs/OAUTH_ALTERNATIVES.md` - Other token methods
- `docs/CONNECT_PLUGIN.md` - Quick connection guide
