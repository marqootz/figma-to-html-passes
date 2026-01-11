# Next Steps Checklist

## 🎯 Goal: Get "Connect to Google Drive" Button Working

Follow these steps in order:

---

## Phase 1: Local Setup & Testing (Do This First)

### ✅ Step 1: Install Backend Dependencies

```bash
cd /Users/markmanfrey/LOCAL_DEV/figma-to-html-passes
npm install express googleapis
```

Or if you prefer to install in backend folder:
```bash
cd backend
npm install express googleapis
```

### ✅ Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Enable **Google Drive API**:
   - Go to **APIs & Services** → **Library**
   - Search "Google Drive API"
   - Click **Enable**
4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `Figma HTML Export Plugin`
   - **Authorized redirect URIs**: Add:
     ```
     http://localhost:3000/api/google-drive/oauth/callback
     ```
   - Click **Create**
   - **Copy the Client ID and Client Secret** (you'll need both)

### ✅ Step 3: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
PORT=3000
```

### ✅ Step 4: Start Backend Server (Local Testing)

```bash
node backend/server.js
```

You should see:
```
🚀 Backend server running on http://localhost:3000
```

**Keep this terminal open** - the server needs to be running.

### ✅ Step 5: Test Backend Health

Open a new terminal and test:
```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok",...}`

### ✅ Step 6: Build Plugin with Backend URL (Local)

In a new terminal (keep backend server running):
```bash
cd /Users/markmanfrey/LOCAL_DEV/figma-to-html-passes
export GOOGLE_AUTH_BACKEND_URL='http://localhost:3000'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
export GOOGLE_DRIVE_FOLDER_ID='1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq'
node build.js
```

### ✅ Step 7: Test in Figma (Local)

1. **Open Figma** and load the plugin from `figma-plugin/` folder
2. **Click "Connect to Google Drive"**
3. **Browser should open** with Google OAuth login
4. **Sign in and authorize**
5. **Plugin should automatically receive token** (check console logs)

**If this works:** ✅ Local setup is complete! Move to Phase 2.

**If it doesn't work:** Check:
- Backend server is running (`node backend/server.js`)
- Console logs in Figma (F12) for errors
- Backend terminal for errors
- Google OAuth redirect URI matches exactly

---

## Phase 2: Production Deployment (For All Users)

### ✅ Step 8: Deploy Backend to Production

Choose one:

**Option A: Railway (Easiest)**
```bash
npm i -g @railway/cli
cd backend
railway login
railway link
railway variables set GOOGLE_CLIENT_ID=your-client-id
railway variables set GOOGLE_CLIENT_SECRET=your-client-secret
railway variables set PORT=3000
railway up
```

**Option B: Render**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo or deploy from local
4. Set environment variables
5. Deploy

**Option C: Heroku**
```bash
heroku create your-app-name
cd backend
heroku config:set GOOGLE_CLIENT_ID=your-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret
git push heroku main
```

**Option D: Your Own Server**
- Deploy `backend/server.js` to your server
- Set environment variables
- Run with PM2 or systemd

### ✅ Step 9: Update Google OAuth Redirect URI (Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click your OAuth Client ID
4. Add production redirect URI:
   ```
   https://your-backend-domain.com/api/google-drive/oauth/callback
   ```
5. Click **Save**

### ✅ Step 10: Build Plugin with Production Backend URL

```bash
export GOOGLE_AUTH_BACKEND_URL='https://your-backend-domain.com'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
export GOOGLE_DRIVE_FOLDER_ID='1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq'
node build.js
```

### ✅ Step 11: Distribute Plugin

- Share `figma-plugin/` folder with users
- Or publish to Figma Community
- Or distribute via internal file sharing

### ✅ Step 12: Users Install & Use

Users just:
1. Install plugin
2. Click "Connect to Google Drive"
3. Authorize in browser
4. Done! ✅

---

## 📋 Quick Reference

### Current Status
- ✅ Backend server code created
- ✅ Documentation created
- ⏳ **Next:** Set up locally and test

### Files Created
- `backend/server.js` - Backend server
- `backend/README.md` - Setup instructions
- `backend/.env.example` - Environment template
- `docs/BACKEND_DEPLOYMENT.md` - Deployment guide

### Key URLs
- **Google Cloud Console**: https://console.cloud.google.com/
- **Backend Health Check**: http://localhost:3000/health (local)
- **Backend Health Check**: https://your-domain.com/health (production)

### Important Notes
- **One backend for all users** - deploy once, everyone uses it
- **Backend URL configured at build time** - users don't need to configure
- **Keep backend server running** - it needs to be accessible 24/7 for users

---

## 🐛 Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (needs >= 14)
- Check dependencies: `npm install` in backend folder
- Check port 3000 is available: `lsof -i :3000`

### "clientId required" error
- Check `.env` file has `GOOGLE_CLIENT_ID` set
- Check plugin build includes `GOOGLE_CLIENT_ID`

### Browser doesn't open
- Check console logs in Figma (F12)
- Verify `GOOGLE_AUTH_BACKEND_URL` is set in plugin build
- Verify backend server is running and accessible

### "Session not found" error
- Session expired (10 minute timeout)
- Try clicking "Connect" again
- Check backend server is running

### OAuth redirect error
- Verify redirect URI matches exactly in Google Cloud Console
- Check redirect URI includes `/api/google-drive/oauth/callback`
- For local: `http://localhost:3000/api/google-drive/oauth/callback`
- For production: `https://your-domain.com/api/google-drive/oauth/callback`

---

## 📚 Documentation

- **Backend Setup**: `backend/README.md`
- **Deployment Guide**: `docs/BACKEND_DEPLOYMENT.md`
- **Backend Service Guide**: `docs/BACKEND_SERVICE_GUIDE.md`
- **Universal Settings**: `docs/UNIVERSAL_SETTINGS_GUIDE.md`

---

## ✅ Success Criteria

You're done when:
- ✅ Backend server is deployed and running
- ✅ Plugin build includes backend URL
- ✅ Users can click "Connect to Google Drive"
- ✅ Browser opens for OAuth authorization
- ✅ Plugin automatically receives token
- ✅ Users can export to Google Drive

---

**Start with Phase 1 (Local Setup) to test everything works, then move to Phase 2 (Production Deployment).**
