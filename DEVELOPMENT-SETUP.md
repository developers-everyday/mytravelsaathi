# Travel Saathi - Development Setup Guide

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js (v16+)
- Python 3.12+
- Google Cloud credentials configured

### **1. Start All Services:**

```bash
# Terminal 1: Start ADK Server
cd my_agents
./start-adk-service.sh

# Terminal 2: Start CORS Proxy (Development Only)
cd /path/to/mytravelsaathi
node cors-proxy.js

# Terminal 3: Start Frontend
cd frontend/web
npm run dev
```

### **2. Access URLs:**
- **Frontend:** http://localhost:3000
- **Test Chat:** http://localhost:3000/test-chat
- **ADK Server:** http://localhost:8081
- **CORS Proxy:** http://localhost:8082

## 🔧 **Development Tools**

### **CORS Proxy (`cors-proxy.js`)**
- **Purpose:** Solves CORS issues during local development
- **Usage:** `node cors-proxy.js`
- **Port:** 8082
- **Target:** http://localhost:8081

**⚠️ IMPORTANT:** This is a **development-only** tool. Do not use in production.

### **Test Scripts:**
- `test-integration.js` - Basic integration test
- `test-complete-integration.js` - Comprehensive integration test

## 🏗️ **Architecture**

```
Development Environment:
Frontend (React) → CORS Proxy → ADK Server → MCP Toolbox
:3000          →    :8082   →    :8081   →   Cloud Run

Production Environment:
Frontend (React) → Reverse Proxy → ADK Server → MCP Toolbox
:443            →     nginx     →   Cloud Run →   Cloud Run
```

## 🚀 **Production Deployment**

### **CORS Solutions for Production:**

1. **Reverse Proxy (Recommended):**
   ```nginx
   # nginx configuration
   location /api/ {
       proxy_pass http://adk-server:8081/;
       add_header Access-Control-Allow-Origin *;
   }
   ```

2. **Server-Side CORS Headers:**
   ```python
   # ADK server configuration
   app.add_middleware(CORSMiddleware, allow_origins=["*"])
   ```

3. **Cloud Run Configuration:**
   ```yaml
   # cloudbuild.yaml
   env:
     - name: CORS_ORIGINS
       value: "https://your-frontend-domain.com"
   ```

## 🧪 **Testing**

### **Local Testing:**
```bash
# Test complete integration
node test-complete-integration.js

# Test individual components
curl http://localhost:8082/list-apps
```

### **Frontend Testing:**
- Open http://localhost:3000/test-chat
- Try quick action buttons
- Send custom messages
- Verify streaming responses

## 📁 **File Structure**

```
mytravelsaathi/
├── cors-proxy.js              # Development CORS proxy
├── test-integration.js        # Basic integration test
├── test-complete-integration.js # Complete integration test
├── my_agents/
│   ├── start-adk-service.sh   # ADK server startup
│   └── main_agent/
│       └── agent.py           # Travel Saathi agent
└── frontend/web/
    ├── src/
    │   ├── services/
    │   │   └── TravelSaathiAPI.ts  # API service
    │   └── components/
    │       └── TravelSaathiChat.tsx # Chat component
    └── test-adk-integration.html   # Standalone test page
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Ensure CORS proxy is running on port 8082
   - Check frontend is using http://localhost:8082

2. **ADK Server Not Starting:**
   - Check environment variables
   - Verify Google Cloud credentials
   - Check port 8081 is available

3. **Frontend Not Loading:**
   - Check port 3000 is available
   - Run `npm install` in frontend/web
   - Check for JavaScript errors in browser console

### **Debug Commands:**
```bash
# Check running processes
lsof -i :3000 -i :8081 -i :8082

# Test API endpoints
curl http://localhost:8082/list-apps
curl http://localhost:3000/test-chat

# Check logs
tail -f my_agents/logs/adk-server.log
```

## 📚 **Additional Resources**

- [ADK Service Mode Guide](my_agents/ADK-SERVICE-MODE-GUIDE.md)
- [Frontend Integration Guide](frontend/web/ADK-INTEGRATION-GUIDE.md)
- [Deployment Guide](my_agents/main_agent/DEPLOYMENT-GUIDE.md)

## ⚠️ **Important Notes**

- **CORS Proxy is for development only** - never use in production
- **Environment variables** must be set for ADK server
- **Google Cloud credentials** required for agent functionality
- **Port conflicts** - ensure ports 3000, 8081, 8082 are available
