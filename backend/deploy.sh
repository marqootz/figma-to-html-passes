#!/bin/bash

# Backend Deployment Helper Script
# This script helps deploy the backend to various hosting platforms

set -e

echo "🚀 Backend Deployment Helper"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from template..."
    cat > .env << 'EOF'
# Backend Server Environment Variables
# Fill in your values below

# Google OAuth 2.0 Client ID
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Google OAuth 2.0 Client Secret
GOOGLE_CLIENT_SECRET=your-client-secret

# Server Port (optional, defaults to 3000)
PORT=3000
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env and add your Google OAuth credentials!${NC}"
    echo ""
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
    echo ""
fi

# Deployment options
echo "Select deployment platform:"
echo "  1) Railway (Recommended - Easy deployment)"
echo "  2) Render (Free tier available)"
echo "  3) Heroku (Paid, but mature)"
echo "  4) Local testing only"
echo "  5) Show deployment instructions for all platforms"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "🚂 Railway Deployment"
        echo "===================="
        echo ""
        echo "1. Install Railway CLI:"
        echo "   npm i -g @railway/cli"
        echo ""
        echo "2. Login to Railway:"
        echo "   railway login"
        echo ""
        echo "3. Link project:"
        echo "   cd backend"
        echo "   railway link"
        echo ""
        echo "4. Set environment variables:"
        echo "   railway variables set GOOGLE_CLIENT_ID=your-client-id"
        echo "   railway variables set GOOGLE_CLIENT_SECRET=your-client-secret"
        echo "   railway variables set PORT=3000"
        echo ""
        echo "5. Deploy:"
        echo "   railway up"
        echo ""
        echo "6. Get your backend URL from Railway dashboard"
        echo "   Example: https://your-app.railway.app"
        echo ""
        ;;
    2)
        echo ""
        echo "🎨 Render Deployment"
        echo "==================="
        echo ""
        echo "1. Go to https://render.com and sign up"
        echo ""
        echo "2. Create new Web Service"
        echo ""
        echo "3. Connect your GitHub repository"
        echo ""
        echo "4. Configure:"
        echo "   - Root Directory: backend"
        echo "   - Build Command: npm install"
        echo "   - Start Command: npm start"
        echo ""
        echo "5. Set environment variables in Render dashboard:"
        echo "   - GOOGLE_CLIENT_ID"
        echo "   - GOOGLE_CLIENT_SECRET"
        echo "   - PORT=3000"
        echo ""
        echo "6. Deploy and get your backend URL"
        echo "   Example: https://your-app.onrender.com"
        echo ""
        ;;
    3)
        echo ""
        echo "🟣 Heroku Deployment"
        echo "==================="
        echo ""
        echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
        echo ""
        echo "2. Login:"
        echo "   heroku login"
        echo ""
        echo "3. Create app:"
        echo "   cd backend"
        echo "   heroku create your-app-name"
        echo ""
        echo "4. Set environment variables:"
        echo "   heroku config:set GOOGLE_CLIENT_ID=your-client-id"
        echo "   heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret"
        echo ""
        echo "5. Deploy:"
        echo "   git push heroku main"
        echo ""
        echo "6. Get your backend URL:"
        echo "   heroku info"
        echo "   Example: https://your-app.herokuapp.com"
        echo ""
        ;;
    4)
        echo ""
        echo "🧪 Local Testing"
        echo "==============="
        echo ""
        echo "Starting local server..."
        echo ""
        
        # Check if .env has real values
        if grep -q "your-client-id" .env 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Warning: .env file still has placeholder values${NC}"
            echo "Please edit .env and add your actual Google OAuth credentials"
            echo ""
        fi
        
        echo "Server will start on http://localhost:3000"
        echo "Press Ctrl+C to stop"
        echo ""
        node server.js
        ;;
    5)
        echo ""
        echo "📋 Deployment Instructions for All Platforms"
        echo "============================================="
        echo ""
        echo "See docs/BACKEND_DEPLOYMENT.md for detailed instructions"
        echo ""
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac
