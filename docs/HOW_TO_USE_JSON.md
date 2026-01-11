# How to Use Service Account JSON - One-Time Admin Setup

This guide shows you exactly how to use the service account JSON so that **users don't need to configure anything** - you set it up once, and it works for everyone!

## Quick Answer

**Yes!** Using the JSON at build time means:
- ✅ **You configure once** (as admin)
- ✅ **Users configure nothing** (just install and use)
- ✅ **No OAuth needed** (if you set up backend for JWT signing)
- ✅ **No Settings needed** (everything is pre-configured)

## Step-by-Step

### 1. Get Your Service Account JSON File

1. Download it from Google Cloud Console (see [SERVICE_ACCOUNT_SETUP.md](./SERVICE_ACCOUNT_SETUP.md))
2. Save it somewhere safe (e.g., `~/Downloads/service-account-key.json`)

### 2. Copy JSON to Config Folder

```bash
# Create config folder (if it doesn't exist)
mkdir -p config

# Copy your JSON file
cp ~/Downloads/service-account-key.json config/service-account.json
```

**Important:** The `config/` folder is gitignored, so your JSON won't be committed to the repo.

### 3. Get Your Google Drive Folder ID

1. Open your Google Drive folder in browser
2. Copy the ID from the URL:
   ```
   https://drive.google.com/drive/folders/1ABC123xyz789...
                                    ^^^^^^^^^^^^^^^^^^^^
                                    This is your folder ID
   ```

### 4. Build with Configuration

**Option A: Use the Build Script (Easiest)**

```bash
# Set folder ID
export GOOGLE_DRIVE_FOLDER_ID='1ABC123xyz789...'

# Optional: Set backend URL (if you have one for JWT signing)
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'

# Run the build script
./build-with-service-account.sh
```

**Option B: Manual Build**

```bash
# Read JSON file and set as environment variable
export GOOGLE_SERVICE_ACCOUNT_JSON=$(cat config/service-account.json)

# Set folder ID
export GOOGLE_DRIVE_FOLDER_ID='1ABC123xyz789...'

# Optional: Backend URL
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'

# Build
node build.js
```

### 5. What Happens During Build

The build script will:
1. ✅ Read `config/service-account.json` (or from `GOOGLE_SERVICE_ACCOUNT_JSON` env var)
2. ✅ Read `GOOGLE_DRIVE_FOLDER_ID` from environment
3. ✅ Read `GOOGLE_AUTH_BACKEND_URL` (if set)
4. ✅ **Inject all of these into the plugin code** as constants
5. ✅ Create a pre-configured plugin in `figma-plugin/` folder

### 6. Distribute the Plugin

The built plugin in `figma-plugin/` is now **fully pre-configured**:
- Service account JSON is embedded
- Folder ID is embedded  
- Backend URL is embedded (if provided)

**Users just install it and use it - no configuration needed!**

## What Users Experience

When users install your pre-configured plugin:

1. **Open plugin** → Sees "Google Drive: Connected" ✅
2. **Select presentation** → Dropdown shows existing presentations
3. **Select wall** → Choose wall1 or wall2
4. **Click Export** → HTML uploads to Google Drive automatically!

**No OAuth, no Settings, no configuration - it just works!**

## Important: JWT Signing Requirement

Service accounts need JWT (JSON Web Token) signing to get access tokens. You have 2 options:

### Option 1: Backend Service (Recommended)

Create a simple backend that handles JWT signing:

```javascript
// Example endpoint: POST /api/google-drive/token
// Receives: { serviceAccount: {...}, scope: "..." }
// Returns: { accessToken: "..." }
```

Then set:
```bash
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com/api'
```

### Option 2: Pre-Generated Token

1. Generate a long-lived access token using Google OAuth Playground
2. Store it in the plugin (requires code modification)
3. Works until token expires (then regenerate)

**Note:** If you don't set up backend or pre-generated token, users will need to use OAuth as fallback (defeats the purpose of one-time setup).

## Example: Complete Setup

```bash
# 1. Copy service account JSON
cp ~/Downloads/my-service-account.json config/service-account.json

# 2. Set folder ID
export GOOGLE_DRIVE_FOLDER_ID='1ABC123xyz789...'

# 3. Set backend URL (if you have one)
export GOOGLE_AUTH_BACKEND_URL='https://api.mycompany.com/google-drive/token'

# 4. Build
./build-with-service-account.sh

# 5. Distribute figma-plugin/ folder to users
```

## Security Notes

- ✅ **JSON is NOT in source code** - it's injected at build time
- ✅ **Config folder is gitignored** - won't be committed
- ⚠️ **Built plugin contains JSON** - distribute securely (private distribution only)
- ⚠️ **Backend service** - Keep JSON secure on server, don't expose it

## Troubleshooting

**"Service account authentication failed"**
- Verify service account email has access to Google Drive folder
- Check backend service is running (if using one)
- Verify Drive API is enabled

**"Users still need to configure"**
- Check build logs to confirm JSON was injected
- Verify folder ID was set correctly
- Ensure backend URL is set (if using service account)

**"How do I know if it worked?"**
- Check build output - should say "Service account key will be injected"
- Open built plugin code and search for `SERVICE_ACCOUNT_KEY` - should see the JSON

## Summary

**Yes, using the JSON at build time means:**
- ✅ You configure once (admin)
- ✅ Users configure nothing (just use)
- ✅ Pre-configured plugin works immediately
- ✅ No OAuth needed (if backend is set up)

The JSON gets embedded in the plugin code during build, so users don't need to do anything!
