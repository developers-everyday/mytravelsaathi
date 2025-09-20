# Travel Saathi Main Agent

This directory contains the main Travel Saathi agent implementation using Google ADK (Agent Development Kit).

## Quick Start

### 1. Start the ADK Service (Recommended)
```bash
cd ..
./start-adk-service.sh
```

### 2. Test the Service
```bash
cd ..
./test-adk-service.sh
```

### 3. Manual Start (Alternative)
```bash
# Activate virtual environment
source fastapi_env/bin/activate

# Set environment variables
export GOOGLE_GENAI_USE_VERTEXAI=1
export GOOGLE_CLOUD_PROJECT=mytravelsaathi-472115
export GOOGLE_CLOUD_LOCATION=us-central1

# Start the service
cd ..
adk api_server --host=0.0.0.0 --port=8081 --verbose .
```

## Files Overview

### Core Files
- `agent.py` - Main agent implementation with tools and instructions
- `server_fastapi.py` - FastAPI server implementation (alternative to ADK service)
- `requirements.txt` - Python dependencies
- `requirements_fastapi.txt` - FastAPI-specific dependencies

### Documentation
- `../ADK-SERVICE-MODE-GUIDE.md` - Comprehensive guide for ADK service mode
- `DEPLOYMENT-GUIDE.md` - Deployment instructions for Google Cloud

### Scripts
- `../start-adk-service.sh` - Automated service startup script
- `../test-adk-service.sh` - Service testing script

### Deployment Scripts
- `deploy.sh` - Main deployment script
- `deploy_fastapi.sh` - FastAPI deployment script
- `deploy_standalone_agent.sh` - Standalone agent deployment

## Agent Capabilities

The Travel Saathi agent provides:

### User Management
- User registration and authentication
- User profile management
- User search by name/email

### Hotel Services
- Search hotels by location, name, or traveler type
- Hotel booking and reservation management
- Booking history and management

### Travel Planning
- Places search (restaurants, attractions, nightlife)
- Travel recommendations and itinerary planning
- Location-based services

## Service Endpoints

When running in ADK service mode, the following endpoints are available:

- `GET /health` - Health check
- `POST /apps/main_agent/users/{userId}/sessions` - Create session
- `POST /run_sse` - Run agent with streaming responses

## Environment Variables

### Required for ADK Service
```bash
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=mytravelsaathi-472115
GOOGLE_CLOUD_LOCATION=us-central1
ENVIRONMENT=local  # or 'production'
```

### Optional
```bash
TOOLBOX_URL=https://toolbox-345761725129.us-central1.run.app
MAPS_SERVICE_URL=https://maps-service-345761725129.us-central1.run.app/places-search
```

## Troubleshooting

### Common Issues

1. **Authentication Error**: Ensure `GOOGLE_GENAI_USE_VERTEXAI=1` is set
2. **Port in Use**: Kill existing processes with `pkill -f "adk api_server"`
3. **SSL Issues**: Set `ENVIRONMENT=local` for development
4. **Tool Loading**: Check MCP toolbox connectivity

### Debug Mode
Start with verbose logging:
```bash
adk api_server --host=0.0.0.0 --port=8081 --verbose .
```

## Development vs Production

### Local Development
- SSL verification disabled
- Detailed logging enabled
- Mock data fallbacks available

### Production
- SSL verification enabled
- Optimized logging
- Full Google Cloud integration

## Integration Examples

### cURL Examples
```bash
# Create session
curl -X POST http://localhost:8081/apps/main_agent/users/test_user/sessions \
  -H "Content-Type: application/json" -d '{}'

# Send message
curl -X POST http://localhost:8081/run_sse \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "main_agent",
    "userId": "test_user",
    "sessionId": "session-id",
    "newMessage": {
      "parts": [{"text": "Find hotels in Paris"}],
      "role": "user"
    },
    "streaming": true
  }'
```

### Python Integration
```python
import requests

# Create session
session_response = requests.post(
    "http://localhost:8081/apps/main_agent/users/user123/sessions",
    json={}
)
session_id = session_response.json()["id"]

# Send message
message_response = requests.post(
    "http://localhost:8081/run_sse",
    json={
        "appName": "main_agent",
        "userId": "user123",
        "sessionId": session_id,
        "newMessage": {
            "parts": [{"text": "Hello, I need help with travel planning"}],
            "role": "user"
        },
        "streaming": True
    },
    stream=True
)

# Process streaming response
for line in message_response.iter_lines():
    if line.startswith(b'data: '):
        print(line.decode('utf-8')[6:])
```

## Support

For detailed information, see:
- `../ADK-SERVICE-MODE-GUIDE.md` - Complete service mode documentation
- `DEPLOYMENT-GUIDE.md` - Production deployment guide

---

**Last Updated**: September 20, 2025
**Version**: 1.0
