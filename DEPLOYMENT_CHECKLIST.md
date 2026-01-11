# Deployment Checklist: Backend for Multi-User Google Drive

Use this checklist to deploy the backend and enable Google Drive connection for all users.

## Pre-Deployment

- [ ] **Backend code reviewed** - `backend/server.js` is ready
- [ ] **Dependencies installed** - Run `cd backend && npm install`
- [ ] **Google OAuth credentials obtained** - Client ID and Client Secret from Google Cloud Console
- [ ] **Google Cloud project selected** - Project where OAuth credentials are created

## Step 1: Choose Deployment Platform

Choose one platform:

- [ ] **Railway** (Recommended - Easiest)
- [ ] **Render** (Free tier available)
- [ ] **Heroku** (Paid, mature platform)
- [ ] **Self-hosted** (Your own infrastructure)

## Step 2: Deploy Backend

### Option A: Railway (Recommended)

- [ ] Install Railway CLI: `npm i -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Link project: `cd backend && railway link`
- [ ] Set environment variables:
  - [ ] `railway variables set GOOGLE_CLIENT_ID=your-client-id`
  - [ ] `railway variables set GOOGLE_CLIENT_SECRET=your-client-secret`
  - [ ] `railway variables set PORT=3000`
- [ ] Deploy: `railway up`
- [ ] **Copy backend URL** from Railway dashboard (e.g., `https://your-app.railway.app`)

### Option B: Render

- [ ] Go to https://render.com and sign up/login
- [ ] Create new **Web Service**
- [ ] Connect GitHub repository (or deploy from CLI)
- [ ] Configure:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Set environment variables in dashboard:
  - [ ] `GOOGLE_CLIENT_ID=your-client-id`
  - [ ] `GOOGLE_CLIENT_SECRET=your-client-secret`
  - [ ] `PORT=3000`
- [ ] Deploy and wait for build to complete
- [ ] **Copy backend URL** from Render dashboard (e.g., `https://your-app.onrender.com`)

### Option C: Heroku

- [ ] Install Heroku CLI
- [ ] Login: `heroku login`
- [ ] Create app: `cd backend && heroku create your-app-name`
- [ ] Set environment variables:
  - [ ] `heroku config:set GOOGLE_CLIENT_ID=your-client-id`
  - [ ] `heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret`
- [ ] Deploy: `git push heroku main`
- [ ] **Copy backend URL**: `heroku info` (e.g., `https://your-app.herokuapp.com`)

### Option D: Self-Hosted

- [ ] Set up server (VPS, AWS, GCP, Azure, etc.)
- [ ] Install Node.js (>=14.0.0)
- [ ] Copy `backend/` folder to server
- [ ] Install dependencies: `npm install`
- [ ] Create `.env` file with credentials
- [ ] Set up process manager (PM2, systemd, etc.)
- [ ] Configure HTTPS (Let's Encrypt)
- [ ] **Note your backend URL** (e.g., `https://your-domain.com`)

## Step 3: Verify Backend Deployment

- [ ] **Test health endpoint**: `curl https://your-backend.com/health`
  - Should return: `{"status":"ok","timestamp":"...","activeSessions":0}`
- [ ] **Backend is accessible** - No 404 errors
- [ ] **Backend is using HTTPS** - Required for Google OAuth

## Step 4: Configure Google OAuth Redirect URI

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Navigate to **APIs & Services** → **Credentials**
- [ ] Click on your **OAuth 2.0 Client ID**
- [ ] Under **Authorized redirect URIs**, add:
  ```
  https://your-backend.com/api/google-drive/oauth/callback
  ```
  (Replace `your-backend.com` with your actual backend URL)
- [ ] Click **Save**
- [ ] **Wait 5-10 minutes** for changes to propagate

## Step 5: Build Plugin with Backend URL

- [ ] Open terminal in project root
- [ ] Set environment variables:
  ```bash
  export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com'
  export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
  export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'  # Optional but recommended
  ```
- [ ] Build plugin: `node build.js`
- [ ] **Verify build succeeded** - Check `dist/plugin/code.js` exists
- [ ] **Verify backend URL in code** - Search for your backend URL in generated code

## Step 6: Test Deployment (Local Testing)

- [ ] Load plugin in Figma (Development → Import plugin from manifest)
- [ ] Click **"Connect to Google Drive"** button
- [ ] Browser should open with Google OAuth login
- [ ] Authorize the plugin
- [ ] Plugin should automatically detect and store token
- [ ] See **"✅ Connected to Google Drive!"** message

## Step 7: Distribute Plugin

- [ ] **Share built plugin** with users:
  - Option A: Share `figma-plugin/` folder
  - Option B: Publish to Figma Community (if public)
  - Option C: Distribute via internal file sharing
- [ ] **Provide installation instructions** to users:
  1. Open Figma
  2. Plugins → Development → Import plugin from manifest
  3. Select `manifest.json` from `figma-plugin/` folder
  4. Click **"Connect to Google Drive"**
  5. Authorize in browser
  6. Done! ✅

## Step 8: Verify User Experience

Have a test user verify:
- [ ] Plugin installs successfully
- [ ] **"Connect to Google Drive"** button appears
- [ ] Clicking button opens browser
- [ ] Google OAuth authorization works
- [ ] Plugin automatically receives token
- [ ] **"✅ Connected to Google Drive!"** appears
- [ ] Can export HTML to Google Drive

## Troubleshooting

If users have issues:

- [ ] **"Backend unreachable"** - Check backend is running and accessible
- [ ] **"CORS error"** - Backend CORS is enabled (already configured)
- [ ] **"OAuth redirect error"** - Verify redirect URI matches exactly in Google Cloud Console
- [ ] **"Session expired"** - User took too long (>10 minutes), try again
- [ ] **"Token not received"** - Check backend logs for errors

## Monitoring

Set up monitoring for:
- [ ] Backend health (`/health` endpoint)
- [ ] Error logs (backend errors)
- [ ] OAuth flow success rate
- [ ] Session expiration tracking

## Security Checklist

- [ ] **Backend uses HTTPS** (not HTTP)
- [ ] **Client secret** stored securely (never in code or git)
- [ ] **Environment variables** set on hosting platform (not committed)
- [ ] **CORS** configured (already done, but verify)
- [ ] **Session expiration** enabled (10 minutes - already configured)

## Done! ✅

After completing all steps:
- ✅ Backend is deployed and accessible
- ✅ Google OAuth is configured
- ✅ Plugin is built with backend URL
- ✅ Users can connect without any setup

---

## Quick Reference

### Backend URL Format
```
https://your-backend.com
```

### Redirect URI Format
```
https://your-backend.com/api/google-drive/oauth/callback
```

### Build Command
```bash
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'
node build.js
```

### Test Health Endpoint
```bash
curl https://your-backend.com/health
```

---

**For detailed instructions, see:**
- `docs/BACKEND_DEPLOYMENT.md` - Full deployment guide
- `backend/README.md` - Backend setup instructions
- `docs/BACKEND_STATUS_ASSESSMENT.md` - Technical assessment
