# User Guide: Building and Distributing (Developers / Admins)

This guide is for **developers and team admins** who set up Google OAuth, build the desktop app and Figma plugin, and distribute them to end users.

**End users** (non-developers) should use [User Guide: End User](USER_GUIDE_END_USER.md) — they only run the app, load the plugin, and connect to Google Drive.

---

## Overview

You will:

1. Create a **Desktop app** OAuth client in Google Cloud (PKCE-only; only Client ID, no client secret).
2. **Build the desktop app** with the Client ID pre-filled so users don’t have to edit `.env`.
3. **Build the Figma plugin** with the backend URL (and optionally folder ID / client ID).
4. **Distribute** the built app and plugin folder to your team.

---

## 1. Google OAuth setup (PKCE-only: only Client ID)

1. In [Google Cloud Console](https://console.cloud.google.com/): create or select a project, enable the **Google Drive API**.
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → Application type **Desktop app** (PKCE-only; no client secret).
3. Add **Authorized redirect URI:**  
   `http://localhost:3000/api/google-drive/oauth/callback`
4. Note the **Client ID**. You will pre-fill it when building the app (or share it with users if they need to paste it into `.env`). No client secret.

---

## 2. Building and distributing the desktop app

1. Install backend deps:
   ```bash
   cd backend && npm install && cd ..
   ```

2. **Pre-fill the Client ID** so end users don’t have to edit `.env`:
   ```bash
   cd electron-app
   npm install
   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com npm run build:mac
   ```
   Use `npm run build:win` for Windows, or `npm run build:all` for both. The prebuild step injects the Client ID into `backend/.env` before packaging.

3. Distribute the built app from `electron-app/dist/` (e.g. .dmg on Mac, installer on Windows). Point users to the [End User Guide](USER_GUIDE_END_USER.md) — they run the app and start at Step 2 (load the plugin).

---

## 3. Building and distributing the Figma plugin

1. From project root:
   ```bash
   export GOOGLE_AUTH_BACKEND_URL='http://localhost:3000'
   # Optional: pre-fill for your team
   # export GOOGLE_DRIVE_FOLDER_ID='...'
   # export GOOGLE_CLIENT_ID='...'
   node build.js
   ```

2. Give users the **`figma-plugin/`** folder (or **`dist/plugin/`**) and tell them to use **Import plugin from manifest** in Figma and select its `manifest.json`. See the [End User Guide](USER_GUIDE_END_USER.md) Step 2.

---

## 4. Health check (optional)

Users (or you) can confirm the backend is running by opening **http://localhost:3000/health** in a browser; it should show `{"status":"ok",...}`.

---

## Development (run without packaging)

- **Backend only:** `cd backend && node server.js`
- **Desktop app (dev):** `cd electron-app && npm install && npm start` — backend runs in-process; set `GOOGLE_CLIENT_ID` in `backend/.env`.
- **Plugin build:** `export GOOGLE_AUTH_BACKEND_URL='http://localhost:3000' && node build.js` — output in `figma-plugin/` and `dist/plugin/`.

See also `electron-app/README.md` and `backend/README.md`.
