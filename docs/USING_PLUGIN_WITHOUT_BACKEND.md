# Using the Plugin Without Backend

**Yes, you can absolutely continue using the plugin without deploying a backend!** 

The plugin has built-in fallback mechanisms that work perfectly fine for individual use or small teams.

## How It Works Without Backend

When the backend is **not configured** (no `GOOGLE_AUTH_BACKEND_URL` set at build time), the plugin automatically falls back to manual OAuth methods:

1. ✅ **Plugin detects no backend** - Shows manual token entry option
2. ✅ **User gets token** using one of the methods below
3. ✅ **User pastes token** in Settings → Access Token
4. ✅ **Plugin works normally** - Can export to Google Drive

## Option 1: Using gcloud CLI (Quickest if already installed)

**If you already have Google Cloud SDK installed**, this is the fastest method!

### Step 1: Install Google Cloud SDK (if needed)

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux/Windows:**
- Download from: https://cloud.google.com/sdk/docs/install

### Step 2: Authenticate

```bash
# Authenticate with your Google account
gcloud auth application-default login

# This will:
# - Open a browser for Google sign-in
# - Ask you to authorize
# - Save credentials locally
```

### Step 3: Get Access Token

```bash
# Get access token with Drive scope
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
```

**Important:** Use the full `drive` scope (not `drive.file` or `drive.readonly`). The full `drive` scope is required for listing children of shared folders.

### Step 4: Use Token in Plugin

1. **Copy the token** from terminal output (it's a long string like `ya29.a0AfH6...`)
2. **Open plugin in Figma** → Click **Settings**
3. **Paste token** in "Access Token" field
4. **Click "Save Settings"**
5. **Click "Connect to Google Drive"** → Should show "Connected!" ✅

### Refreshing Token

When the token expires (~1 hour), just run the command again:
```bash
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
```

The token will be automatically refreshed if your credentials are still valid.

---

## Option 2: Using oauth2l (Recommended if no gcloud)

The easiest way without a backend is using Google's `oauth2l` command-line tool.

### Step 1: Install oauth2l

**macOS:**
```bash
brew install oauth2l
```

**Linux/Windows:**
```bash
# Requires Python 3.10+ (Python 3.9 deprecated January 2026)
pip install oauth2l
```

### Step 2: Create OAuth Credentials File

Create a file `oauth-credentials.json`:
```json
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
```

**Get your Client ID and Secret:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Create OAuth 2.0 Client ID (Desktop app type)
4. Copy Client ID and Client Secret

### Step 3: Configure Google OAuth Redirect URI

1. In Google Cloud Console, click on your OAuth Client ID
2. Under **Authorized redirect URIs**, add:
   ```
   http://localhost
   ```
3. Click **Save**

### Step 4: Get Token

```bash
oauth2l fetch --credentials=oauth-credentials.json \
  --scope=https://www.googleapis.com/auth/drive \
  --output_format=bare
```

This will:
- Open a browser for Google authorization
- Ask you to sign in and authorize
- Display the access token in the terminal

### Step 5: Use Token in Plugin

1. **Copy the token** from terminal output
2. **Open plugin in Figma** → Click **Settings**
3. **Paste token** in "Access Token" field
4. **Click "Save Settings"**
5. **Click "Connect to Google Drive"** → Should show "Connected!" ✅

---

## Option 3: Using OAuth Playground

Google OAuth Playground provides a web interface for getting tokens.

### Step 1: Go to OAuth Playground

Visit: https://developers.google.com/oauthplayground/

### Step 2: Configure Your Credentials

1. Click **gear icon** (⚙️) in top right
2. Check **"Use your own OAuth credentials"**
3. Enter your **Client ID** and **Client Secret**
4. Click **Close**

### Step 3: Get Token

1. In left panel, scroll to **"Drive API v3"**
2. Select scope: `https://www.googleapis.com/auth/drive`
   - **Important:** Use full `drive` scope (not `drive.file` or `drive.readonly`)
   - Full `drive` scope is required for listing children of shared folders
3. Click **"Authorize APIs"**
4. Sign in with Google and authorize
5. Click **"Exchange authorization code for tokens"**
6. **Copy the Access token** from the right panel

### Step 4: Use Token in Plugin

1. **Open plugin in Figma** → Click **Settings**
2. **Paste token** in "Access Token" field
3. **Click "Save Settings"**
4. **Click "Connect to Google Drive"** → Should show "Connected!" ✅

---

## Option 4: Manual OAuth Flow (Advanced)

If you have OAuth credentials configured in the plugin Settings:

### Step 1: Configure OAuth Client ID in Plugin

1. Get OAuth Client ID from Google Cloud Console
2. Open plugin → **Settings**
3. Enter **OAuth Client ID** → Click **Save**

### Step 2: Click "Connect to Google Drive"

1. Plugin will generate an OAuth URL
2. Browser opens for Google sign-in
3. Authorize the plugin

### Step 3: Extract Token from Redirect URL

After authorization, Google redirects to a URL like:
```
http://localhost:8080/#access_token=ya29.a0AfH6...&token_type=Bearer&expires_in=3600
```

**Extract the token:**
- Find `access_token=` in the URL
- Copy everything after `=` until the next `&`
- That's your access token!

### Step 4: Paste Token in Settings

1. **Open plugin** → **Settings**
2. **Paste token** in "Access Token" field
3. **Click "Save Settings"**
4. **Click "Connect to Google Drive"** again → Should show "Connected!" ✅

---

## What Works Without Backend

✅ **All plugin functionality works:**
- Export HTML to Google Drive
- Create folders
- Upload files
- List folder contents
- All Google Drive API operations

✅ **Token storage:**
- Tokens are stored securely in Figma `clientStorage`
- Tokens persist across plugin sessions
- You don't need to re-enter token unless it expires

✅ **Token refresh:**
- If you have a refresh token, plugin can automatically refresh expired tokens
- Otherwise, just get a new token when it expires (typically 1 hour)

---

## When Do You Need Backend?

**You only need backend if:**
- ❌ You want **zero-configuration** for users (they just click "Connect")
- ❌ You have **many users** (100+) and want centralized token management
- ❌ You want **automatic token refresh** without user interaction
- ❌ You want to avoid users needing OAuth credentials or CLI tools

**You don't need backend if:**
- ✅ You're using the plugin **personally** or with a **small team**
- ✅ Users can **install oauth2l** or use **OAuth Playground**
- ✅ Users are **comfortable** with getting tokens manually
- ✅ You want **simplicity** (no backend to deploy/maintain)

---

## Token Expiration

**OAuth access tokens expire** after ~1 hour. When your token expires:

1. **Get a new token** using one of the methods above
2. **Paste in Settings** → Access Token field
3. **Save** and continue using the plugin

**Tip:** If you use `oauth2l` with a refresh token, you can get a new access token anytime:
```bash
oauth2l fetch --credentials=oauth-credentials.json \
  --scope=https://www.googleapis.com/auth/drive \
  --output_format=bare
```

---

## Comparing With and Without Backend

| Feature | Without Backend | With Backend |
|---------|----------------|--------------|
| **Setup Complexity** | Medium (need OAuth credentials) | High (need to deploy backend) |
| **User Experience** | Manual token entry | One-click connect |
| **Maintenance** | Low (just get tokens) | Medium (backup backend) |
| **Scalability** | Good for small teams | Better for large teams |
| **Cost** | Free | May have hosting costs |
| **Zero-Config** | ❌ No | ✅ Yes |

---

## Recommendation

**Use without backend if:**
- You're a single user or small team (<10 people)
- You're comfortable with command-line tools
- You want to avoid deployment complexity

**Use with backend if:**
- You have many users (10+)
- You want zero-configuration experience
- You're comfortable deploying/maintaining a backend service

---

## Troubleshooting

### "Token expired"
- Just get a new token using oauth2l or OAuth Playground
- Paste in Settings → Access Token
- Save and continue

### "Access denied" or "Insufficient permissions"
- Make sure you're using full `drive` scope (not `drive.file` or `drive.readonly`)
- Full scope is: `https://www.googleapis.com/auth/drive`

### "Can't connect to Google Drive"
- Verify token is correct (no extra spaces)
- Check token hasn't expired (get a new one)
- Verify Google Drive API is enabled in Google Cloud Console

### "oauth2l not found"
- Install oauth2l: `brew install oauth2l` (macOS) or `pip install oauth2l` (Linux/Windows, requires Python 3.10+)
- Or use OAuth Playground instead (web-based, no installation needed)

---

## Summary

✅ **Yes, you can use the plugin without a backend!**

The plugin has full fallback support for manual token entry. You just need to:
1. Get an OAuth access token (using oauth2l, OAuth Playground, or manual flow)
2. Paste it in plugin Settings → Access Token
3. Save and use!

The backend is **optional** and only provides a more seamless user experience for teams. For individual use or small teams, the manual methods work perfectly fine!

---

**See also:**
- `docs/OAUTH_ALTERNATIVES.md` - More detailed OAuth alternatives
- `docs/CONNECT_PLUGIN.md` - Quick connection guide
- `QUICK_DEPLOY.md` - If you want to set up backend later
