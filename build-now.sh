#!/bin/bash

# Quick build script - service account JSON is already in config/

echo "🔨 Building plugin with your service account..."
echo ""

# Check if JSON exists
if [ ! -f "config/service-account.json" ]; then
    echo "❌ Error: config/service-account.json not found!"
    exit 1
fi

echo "✅ Service account JSON found"
echo "   Email: uxync-gdrive@uxync-drive-integration.iam.gserviceaccount.com"
echo ""

# Read JSON and set env var
export GOOGLE_SERVICE_ACCOUNT_JSON=$(cat config/service-account.json)

# Check if folder ID is set
if [ -z "$GOOGLE_DRIVE_FOLDER_ID" ]; then
    echo "⚠️  Google Drive Folder ID not set"
    echo ""
    read -p "Enter your Google Drive Folder ID (or press Enter to skip): " FOLDER_ID
    if [ ! -z "$FOLDER_ID" ]; then
        export GOOGLE_DRIVE_FOLDER_ID="$FOLDER_ID"
        echo "✅ Folder ID set"
    else
        echo "⚠️  Building without folder ID - you'll need to set it in Settings"
    fi
    echo ""
fi

# Optional: Backend URL
if [ -z "$GOOGLE_AUTH_BACKEND_URL" ]; then
    echo "ℹ️  Backend URL not set (for JWT signing)"
    echo "   Users will need to use OAuth as fallback"
    echo ""
fi

# Build
echo "📦 Building plugin..."
node build.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build complete!"
    echo ""
    echo "📦 Pre-configured plugin ready in: figma-plugin/"
    echo ""
    if [ ! -z "$GOOGLE_DRIVE_FOLDER_ID" ]; then
        echo "🎉 Plugin is fully configured!"
        echo "   - Service account: ✅"
        echo "   - Folder ID: ✅"
        echo "   - Users can install and use immediately!"
    else
        echo "⚠️  Remember to:"
        echo "   1. Share Google Drive folder with: uxync-gdrive@uxync-drive-integration.iam.gserviceaccount.com"
        echo "   2. Set folder ID in Settings (or rebuild with GOOGLE_DRIVE_FOLDER_ID env var)"
    fi
    echo ""
    echo "⚠️  Note: Service account needs backend for JWT signing"
    echo "   OR users can use OAuth as fallback"
else
    echo "❌ Build failed!"
    exit 1
fi
