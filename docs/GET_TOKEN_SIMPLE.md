# Get Google Drive Token - Simple Method (No gcloud Issues)

If `gcloud` is giving you scope errors, use one of these simpler methods instead.

## Option 1: OAuth Playground (Easiest - No Installation)

**This is the simplest method - just use a web browser!**

### Step 1: Go to OAuth Playground

Visit: https://developers.google.com/oauthplayground/

### Step 2: Configure Your Credentials

1. Click **gear icon** (⚙️) in top right
2. Check **"Use your own OAuth credentials"**
3. Enter your:
   - **OAuth Client ID** (from Google Cloud Console)
   - **OAuth Client Secret** (from Google Cloud Console)
4. Click **Close**

**Don't have credentials?** Get them:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- **APIs & Services** → **Credentials**
- Click **Create Credentials** → **OAuth client ID**
- Choose **Web application**
- Copy Client ID and Secret

### Step 3: Add OAuth Playground Redirect URI

**First time only - add redirect URI to your OAuth client:**

1. In Google Cloud Console → **Credentials**
2. Click your **OAuth 2.0 Client ID**
3. Under **Authorized redirect URIs**, add:
   ```
   https://developers.google.com/oauthplayground
   ```
4. Click **Save**

### Step 4: Get Token

1. In OAuth Playground left panel, scroll to **"Drive API v3"**
2. Select scope: `https://www.googleapis.com/auth/drive`
   - **Important:** Use full `drive` scope (not `drive.file` or `drive.readonly`)
3. Click **"Authorize APIs"**
4. Sign in with Google and authorize
5. Click **"Exchange authorization code for tokens"**
6. **Copy the Access token** from the right panel

### Step 5: Use in Plugin

1. **Open plugin in Figma** → Click **Settings**
2. **Paste token** in "Access Token" field
3. **Click "Save Settings"**
4. **Click "Connect to Google Drive"** → Should show "Connected!" ✅

**Done!** No command-line tools, no scope issues, just works.

---

## Option 2: oauth2l (If You Have Python)

**Slightly more setup, but reliable.**

### Step 1: Install oauth2l

**macOS:**
```bash
brew install oauth2l
```

**Or via pip (requires Python 3.10+):**
```bash
pip3 install oauth2l
```

### Step 2: Create Credentials File

Create `oauth-credentials.json`:
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

**Get credentials from:** Google Cloud Console → APIs & Services → Credentials

### Step 3: Configure Redirect URI

1. In Google Cloud Console → **Credentials**
2. Click your **OAuth Client ID**
3. Under **Authorized redirect URIs**, add:
   ```
   http://localhost
   ```
4. Click **Save**

### Step 4: Get Token

```bash
oauth2l fetch --credentials=oauth-credentials.json \
  --scope=https://www.googleapis.com/auth/drive \
  --output_format=bare
```

This will:
- Open browser for authorization
- Ask you to sign in
- Display the token in terminal

### Step 5: Use in Plugin

1. **Copy token** from terminal
2. **Paste in plugin Settings** → Access Token
3. **Save** and connect

---

## Why These Work Better Than gcloud

✅ **OAuth Playground:**
- No installation needed
- Web-based, visual interface
- No scope errors
- Works immediately

✅ **oauth2l:**
- Simple installation
- Designed for getting OAuth tokens
- Fewer scope issues than gcloud
- Reliable

❌ **gcloud:**
- Requires specific scope combinations
- Can have scope refresh issues
- More complex setup
- Designed for GCP, not just OAuth tokens

---

## Recommendation

**Use OAuth Playground** - it's the easiest and most reliable method. No command-line issues, no scope problems, just works.

**Only use oauth2l** if you prefer command-line tools or need to automate token generation.

---

## Token Expiration

**OAuth tokens expire after ~1 hour.** When your token expires:

- **OAuth Playground:** Just get a new token (takes 30 seconds)
- **oauth2l:** Run the command again (takes 10 seconds)

**Tip:** Get a new token right before using the plugin if you haven't used it in a while.

---

## Troubleshooting

### "Invalid scope" in OAuth Playground
- Make sure you selected `https://www.googleapis.com/auth/drive` (full scope)
- Not `drive.file` or `drive.readonly`

### "Redirect URI mismatch"
- Make sure you added `https://developers.google.com/oauthplayground` to your OAuth client's authorized redirect URIs

### "oauth2l: command not found"
- Install with `brew install oauth2l` (macOS)
- Or `pip3 install oauth2l` (requires Python 3.10+)

---

**See also:**
- `docs/CONNECT_PLUGIN.md` - Quick connection guide
- `docs/OAUTH_ALTERNATIVES.md` - More detailed alternatives
- `docs/USING_PLUGIN_WITHOUT_BACKEND.md` - Complete guide
