# How to Get Service Account JSON Key File

Your service account key ID will be something like: `abc123def456...` (a long hexadecimal string)

## What You Need

For the plugin to work, you need the **full JSON key file** (not just the ID). The JSON file contains:
- Private key (for JWT signing)
- Client email (for sharing Google Drive folder)
- Project ID
- And other credentials

## How to Download the JSON Key File

### Step 1: Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project

### Step 2: Find Your Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Look for service accounts and click on the one you want to use
3. The key ID should match the `private_key_id` in the JSON file you download

### Step 3: Create and Download Key

1. Click the **Keys** tab
2. Click **Add Key** → **Create new key**
3. Choose **JSON** format
4. Click **Create**
5. The JSON file will download automatically (usually to your Downloads folder)

**⚠️ Important:** You can only download the key once! Save it securely.

**Note:** If you already have a key with that ID, you can't re-download it. You'll need to create a new key.

### Step 4: Save the JSON File

The downloaded file will look something like:
- `your-project-abc123-xyz789.json`
- Or `service-account-key.json`

Save it to your project:
```bash
# Create config folder (if it doesn't exist)
mkdir -p config

# Copy to config folder (gitignored)
cp ~/Downloads/your-project-abc123-xyz789.json config/service-account.json
```

## What the JSON File Contains

The JSON file will look like this (and should contain your key ID):

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## If You Already Have the JSON File

If you already have the JSON file somewhere on your computer:

1. **Find it** (search for files containing `3e5847e48967881df62c291acca2faf9d3644230`)
2. **Copy it** to the config folder:
   ```bash
   cp /path/to/your/service-account-key.json config/service-account.json
   ```

## Quick Check Script

Run this to check if you already have the JSON file:

```bash
# Search for JSON files that might contain your key ID (replace YOUR_KEY_ID with your actual key ID)
find ~ -name "*.json" -type f 2>/dev/null | xargs grep -l "YOUR_KEY_ID" 2>/dev/null
```

If it finds a file, that's your service account JSON!

## Next Steps

Once you have `config/service-account.json`:

1. **Share Google Drive folder** with the service account email (from the JSON file's `client_email` field)
2. **Get folder ID** from Google Drive URL
3. **Build the plugin**:
   ```bash
   export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'
   ./build-with-service-account.sh
   ```

## Troubleshooting

**"I can't find the service account"**
- Make sure you're in the correct Google Cloud project
- Check IAM & Admin → Service Accounts
- The ID you provided is the key ID, not the service account ID

**"I already have a key but can't find the file"**
- Keys can only be downloaded once
- If you lost it, you'll need to create a new key
- Go to Keys tab → Add Key → Create new key

**"The service account doesn't exist"**
- You may need to create a new service account
- See [SERVICE_ACCOUNT_SETUP.md](./SERVICE_ACCOUNT_SETUP.md) for instructions

## Verify You Have the Right File

To verify you have the correct JSON file, check if it contains:
- ✅ `"type": "service_account"`
- ✅ `"private_key"` (long string with BEGIN/END PRIVATE KEY)
- ✅ `"client_email"` (ends with @...iam.gserviceaccount.com)
- ✅ `"private_key_id"` (your key ID - a long hexadecimal string)

If all of these are present, you have the correct JSON file!
