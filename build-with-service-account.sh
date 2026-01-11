#!/bin/bash

# Build script with service account configuration
# This creates a pre-configured plugin that users can use without any setup!

echo "🔨 Building plugin with service account configuration..."

# Check if service account JSON file exists
if [ ! -f "config/service-account.json" ]; then
    echo "❌ Error: config/service-account.json not found!"
    echo ""
    echo "Please create it by:"
    echo "1. Download service account JSON from Google Cloud Console"
    echo "2. Copy it to: config/service-account.json"
    echo "   Example: cp ~/Downloads/service-account-key.json config/service-account.json"
    exit 1
fi

# Read service account JSON from file
export GOOGLE_SERVICE_ACCOUNT_JSON=$(cat config/service-account.json)

# Set your Google Drive folder ID (get from URL: drive.google.com/drive/folders/FOLDER_ID)
if [ -z "$GOOGLE_DRIVE_FOLDER_ID" ]; then
    echo "⚠️  GOOGLE_DRIVE_FOLDER_ID not set in environment"
    echo "   Set it like: export GOOGLE_DRIVE_FOLDER_ID='your-folder-id'"
    echo "   Or edit this script to set it directly"
    read -p "Enter Google Drive Folder ID now (or press Enter to skip): " FOLDER_ID
    if [ ! -z "$FOLDER_ID" ]; then
        export GOOGLE_DRIVE_FOLDER_ID="$FOLDER_ID"
    fi
fi

# Optional: Backend URL for JWT signing (if you have a backend service)
# If not set, users will need to use OAuth or pre-generated token
if [ -z "$GOOGLE_AUTH_BACKEND_URL" ]; then
    echo "ℹ️  GOOGLE_AUTH_BACKEND_URL not set"
    echo "   Service account will need backend for JWT signing"
    echo "   Or users can use OAuth as fallback"
fi

# Build the plugin
echo ""
echo "📦 Building plugin..."
node build.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build complete!"
    echo ""
    echo "📦 Pre-configured plugin is ready in: figma-plugin/"
    echo ""
    echo "🎉 Users can now:"
    echo "   1. Install the plugin from figma-plugin/ folder"
    echo "   2. Use it immediately - NO configuration needed!"
    echo "   3. Export HTML directly to Google Drive"
    echo ""
    echo "⚠️  Note: If using service account, you still need:"
    echo "   - Backend service for JWT signing (set GOOGLE_AUTH_BACKEND_URL)"
    echo "   OR users can use OAuth as fallback"
else
    echo "❌ Build failed!"
    exit 1
fi
