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

## Build with values (pre-fill for distribution)

Set these **environment variables** when building so the distributed app and plugin have values built in and users don’t need to edit `.env` or plugin Settings.

### Desktop app (one-time setup)

From project root, install backend deps, then build the app with your Client ID (and optional secret):

```bash
cd backend && npm install && cd ..
cd electron-app
npm install
```

**macOS:**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com npm run build:mac
```

**Windows:**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com npm run build:win
```

**Optional** (only if using a Web application OAuth client that needs a secret):
```bash
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... npm run build:mac
```

The prebuild script writes `GOOGLE_CLIENT_ID` (and optional `GOOGLE_CLIENT_SECRET`) into `backend/.env` before packaging, so the built app in `electron-app/dist/` has credentials pre-filled.

---

### Figma plugin (one-time setup)

From **project root**, run `npm run build`. The build **automatically loads** `backend/.env` (if present), so you don't need to export variables manually. Put any of these in `backend/.env` to have them built into the plugin:

| Env var | Purpose |
|--------|--------|
| `GOOGLE_AUTH_BACKEND_URL` | Backend URL for “Connect to Google Drive” (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | OAuth Client ID (same as app) |
| `GOOGLE_DRIVE_FOLDER_ID` | Default Google Drive folder ID (presentations folder) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | *(Advanced)* JSON string of service account key; avoid for distribution |

**Example –** ensure `backend/.env` has (at least):

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_AUTH_BACKEND_URL=http://localhost:3000
GOOGLE_DRIVE_FOLDER_ID=your-presentations-folder-id-from-drive-url
```

Then from project root: `npm run build`. You'll see `📋 Loaded env from backend/.env for plugin build`; the plugin will have those values built in. You can still override by exporting vars before `npm run build`.

Output: `figma-plugin/code.js` and `dist/plugin/`. Distribute the **`figma-plugin/`** folder (or `dist/plugin/`) and have users import its `manifest.json` in Figma.

---

## 4. Health check (optional)

Users (or you) can confirm the backend is running by opening **http://localhost:3000/health** in a browser; it should show `{"status":"ok",...}`.

---

## Development (run without packaging)

- **Backend only:** `cd backend && node server.js`
- **Desktop app (dev):** `cd electron-app && npm install && npm start` — backend runs in-process; set `GOOGLE_CLIENT_ID` in `backend/.env`.
- **Plugin build:** `npm run build` (loads `backend/.env` automatically) — output in `figma-plugin/` and `dist/plugin/`.

See also `electron-app/README.md` and `backend/README.md`.
