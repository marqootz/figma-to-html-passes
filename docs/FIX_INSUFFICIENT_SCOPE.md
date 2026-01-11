# Fix: Insufficient Authentication Scopes (403 Error)

## The Problem

You're getting a 403 Forbidden error with:
```
"Request had insufficient authentication scopes."
"ACCESS_TOKEN_SCOPE_INSUFFICIENT"
```

This means your access token doesn't have the required Google Drive scope.

## Solution: Re-authenticate with Full Drive Scope

### Step 1: Revoke Current Credentials

```bash
# Revoke application default credentials
gcloud auth application-default revoke

# Or revoke all credentials
gcloud auth revoke --all
```

### Step 2: Authenticate with Required Scopes

**Important:** You must authenticate with both `cloud-platform` (required by gcloud) and `drive` scopes:

```bash
# Authenticate with required scopes
# Note: cloud-platform scope is required by gcloud, drive scope is needed for API access
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive
```

This will:
- Open your browser
- Ask you to sign in with Google
- Request authorization for **full Google Drive access**
- Save credentials with the correct scope

### Step 3: Get New Token

```bash
# Get access token with Drive scope
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
```

**Copy the token** and paste it in your Figma plugin Settings → Access Token field.

## Why Full Drive Scope is Required

The plugin needs the **full `drive` scope** (`https://www.googleapis.com/auth/drive`) because:

- ✅ Can list children of shared folders
- ✅ Can access all files and folders
- ✅ Can create, read, update, and delete files
- ✅ Required for `supportsAllDrives=true` parameter

**Limited scopes that DON'T work:**
- ❌ `drive.file` - Only files created by the app
- ❌ `drive.readonly` - Read-only, but can't list children of shared folders

## Alternative: Use oauth2l

If gcloud scope issues persist, use `oauth2l` instead:

```bash
# Install oauth2l
brew install oauth2l

# Get token with full drive scope
oauth2l fetch --credentials=oauth-credentials.json \
  --scope=https://www.googleapis.com/auth/drive \
  --output_format=bare
```

## Verify Token Scope

To check what scopes your token has:

```bash
# Get token
TOKEN=$(gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive)

# Check token info (requires curl)
curl "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=$TOKEN" | grep scope
```

Should show: `"scope": "https://www.googleapis.com/auth/drive ..."`

## Summary

1. **Revoke old credentials:** `gcloud auth application-default revoke`
2. **Re-authenticate with full scope:** `gcloud auth application-default login --scopes=https://www.googleapis.com/auth/drive`
3. **Get new token:** `gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive`
4. **Paste in plugin:** Settings → Access Token → Save

---

**See also:**
- `docs/GET_TOKEN_WITH_GCLOUD.md` - Getting tokens with gcloud
- `docs/USING_PLUGIN_WITHOUT_BACKEND.md` - Alternative token methods
