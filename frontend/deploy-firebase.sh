#!/bin/bash

# Firebase Phase 2 Deployment Script
# This script builds and deploys the frontend to Firebase Hosting

set -e

echo "🚀 Starting Firebase Phase 2 Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "web" ]; then
    print_error "Please run this script from the frontend directory"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "You are not logged in to Firebase. Please login first:"
    echo "firebase login"
    exit 1
fi

print_status "Building React application..."

# Navigate to web directory and build
cd web

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Build the application
print_status "Building for production..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_success "Build completed successfully!"

# Go back to frontend directory
cd ..

# Deploy to Firebase
print_status "Deploying to Firebase Hosting..."

firebase deploy --only hosting

print_success "🎉 Firebase Phase 2 deployment completed successfully!"
print_status "Your app is now live at: https://mytravelsaathi-prod.web.app"

echo ""
echo "📋 Next Steps:"
echo "1. Configure your Firebase project settings"
echo "2. Set up Firestore security rules"
echo "3. Configure authentication providers"
echo "4. Set up Cloud Storage for file uploads"
echo "5. Test all features in production"
echo ""
echo "🔗 Useful Links:"
echo "- Firebase Console: https://console.firebase.google.com/"
echo "- Hosting Dashboard: https://console.firebase.google.com/project/mytravelsaathi-prod/hosting"
echo "- Authentication: https://console.firebase.google.com/project/mytravelsaathi-prod/authentication"
echo "- Firestore: https://console.firebase.google.com/project/mytravelsaathi-prod/firestore"
