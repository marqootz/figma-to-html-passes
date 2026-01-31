# Secure Credential Storage Guide

This guide explains best practices for storing and sharing `.env` values and other sensitive credentials.

## ✅ Safe Storage Options

### 1. **Confluence (Internal Wiki) - RECOMMENDED for Teams**
**✅ Safe if:**
- Requires employee login/authentication
- Access is restricted to your team/organization
- Uses HTTPS
- Has audit logging enabled

**Best practices:**
- Create a private/restricted Confluence page
- Use a clear title like "Figma Plugin - Backend Configuration"
- Mark the page as "Restricted" or "Team Only"
- Include instructions, not just raw values
- Update when credentials rotate

**What to store:**
- OAuth Client ID (less sensitive, but still protect)
- Google Drive Folder ID (not sensitive, but useful)
- Backend URL (not sensitive)
- Setup instructions and links

**What NOT to store:**
- OAuth Client Secret (use password manager or secrets manager)
- Service Account JSON keys (use secrets manager)
- Access tokens (temporary, shouldn't be stored)

### 2. **Password Managers (1Password, LastPass, Bitwarden) - BEST for Secrets**
**✅ Ideal for:**
- OAuth Client Secrets
- Service Account JSON keys
- API keys
- Database passwords

**Benefits:**
- Encrypted at rest
- Access control/audit logs
- Easy to rotate credentials
- Can share with team securely

### 3. **Secrets Managers (AWS Secrets Manager, Google Secret Manager, HashiCorp Vault)**
**✅ Best for:**
- Production deployments
- Automated systems
- CI/CD pipelines
- Service-to-service authentication

**Benefits:**
- Automatic rotation
- Versioning
- Audit trails
- Integration with deployment tools

### 4. **Git Repository (Private, Restricted)**
**✅ Safe for:**
- `.env.example` files (with placeholders)
- Non-sensitive configuration
- Setup instructions

**❌ NEVER commit:**
- Actual `.env` files (should be in `.gitignore`)
- Real credentials
- Secrets or API keys

## 📋 Recommended Setup for Your Team

### For Internal Documentation (Confluence):

Create a Confluence page with:

**Title:** "Figma to HTML Plugin - Backend Configuration"

**Content:**
```markdown
# Backend Configuration

## Required Values

Copy these values to `backend/.env`:

### OAuth Client ID
```
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

**How to get:** [Link to Google Cloud Console credentials page]

### Google Drive Folder ID
```
GOOGLE_DRIVE_FOLDER_ID=1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq
```

**How to get:** Copy from Google Drive folder URL

### Backend URL (for plugin build)
```
GOOGLE_AUTH_BACKEND_URL=http://localhost:3000
```

### OAuth Client Secret
**⚠️ SENSITIVE - Store in password manager**
- See: [Link to password manager entry]
- Or contact: [Admin contact]

## Setup Steps

1. Copy `.env.example` to `.env`
2. Fill in values from this page
3. For Client Secret, get from password manager
4. Run: `npm run build`
5. Start backend: `node backend/server.js`
```

### For Sensitive Values (Password Manager):

Create entries for:
- **OAuth Client Secret** - Store in password manager
- **Service Account JSON** - Store in password manager (if used)
- **Production credentials** - Store in secrets manager

## 🔒 Security Best Practices

### DO:
- ✅ Store Client IDs in Confluence (less sensitive)
- ✅ Store Client Secrets in password manager
- ✅ Use `.env.example` in git (with placeholders)
- ✅ Keep `.env` in `.gitignore`
- ✅ Rotate credentials regularly
- ✅ Use different credentials for dev/staging/prod
- ✅ Limit access to Confluence page (team only)
- ✅ Document where secrets are stored

### DON'T:
- ❌ Commit `.env` files to git
- ❌ Share credentials via email/Slack
- ❌ Store secrets in Confluence (use password manager)
- ❌ Use production credentials in development
- ❌ Leave credentials in screenshots/logs

## 📝 Example Confluence Page Structure

```
Figma Plugin Configuration
├── Quick Start (public, no secrets)
├── Backend Setup (restricted, includes Client ID)
├── Credential Locations (restricted, links to password manager)
└── Troubleshooting (public)
```

## 🔄 Credential Rotation

When rotating credentials:
1. Update password manager first
2. Update Confluence page (if Client ID changed)
3. Notify team via secure channel
4. Update `.env` files locally
5. Rebuild plugin if needed

## 📞 Emergency Access

Document who has access to:
- Password manager (for Client Secret)
- Google Cloud Console (for creating new credentials)
- Confluence page (for Client ID)

---

**Remember:** Client IDs are less sensitive but should still be protected. Client Secrets and Service Account keys are highly sensitive and must be stored securely.
