# Fix: Presentations Not Showing in Dropdown

## Problem

The plugin dropdown shows no presentations even though there are 3 presentations in Google Drive.

## Root Causes

### 1. OAuth Scope Issue (Most Likely)

The OAuth scope `https://www.googleapis.com/auth/drive.file` only allows access to files **created by the app using that token**. If the presentations were created by:
- A different user
- A different OAuth token
- Manually in Google Drive

They won't be visible!

**Solution:** You need to use a broader scope that allows reading existing files.

### 2. Folder Structure Mismatch

The plugin expects:
```
Main Folder (1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq)
└── presentations/ (subfolder)
    ├── presentation1/ (subfolder)
    ├── presentation2/ (subfolder)
    └── presentation3/ (subfolder)
```

But your presentations might be:
- Directly in the main folder (not in a `presentations` subfolder)
- In a different folder structure

## Fix: Update OAuth Scope

### Step 1: Get New Access Token with Correct Scope

You need a token with `drive.readonly` scope to read existing files.

**Option A: Use OAuth Playground (Recommended)**

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon → Check "Use your own OAuth credentials"
3. Enter your Client ID and Secret
4. In left panel, find:
   - ✅ `https://www.googleapis.com/auth/drive.readonly` (to read existing files)
   - ✅ `https://www.googleapis.com/auth/drive.file` (to create/write files)
5. Click "Authorize APIs" → Sign in → Allow
6. Click "Exchange authorization code for tokens"
7. Copy the **Access token**
8. Paste in plugin Settings → Access Token → Save

**Option B: Re-authorize in Plugin**

The plugin code has been updated to request the broader scope, but you'll need to:
1. Delete your current access token (Settings → clear Access Token field)
2. Click "Connect to Google Drive" again
3. Get a new token with the updated scope

### Step 2: Check Folder Structure

Verify where your presentations actually are:

1. Open your Google Drive folder: https://drive.google.com/drive/u/0/folders/1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq
2. Check if presentations are:
   - **Directly in the main folder** → Plugin will now find them (code updated)
   - **In a `presentations` subfolder** → Plugin should find them
   - **Somewhere else** → Update folder ID or move presentations

### Step 3: Check Browser Console

Open browser console (F12) in Figma and look for:
- `Found folders: [...]` - Should show folder names
- `Found presentations: [...]` - Should show presentation names
- Any error messages about permissions or API calls

## Updated Code

The plugin has been updated to:
1. ✅ Request `drive.readonly` scope (to read existing files)
2. ✅ Fall back to listing folders directly in main folder if `presentations` subfolder doesn't exist
3. ✅ Better error logging to debug issues

## Quick Test

1. Open plugin
2. Open browser console (F12)
3. Click to refresh presentations (or reload plugin)
4. Look for console messages showing what folders were found
5. If no folders found, check the error message

## Alternative: Manual Check

You can manually check what the API returns:

```bash
# Replace ACCESS_TOKEN with your token
curl "https://www.googleapis.com/drive/v3/files?q='1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(name,id)" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

This will show all folders in your main folder.

## Still Not Working?

1. **Check token scope**: Token must have `drive.readonly` or `drive` scope
2. **Check folder permissions**: Token must have access to the folder
3. **Check folder structure**: Presentations must be folders, not files
4. **Check console errors**: Look for specific API errors

Let me know what you see in the console and we can debug further!
