# 🌐 My Travel Saathi - Frontend

This directory contains the frontend applications for My Travel Saathi, built with Firebase integration.

## 📁 Structure

```
frontend/
├── web/                    # Web application (React/Vue.js + Firebase)
├── mobile/                 # Future mobile app (React Native + Firebase)
├── firebase-config/        # Firebase configuration files
└── docs/                   # Frontend documentation
```

## 🎯 Phase 1 Implementation

### **Web Application Features:**
- ✅ **Firebase Authentication** (Email/Password, Google Sign-in)
- ✅ **User Profile Management** (Travel preferences, booking history)
- ✅ **Real-time Chat Interface** with Travel Saathi AI agent
- ✅ **Booking Management** (View, manage, cancel bookings)
- ✅ **Responsive Design** (Mobile-friendly)

### **Tech Stack:**
- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore (user data) + Cloud SQL (bookings)
- **Backend**: Existing FastAPI agent
- **Deployment**: Firebase Hosting

### **Integration Points:**
- **FastAPI Agent**: `https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app`
- **Firebase Project**: `mytravelsaathi-472115`
- **Database**: Hybrid (Firestore + Cloud SQL)

## 🚀 Quick Start

```bash
# Install dependencies
cd frontend/web
npm install

# Start development server
npm run dev

# Deploy to Firebase
npm run deploy
```

## 📱 User Flow

1. **Registration/Login** → Firebase Auth
2. **Profile Setup** → Firestore (travel preferences)
3. **Chat with Agent** → FastAPI backend
4. **Booking Management** → Cloud SQL + Firestore sync
5. **Real-time Updates** → Firebase real-time database

## 🔗 API Integration

The frontend communicates with your existing FastAPI agent:
- **Chat**: `/chat` endpoint for AI conversations
- **Streaming**: `/chat/stream` for real-time responses
- **Health**: `/health` for service monitoring
- **Info**: `/info` for agent capabilities

## 📊 Data Flow

```
User → Firebase Auth → Web App → FastAPI Agent → Cloud SQL
                    ↓
                 Firestore (User Data)
```
