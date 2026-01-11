#!/bin/bash

# Backend Setup Script
# This script helps set up the backend server for OAuth

echo "🚀 Setting up backend server for Figma plugin OAuth..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Google OAuth credentials:"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit backend/.env and add your Google OAuth credentials"
echo "   2. Add redirect URI in Google Cloud Console:"
echo "      http://localhost:3000/api/google-drive/oauth/callback"
echo "   3. Start the server: node backend/server.js"
echo "   4. Rebuild plugin with:"
echo "      export GOOGLE_AUTH_BACKEND_URL='http://localhost:3000'"
echo "      export GOOGLE_CLIENT_ID='your-client-id'"
echo "      node build.js"
echo ""
