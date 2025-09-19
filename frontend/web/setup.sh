#!/bin/bash

# =============================================================================
# My Travel Saathi Frontend Setup Script
# =============================================================================
# This script sets up the React frontend with Firebase integration
# =============================================================================

set -euo pipefail

echo "🚀 Setting up My Travel Saathi Frontend..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy Firebase config template
echo ""
echo "🔧 Setting up Firebase configuration..."
if [ ! -f "src/firebase-config/firebase.ts" ]; then
    echo "⚠️  Firebase configuration not found!"
    echo "   Please update src/firebase-config/firebase.ts with your Firebase project details."
    echo ""
    echo "   Required configuration:"
    echo "   - apiKey"
    echo "   - authDomain"
    echo "   - projectId: mytravelsaathi-472115"
    echo "   - storageBucket"
    echo "   - messagingSenderId"
    echo "   - appId"
    echo ""
fi

# Create .env file template
echo ""
echo "📝 Creating environment configuration..."
cat > .env.local << EOF
# My Travel Saathi Frontend Environment Variables
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=mytravelsaathi-472115.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mytravelsaathi-472115
VITE_FIREBASE_STORAGE_BUCKET=mytravelsaathi-472115.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# FastAPI Backend URL
VITE_API_BASE_URL=https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app
EOF

echo "✅ Environment file created: .env.local"
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Update src/firebase-config/firebase.ts with your Firebase details"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Run 'npm run build' to build for production"
echo "5. Run 'npm run deploy' to deploy to Firebase Hosting"
echo ""
echo "🔗 Useful URLs:"
echo "   Development: http://localhost:3000"
echo "   FastAPI Backend: https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app"
echo "   API Docs: https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app/docs"
echo ""
echo "🚀 Ready to build your travel assistant frontend!"
