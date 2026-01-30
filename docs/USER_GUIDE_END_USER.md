# User Guide: Running the App and Plugin (End Users)

This guide is for **non-developers** who received the desktop app and the Figma plugin from their team. You only need to run the app, load the plugin, and connect to Google Drive.

---

## What you need

- **The desktop app** – “Figma to HTML” (macOS or Windows), from your team.
- **The Figma plugin** – “Figma to HTML” (a folder with `manifest.json`), from your team.
- **Figma** – desktop or browser.
- **A Google account** – to sign in when you connect to Drive.

You do **not** need Google Cloud Console, callbacks, or any developer setup. Your team handles that.

**Developers / team admins:** see [User Guide: Developer / Admin](USER_GUIDE_DEVELOPER.md) for building and distributing the app and plugin.

---

## Step 1: Run the desktop app

1. **macOS:** Open **Figma to HTML.app** (or install from the .dmg your team gave you).  
   **Windows:** Run the installer or the portable .exe.

2. The app has **no window**. Find its icon:
   - **macOS:** Top-right **menu bar** (next to Wi‑Fi, battery, clock). Click it to open the menu.
   - **Windows:** **System tray** (bottom-right; click the ^ arrow if you don’t see it).

3. Leave the app running whenever you want to use “Connect to Google Drive” in the plugin.

**First time only (only if your team didn’t pre-configure the app):** If your team gave you a **Client ID** to paste in:
- Click the app icon in the menu bar / system tray → **Open backend folder (edit .env)**.
- In the folder that opens, open the **`.env`** file in a text editor (create it by copying `.env.example` if there is no `.env`).
- Add or edit this line (use the value from your team):
  ```text
  GOOGLE_CLIENT_ID=the-client-id-your-team-gave-you.apps.googleusercontent.com
  ```
- Save the file, then **Quit** the app from its menu and **start it again**.

If your team said the app is already configured (Client ID pre-filled when they built it), you can skip this and go to Step 2.

---

## Step 2: Load the plugin in Figma

1. In Figma: **Resources** (or **Plugins**) → **Development** → **Import plugin from manifest…**
2. Choose the **`manifest.json`** file inside the plugin folder your team gave you.
3. The plugin appears under **Development** as “Figma to HTML”. Run it from there.

---

## Step 3: Connect to Google Drive

1. In Figma, open the **Figma to HTML** plugin (Development → Figma to HTML).

2. **Optional – if your team gave you a Drive folder ID:**  
   Click **Settings**, enter the **Google Drive Folder ID** in the field, then save. (You can skip this and set the folder later.)

3. Click **Connect to Google Drive**.
   - A browser window opens. Sign in with your Google account and allow access to Drive.
   - You’re redirected back; the plugin shows that it’s connected.

4. Use the plugin to export designs to Google Drive. You don’t need to reconnect every time you open the plugin—only when it asks you to (e.g. after about an hour).

---

## Step 4: Use the plugin

Select frames or pages in Figma, then use the plugin’s export/upload action to send HTML (and assets) to your Google Drive folder. Keep the desktop app running in the background (menu bar / system tray) while you use the plugin.

---

## Troubleshooting

- **“I don’t see the app”**  
  **macOS:** Look at the **top-right menu bar** (not the Dock). The app doesn’t show in the Dock.  
  **Windows:** Check the **system tray** (bottom-right); click the ^ to show hidden icons.

- **“Connect to Google Drive” fails or says “session expired”**  
  Make sure the desktop app is running (you see its icon in the menu bar / system tray). Restart the app and try again. If it still fails, ask your team to check that the app is configured with the correct Client ID.

- **“Token does not have drive scope” / 403**  
  Ask your team to ensure the Google Drive API is enabled and the OAuth client is set up correctly. Then try **Connect to Google Drive** again.

- **Plugin says it can’t reach the backend**  
  The desktop app must be running. In plugin **Settings**, set **Backend URL** to `http://localhost:3000` if there’s a field for it. If the plugin was pre-configured by your team, ask them to confirm.

- **macOS: “App is from an unidentified developer”**  
  Right‑click the app → **Open** → **Open** to allow it.

---

## Quick reference

- **Backend URL** (if you need to enter it): `http://localhost:3000`
- **Config file** (first-time credentials): App menu → **Open backend folder (edit .env)** → edit **`.env`**
