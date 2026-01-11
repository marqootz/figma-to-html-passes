# Fix: OAuth Playground Redirect URI Mismatch

## The Problem

OAuth Playground uses a specific redirect URI that must be added to your OAuth client configuration.

## Solution: Add OAuth Playground Redirect URI

### Step 1: Get OAuth Playground Redirect URI

OAuth Playground uses:
```
https://developers.google.com/oauthplayground
```

### Step 2: Add to Your OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `uxync-drive-integration`
3. Go to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Add:
   ```
   https://developers.google.com/oauthplayground
   ```
7. Click **Save**

### Step 3: Use OAuth Playground

Now you can use OAuth Playground normally:

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon ⚙️ → Check **"Use your own OAuth credentials"**
3. Enter:
   - **OAuth Client ID**: (your client ID)
   - **OAuth Client Secret**: (from Google Cloud Console)
4. Click **Close**
5. In left panel, find **Drive API v3** → Check `https://www.googleapis.com/auth/drive.file`
6. Click **Authorize APIs** → Sign in → Allow
7. Click **Exchange authorization code for tokens**
8. Copy the **Access token**
9. Paste in plugin Settings → Access Token → Save

## Alternative: Create New OAuth Client for Playground

If you want to keep your existing client separate:

1. In Google Cloud Console → Credentials
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Figma Plugin - OAuth Playground`
5. Authorized redirect URIs: `https://developers.google.com/oauthplayground`
6. Click **Create**
7. Use this new Client ID and Secret in OAuth Playground

## Alternative: Manual Token Generation (No Playground)

If you don't want to configure redirect URIs at all:

### Option 1: Use gcloud CLI

```bash
# Install Google Cloud SDK if needed
# Then authenticate
gcloud auth application-default login

# Get access token
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive.file
```

### Option 2: Use curl with service account

Since you have a service account, you could create a simple script to get tokens, but this requires JWT signing (needs backend).

### Option 3: Use Postman or similar

Postman has OAuth 2.0 support and can use custom redirect URIs.

## Quick Fix Summary

**Easiest solution:**
1. Add `https://developers.google.com/oauthplayground` to your OAuth client's authorized redirect URIs
2. Use OAuth Playground normally
3. Get token and paste in plugin

**No redirect URI needed:**
- Use gcloud CLI (if you have it installed)
- Or set up a backend service for OAuth flow
