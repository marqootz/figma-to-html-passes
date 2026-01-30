/**
 * Prebuild: inject GOOGLE_CLIENT_ID (and optionally GOOGLE_CLIENT_SECRET) into backend/.env
 * before packaging, so the built app has credentials pre-filled and users don't need to edit .env.
 *
 * Run before electron-builder. Example:
 *   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com npm run build:mac
 */
const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, '..', 'backend');
const envPath = path.join(backendDir, '.env');
const examplePath = path.join(backendDir, '.env.example');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId) {
  console.log('prebuild: GOOGLE_CLIENT_ID not set, skipping .env injection.');
  process.exit(0);
}

let content = '';
if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, 'utf8');
} else if (fs.existsSync(examplePath)) {
  content = fs.readFileSync(examplePath, 'utf8');
} else {
  content = 'GOOGLE_CLIENT_ID=\nPORT=3000\n';
}

// Set or overwrite GOOGLE_CLIENT_ID and optionally GOOGLE_CLIENT_SECRET
function setOrAdd(lines, key, value) {
  const line = `${key}=${value}`;
  const keyRegex = new RegExp(`^${key}=.*$`, 'm');
  if (keyRegex.test(lines)) {
    return lines.replace(keyRegex, line);
  }
  return lines.trimEnd() + (lines.endsWith('\n') ? '' : '\n') + line + '\n';
}

content = setOrAdd(content, 'GOOGLE_CLIENT_ID', clientId);
if (clientSecret) {
  content = setOrAdd(content, 'GOOGLE_CLIENT_SECRET', clientSecret);
}

fs.writeFileSync(envPath, content);
console.log('prebuild: Injected GOOGLE_CLIENT_ID (and optional GOOGLE_CLIENT_SECRET) into backend/.env');
