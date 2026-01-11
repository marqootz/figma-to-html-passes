# Backend Deployment Guide

## Overview

**You only need ONE backend server for your entire organization/team.**

- ✅ **Admin/DevOps**: Deploy the backend once to a shared server
- ✅ **All Users**: Use the same backend URL (configured at plugin build time)
- ❌ **Users do NOT need to run their own backend server**

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Admin/DevOps (One-time setup)                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  1. Deploy backend server                          │  │
│  │  2. Configure Google OAuth redirect URI           │  │
│  │  3. Build plugin with backend URL                  │  │
│  │  4. Distribute plugin to users                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Shared Backend Server (One instance)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  https://your-backend.com                          │  │
│  │  - Handles OAuth for ALL users                     │  │
│  │  - Stores temporary sessions                        │  │
│  │  - Exchanges tokens                                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  All Users (No setup needed)                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  User 1: Install plugin → Click "Connect" ✅     │  │
│  │  User 2: Install plugin → Click "Connect" ✅     │  │
│  │  User 3: Install plugin → Click "Connect" ✅     │  │
│  │  ...                                                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Step-by-Step Deployment

### Step 1: Deploy Backend Server (Admin/DevOps)

Deploy the backend server to a hosting service. Options:

- **Heroku** (free tier available)
- **Railway** (easy deployment)
- **Render** (free tier available)
- **AWS/Google Cloud/Azure** (for enterprise)
- **Your own server** (if you have infrastructure)

See `backend/README.md` for deployment instructions for each platform.

### Step 2: Configure Google OAuth (Admin/DevOps)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add your production backend URL:
   ```
   https://your-backend.com/api/google-drive/oauth/callback
   ```
5. Click **Save**

### Step 3: Build Plugin with Backend URL (Admin/DevOps)

Build the plugin ONCE with the backend URL configured:

```bash
export GOOGLE_AUTH_BACKEND_URL='https://your-backend.com'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'
node build.js
```

This creates a plugin that:
- ✅ Has backend URL pre-configured
- ✅ Has Client ID pre-configured
- ✅ Users don't need to configure anything

### Step 4: Distribute Plugin (Admin/DevOps)

Distribute the built plugin to all users:
- Share the `figma-plugin/` folder
- Or publish to Figma Community (if public)
- Or distribute via internal file sharing

### Step 5: Users Install and Use (No Setup!)

Users just:
1. Install the plugin
2. Click "Connect to Google Drive"
3. Authorize in browser
4. Done! ✅

**No backend setup, no configuration, no technical knowledge needed.**

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
cd backend
railway link

# Set environment variables
railway variables set GOOGLE_CLIENT_ID=your-client-id
railway variables set GOOGLE_CLIENT_SECRET=your-client-secret
railway variables set PORT=3000

# Deploy
railway up
```

Railway will give you a URL like `https://your-app.railway.app`

### Option 2: Render

1. Go to [Render](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repo (or deploy from local)
4. Set environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `PORT=3000`
5. Deploy

### Option 3: Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
cd backend
heroku create your-app-name

# Set environment variables
heroku config:set GOOGLE_CLIENT_ID=your-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret

# Deploy
git push heroku main
```

### Option 4: Your Own Server

```bash
# SSH into your server
ssh user@your-server.com

# Clone repo
git clone your-repo
cd your-repo/backend

# Install dependencies
npm install

# Set environment variables
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export PORT=3000

# Run with PM2 (or systemd)
npm install -g pm2
pm2 start server.js --name figma-oauth-backend
pm2 save
pm2 startup
```

## Security Considerations

### Environment Variables

**Never commit sensitive data:**
- ✅ Use environment variables
- ✅ Use `.env` file (gitignored)
- ✅ Use hosting platform's secret management
- ❌ Never commit `.env` files
- ❌ Never hardcode secrets in code

### HTTPS Required

**Production backend MUST use HTTPS:**
- ✅ Use HTTPS for production backend
- ✅ Google OAuth requires HTTPS for redirect URIs
- ❌ Don't use HTTP in production

### CORS

The backend already has CORS enabled for Figma plugins. If you need to restrict it:

```javascript
// In server.js, modify CORS settings:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.figma.com');
  // ... rest of CORS config
});
```

## Testing

### Test Backend Locally

1. Start backend: `node backend/server.js`
2. Test health: `curl http://localhost:3000/health`
3. Test OAuth initiation: See `backend/README.md`

### Test in Production

1. Deploy backend
2. Build plugin with production backend URL
3. Install plugin in Figma
4. Click "Connect to Google Drive"
5. Verify browser opens and authorization works

## Troubleshooting

### "Session not found or expired"
- Backend server might be down
- Check backend logs
- Verify backend URL is correct in plugin build

### "clientId required"
- Verify `GOOGLE_CLIENT_ID` is set in backend environment
- Or verify plugin build includes `GOOGLE_CLIENT_ID`

### "Failed to exchange authorization code"
- Check backend logs for detailed error
- Verify `GOOGLE_CLIENT_SECRET` is set correctly
- Verify redirect URI matches exactly in Google Cloud Console

### Browser doesn't open
- Check console logs in Figma (F12)
- Verify `GOOGLE_AUTH_BACKEND_URL` is set in plugin build
- Verify backend server is running and accessible

## Cost Considerations

### Free Tier Options

- **Railway**: Free tier with limits
- **Render**: Free tier available
- **Heroku**: Free tier discontinued, but low-cost options available

### Self-Hosted

If you have your own infrastructure, the backend is very lightweight:
- Minimal CPU usage
- Minimal memory (in-memory token storage)
- No database required (for basic setup)

For production with many users, consider:
- Redis for token storage (instead of in-memory)
- Database for session management
- Load balancing for high traffic

## Summary

✅ **One backend server** for entire organization  
✅ **Deploy once** by admin/DevOps  
✅ **Build plugin once** with backend URL  
✅ **Users just install and use** - no setup needed  
❌ **Users do NOT run their own backend**
