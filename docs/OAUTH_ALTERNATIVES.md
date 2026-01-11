# OAuth Token Alternatives (No OAuth Playground)

This guide provides alternatives to using OAuth Playground for getting Google Drive access tokens.

---

## Option 1: Command-Line Tool (oauth2l) - **Recommended**

The easiest way to get tokens without OAuth Playground is using Google's `oauth2l` command-line tool.

### Installation

**macOS:**
```bash
brew install oauth2l
```

**Linux/Windows:**
```bash
pip install oauth2l
```

### Usage

1. **Create a credentials JSON file** (if you don't have one):
   ```bash
   cat > oauth-credentials.json << 'EOF'
   {
     "installed": {
       "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
       "client_secret": "YOUR_CLIENT_SECRET",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://oauth2.googleapis.com/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "redirect_uris": ["http://localhost"]
     }
   }
   EOF
   ```
   
   Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with your actual values.

2. **Configure redirect URI in Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID
   - Under "Authorized redirect URIs", add: `http://localhost`
   - Click "Save"
   
   **Important:** The OOB redirect URI (`urn:ietf:wg:oauth:2.0:oob`) was deprecated in October 2022. You must use `http://localhost` instead.

3. **Run oauth2l** (it will open a browser for authorization):
   ```bash
   oauth2l fetch --credentials=oauth-credentials.json \
     --scope=https://www.googleapis.com/auth/drive \
     --output_format=bare
   ```
   
   **Important:** Use the full `drive` scope (not `drive.readonly`). The `drive.readonly` scope cannot query children of shared folders using the `parents` field, even though it can access the folder directly. The full `drive` scope is required to list folder contents in shared folders.

4. **Follow the prompts:**
   - oauth2l will automatically open a browser window (or show you a URL to visit)
   - Sign in and authorize the app
   - After authorization, oauth2l will automatically capture the redirect (it runs a local server on localhost)
   - The token will be displayed in the terminal

5. **Copy the output token** and paste it into the plugin Settings → Access Token field.

**Note:** The token will be cached in `~/.oauth2l`. To refresh an expired token, use:
   ```bash
   oauth2l fetch --credentials=oauth-credentials.json \
     --scope=https://www.googleapis.com/auth/drive \
     --output_format=bare \
     --refresh
   ```

### Getting Client Credentials

If you don't have client credentials yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Desktop app** as application type
6. Download the JSON file (or copy Client ID and Secret)

---

## Option 2: Backend Service

If you have a backend service, you can extend it to handle OAuth token generation.

### Backend Endpoint

Your backend should provide an endpoint like:
```
POST /api/google-drive/oauth-token
```

**Request:**
```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "scope": "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file"
}
```

**Response:**
```json
{
  "accessToken": "ya29.a0AfH6...",
  "refreshToken": "1//0g...",
  "expiresIn": 3600
}
```

### Implementation Example (Node.js)

```javascript
const express = require('express');
const { google } = require('googleapis');

app.post('/api/google-drive/oauth-token', async (req, res) => {
  const { clientId, clientSecret, scope } = req.body;
  
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:8080' // redirect URI
  );
  
  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scope || 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
    prompt: 'consent'
  });
  
  // Return auth URL for user to visit
  res.json({ authUrl });
  
  // After user authorizes, exchange code for tokens
  // (This requires a callback endpoint - see full example below)
});
```

### Using Backend in Plugin

1. Configure the backend URL in plugin Settings → Advanced → Backend URL
2. Click "Connect to Google Drive" - it will use your backend
3. The backend handles the OAuth flow and returns tokens

---

## Option 3: Improved Manual Flow

The plugin already has a manual OAuth flow. Here's how to use it:

### Setup

1. **Get OAuth Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth credentials (Desktop app type)
   - Copy the Client ID

2. **Configure in Plugin:**
   - Open plugin Settings
   - Paste Client ID in "OAuth Client ID" field
   - Save

3. **Connect:**
   - Click "Connect to Google Drive" button
   - Browser opens with Google sign-in
   - After authorizing, Google redirects to `http://localhost:8080`
   - The redirect will fail (expected), but the URL contains the token

### Extracting Token from URL

After authorization, the redirect URL looks like:
```
http://localhost:8080/#access_token=ya29.a0AfH6...&token_type=Bearer&expires_in=3600&scope=...
```

**Copy the token:**
- Find `access_token=` in the URL
- Copy everything after `=` until the next `&`
- Paste into Settings → Access Token

### Making it Easier

You can run a simple local server to catch the redirect:

```bash
# Python 3
python3 -m http.server 8080

# Or Node.js
npx http-server -p 8080
```

Then when Google redirects, you'll see the token in the browser or server logs.

---

## Option 4: Service Account (For Organizations)

If you're setting this up for a team/organization, use a Service Account:

1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Share the Google Drive folder with the service account email
4. Configure the service account JSON in plugin Settings → Advanced

**Note:** Service accounts require build-time configuration or a backend for JWT signing (Figma plugins can't sign JWTs directly).

---

## Token Refresh

OAuth access tokens expire after ~1 hour. For automatic refresh:

1. **Use refresh tokens** (requires `access_type=offline` and `prompt=consent`)
2. **Backend service** can handle refresh automatically
3. **Manual refresh** - get a new token when expired (plugin will warn you)

---

## Troubleshooting

### "Token expired" error
- Get a new token using any method above
- Tokens expire after 1 hour

### "Invalid credentials" error
- Verify your Client ID is correct
- Make sure you're using the right token (not refresh token)

### "Insufficient permissions" error
- Token needs full `drive` scope (not just `drive.readonly`)
- `drive.readonly` can access files directly but cannot query children of shared folders
- For shared folders/folders in shared drives, you must use full `drive` scope

### "Cannot access folder" / "No presentations found" error
- Verify folder ID is correct
- Check that the Google account has access to the folder
- **If folder is accessible but children aren't listed:** This is a known limitation - `drive.readonly` scope cannot query children of shared folders using `'X in parents'` queries, even though the folder itself is accessible. **Solution:** Get a new token with full `drive` scope instead of `drive.readonly`

---

## Quick Reference

| Method | Difficulty | Best For |
|--------|-----------|----------|
| oauth2l CLI | ⭐ Easy | Individual users, developers |
| Backend Service | ⭐⭐ Medium | Teams, automated workflows |
| Manual Flow | ⭐⭐ Medium | One-time setup |
| Service Account | ⭐⭐⭐ Advanced | Organizations, production |
