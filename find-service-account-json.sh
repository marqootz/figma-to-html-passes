#!/bin/bash

# Helper script to find service account JSON file with your key ID

KEY_ID="3e5847e48967881df62c291acca2faf9d3644230"

echo "🔍 Searching for service account JSON file with key ID: $KEY_ID"
echo ""

# Search common locations
SEARCH_PATHS=(
    "$HOME/Downloads"
    "$HOME/Desktop"
    "$HOME/Documents"
    "$HOME"
)

FOUND=false

for path in "${SEARCH_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "Searching in: $path"
        result=$(find "$path" -name "*.json" -type f -maxdepth 3 2>/dev/null | xargs grep -l "$KEY_ID" 2>/dev/null | head -1)
        if [ ! -z "$result" ]; then
            echo "✅ Found: $result"
            echo ""
            echo "To use it, copy it to config folder:"
            echo "  cp \"$result\" config/service-account.json"
            FOUND=true
            break
        fi
    fi
done

if [ "$FOUND" = false ]; then
    echo "❌ Service account JSON file not found in common locations"
    echo ""
    echo "You'll need to:"
    echo "1. Download it from Google Cloud Console:"
    echo "   - Go to IAM & Admin → Service Accounts"
    echo "   - Click on your service account"
    echo "   - Go to Keys tab → Add Key → Create new key (JSON)"
    echo ""
    echo "2. Or if you have it elsewhere, copy it to:"
    echo "   config/service-account.json"
fi
