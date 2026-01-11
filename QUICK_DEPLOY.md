# Quick Deploy Guide: Backend for Multi-User Google Drive

**Time: ~15 minutes** | **Difficulty: Easy**

This guide will get your backend deployed and ready for all users to connect to Google Drive.

## Prerequisites

- Google Cloud Console account
- OAuth 2.0 Client ID and Secret (see below if you don't have these)
- Deployment platform account (Railway, Render, or Heroku)

## Step 1: Get Google OAuth Credentials (5 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: `Figma Plugin OAuth Backend`
7. **Authorized redirect URIs**: Leave empty for now (we'll add this after deployment)
8. Click **Create**
9. **Copy Client ID and Client Secret** - Save these securely!

## Step 2: Deploy Backend (5 min)

### Option A: Railway (Recommended - Easiest)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway link
railway up

# Set environment variables
railway variables set GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
railway variables set GOOGLE_CLIENT_SECRET=your-client-secret
railway variables set PORT=3000

# Get your backend URL
railway domain
```

**Copy your backend URL** (e.g., `https://your-app.railway.app`)

### Option B: Render (Free Tier)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository (or deploy via CLI)
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Set environment variables:
   - `GOOGLE_CLIENT_ID` = your client ID
   - `GOOGLE_CLIENT_SECRET` = your client secret
   - `PORT` = `3000`
6. Click **Create Web Service**
7. **Copy your backend URL** (e.g., `https://your-app.onrender.com`)

### Option C: Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create app
cd backend
heroku create your-app-name

# Set environment variables
heroku config:set GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret

# Deploy
git push heroku main

# Get URL
heroku info
```

**Copy your backend URL** (e.g., `https://your-app.herokuapp.com`)

## Step 3: Configure Google OAuth Redirect URI (2 min)

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click on your **OAuth 2.0 Client ID**
4. Under **Authorized redirect URIs**, click **Add URI**
5. Add:
   ```
   https://your-backend.com/api/google-drive/oauth/callback
   ```
   (Replace `your-backend.com` with your actual backend URL)
6. Click **Save**
7. **Wait 5-10 minutes** for changes to propagate

## Step 4: Verify Backend (1 min)

```bash
# Test health endpoint
curl https://your-backend.com/health

# Should return:
# {"status":"ok","timestamp":"...","activeSessions":0}
```

If you see this, your backend is working! ✅

## Step 5: Build Plugin with Backend URL (2 min)

```bash
# From project root
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'  # Optional but recommended
node build.js
```

This creates a plugin with the backend URL pre-configured!

## Step 6: Test It! (Optional)

1. Load plugin in Figma (Development → Import plugin from manifest)
2. Click **"Connect to Google Drive"**
3. Browser opens → Authorize
4. Plugin automatically connects! ✅

## Step 7: Distribute Plugin

Share the `figma-plugin/` folder with users:
- Users install plugin
- Users click "Connect to Google Drive"
- Browser opens → Authorize
- **Done!** No configuration needed

## Troubleshooting

### "Backend unreachable"
- Check backend is deployed and running
- Verify backend URL is correct (use HTTPS, not HTTP)
- Test: `curl https://your-backend.com/health`

### "OAuth redirect error"
- Verify redirect URI matches exactly in Google Cloud Console
- Format: `https://your-backend.com/api/google-drive/oauth/callback`
- Wait 5-10 minutes after adding redirect URI

### "Client ID not found"
- Verify `GOOGLE_CLIENT_ID` is set in backend environment variables
- Or verify plugin was built with `GOOGLE_CLIENT_ID` env var

## Next Steps

- See `DEPLOYMENT_CHECKLIST.md` for detailed checklist
- See `docs/BACKEND_DEPLOYMENT.md` for full deployment guide
- See `docs/BACKEND_STATUS_ASSESSMENT.md` for technical details

---

**That's it!** Your backend is now ready for all users to connect to Google Drive with zero configuration! 🎉
