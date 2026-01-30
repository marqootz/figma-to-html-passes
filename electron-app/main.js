/**
 * Electron main process: runs the OAuth backend in-process and shows system tray.
 * Self-contained macOS/Windows app for Figma plugin Google Drive connection.
 */

const { app, Tray, Menu, nativeImage, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let httpServer = null;

// Backend path: in dev run from repo root (electron . from electron-app), packaged = resources/backend
function getBackendDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend');
  }
  return path.join(__dirname, '..', 'backend');
}

function ensureBackendEnv() {
  const backendDir = getBackendDir();
  const envPath = path.join(backendDir, '.env');
  const examplePath = path.join(backendDir, '.env.example');
  if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('Created backend/.env from .env.example – edit it with your Google OAuth credentials.');
  }
}

function startBackend() {
  const backendDir = getBackendDir();
  const serverPath = path.join(backendDir, 'server.js');

  if (!fs.existsSync(serverPath)) {
    console.error('Backend not found at', serverPath);
    return null;
  }

  // So backend's require('dotenv').config() and require('express') resolve from backend/
  process.chdir(backendDir);

  const { app: expressApp, PORT } = require(serverPath);
  const port = PORT || 3000;
  httpServer = expressApp.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
  return port;
}

// Fallback: colored circle when template PNG missing or fails to load (per Apple HIG fallback).
function createTrayIconFallback() {
  const size = 18;
  const buf = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const r = 6;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cx;
      if (dx * dx + dy * dy <= r * r) {
        buf[i] = 70;
        buf[i + 1] = 130;
        buf[i + 2] = 180;
        buf[i + 3] = 255;
      }
    }
  }
  const img = nativeImage.createFromBuffer(buf, { width: size, height: size });
  const size2 = 36;
  const buf2 = Buffer.alloc(size2 * size2 * 4);
  const cx2 = size2 / 2;
  const r2 = 12;
  for (let y = 0; y < size2; y++) {
    for (let x = 0; x < size2; x++) {
      const i = (y * size2 + x) * 4;
      const dx = x - cx2;
      const dy = y - cx2;
      if (dx * dx + dy * dy <= r2 * r2) {
        buf2[i] = 70;
        buf2[i + 1] = 130;
        buf2[i + 2] = 180;
        buf2[i + 3] = 255;
      }
    }
  }
  img.addRepresentation({ scaleFactor: 2, buffer: buf2, width: size2, height: size2 });
  return img;
}

function getTrayIconPath() {
  const candidates = [];
  if (app.isPackaged) {
    candidates.push(path.join(process.resourcesPath, 'assets', 'trayIconTemplate.png'));
    candidates.push(path.join(process.resourcesPath, 'app.asar', 'assets', 'trayIconTemplate.png'));
  }
  candidates.push(path.join(__dirname, 'assets', 'trayIconTemplate.png'));
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function writeTrayDebug(lines) {
  try {
    const dir = app.getPath('userData');
    fs.writeFileSync(path.join(dir, 'tray-debug.txt'), lines.join('\n'));
  } catch (_) {}
}

function createTray(port) {
  const log = [];
  log.push('resourcesPath=' + (process.resourcesPath || ''));
  log.push('__dirname=' + __dirname);

  const iconPath = getTrayIconPath();
  log.push('iconPath=' + (iconPath || 'null'));

  // Try template PNG first (black + alpha, macOS tints for light/dark menu bar)
  let icon = null;
  if (iconPath) {
    icon = nativeImage.createFromPath(iconPath);
    log.push('loaded from ' + iconPath + ', isEmpty=' + icon.isEmpty());
    if (icon.isEmpty()) {
      icon = null;
    }
  }
  // Fallback to colored circle if template fails
  if (!icon) {
    icon = createTrayIconFallback();
    log.push('using fallback (colored icon)');
  }
  writeTrayDebug(log);

  tray = new Tray(icon);
  tray.setToolTip(`Figma to HTML – http://localhost:${port}`);
  const backendDir = getBackendDir();
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: `Backend: http://localhost:${port}`, enabled: false },
      { label: 'Open backend folder (edit .env)', click: () => shell.openPath(backendDir) },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ])
  );
}

function stopBackend() {
  if (httpServer) {
    httpServer.close();
    httpServer = null;
  }
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

app.whenReady().then(() => {
  ensureBackendEnv();
  const port = startBackend();
  if (port) {
    createTray(port);
  } else {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

// No window, tray only
app.dock?.hide();
