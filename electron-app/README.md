# Figma to HTML – Desktop App

Self-contained **macOS** and **Windows** app (“Figma to HTML”) that runs the OAuth backend for the Figma plugin. No separate server to deploy; users run this app and the Figma plugin connects to `http://localhost:3000`.

**End users (non-developers):** See **[End User Guide](../docs/USER_GUIDE_END_USER.md)** for running the app and plugin. **Developers / admins:** See **[Developer Guide](../docs/USER_GUIDE_DEVELOPER.md)** for building and distributing.

## How it works

- **Electron** runs the backend (Express) **in-process** on port 3000.
- **System tray** shows “Backend: http://localhost:3000” and a Quit option.
- **No window** – tray only; the plugin talks to localhost.

## Prerequisites

- Node.js 18+
- **Backend dependencies** must be installed before building the desktop app:
  ```bash
  cd backend && npm install && cd ..
  ```

## Development (run without packaging)

1. Install Electron app deps and run:
   ```bash
   cd electron-app
   npm install
   npm start
   ```
2. Backend runs at `http://localhost:3000` (same as running `node backend/server.js`).
3. Configure `backend/.env` with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (see `backend/.env.example`).
4. Build the Figma plugin with:
   ```bash
   export GOOGLE_AUTH_BACKEND_URL='http://localhost:3000'
   export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'
   node build.js
   ```
5. In Figma: Connect to Google Drive – it will use the desktop app’s backend.

## Building distributable apps

1. **Install backend dependencies** (required for packaging):
   ```bash
   cd backend && npm install && cd ..
   ```

2. **Build** (from `electron-app/`). To **pre-fill the Client ID** so end users don’t have to edit `.env`:
   ```bash
   cd electron-app
   npm install
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com npm run build:mac
   ```
   (Use `build:win` or `build:all` as needed.) The prebuild step injects the Client ID into `backend/.env` before packaging.

3. Output:
   - **macOS**: `npm run build:mac` builds for the current arch (arm64 on Apple Silicon). For Intel: `npm run build:mac:x64`. For both: `npm run build:mac:both`. For a single universal .app: `npm run build:mac:universal`. Outputs in `electron-app/dist/mac` (and `dist/mac-arm64` when building both).
   - **Windows**: `electron-app/dist/Figma to HTML Setup 1.0.0.exe` (and portable)

## First run (packaged app)

- If you **pre-filled** the Client ID when building (see above), users don’t need to edit anything; they just run the app.
- Otherwise: on first launch, the app copies `backend/.env.example` → `backend/.env` inside the app bundle (if `.env` doesn’t exist). The user then edits `.env` with `GOOGLE_CLIENT_ID`: tray icon → **Open backend folder (edit .env)** → edit `.env` → restart the app.

## Google OAuth setup

- In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add this **Authorized redirect URI** for your OAuth client:
  - `http://localhost:3000/api/google-drive/oauth/callback`
- Use the same Client ID and Client Secret in `backend/.env`.

## Optional: custom app icon

- **macOS**: Add `electron-app/icon.icns` (or use `build/icon.icns` and set `mac.icon` in package.json).
- **Windows**: Add `electron-app/icon.ico` (or `build/icon.ico`).
- Without these, Electron’s default icon is used.
