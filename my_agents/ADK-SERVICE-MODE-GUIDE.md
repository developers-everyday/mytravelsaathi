# ADK Agent Service Mode Guide

This guide explains how to start your Travel Saathi agent in service mode using Google ADK (Agent Development Kit) for production deployment and external system integration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Starting the ADK API Server](#starting-the-adk-api-server)
4. [Testing the Service](#testing-the-service)
5. [API Endpoints](#api-endpoints)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

## Prerequisites

### Required Software
- Python 3.12+
- Google ADK installed in virtual environment
- Google Cloud credentials configured
- All agent dependencies installed

### Required Environment Variables
- `GOOGLE_GENAI_USE_VERTEXAI=1` (Critical for Vertex AI authentication)
- `GOOGLE_CLOUD_PROJECT=your-project-id`
- `GOOGLE_CLOUD_LOCATION=your-region`
- `ENVIRONMENT=local` (for local development) or `ENVIRONMENT=production`

## Environment Setup

### 1. Activate Virtual Environment
```bash
cd /path/to/mytravelsaathi/my_agents
source main_agent/fastapi_env/bin/activate
```

### 2. Set Required Environment Variables
```bash
export GOOGLE_GENAI_USE_VERTEXAI=1
export GOOGLE_CLOUD_PROJECT=mytravelsaathi-472115
export GOOGLE_CLOUD_LOCATION=us-central1
export ENVIRONMENT=local  # or 'production' for production deployment
```

### 3. Verify Dependencies
Ensure all required packages are installed:
```bash
pip list | grep -E "(google-adk|toolbox-core|fastapi)"
```

## Starting the ADK API Server

### Basic Command
```bash
cd /path/to/mytravelsaathi/my_agents
source main_agent/fastapi_env/bin/activate
export GOOGLE_GENAI_USE_VERTEXAI=1
export GOOGLE_CLOUD_PROJECT=mytravelsaathi-472115
export GOOGLE_CLOUD_LOCATION=us-central1
adk api_server --host=0.0.0.0 --port=8081 --verbose .
```

### Using the Startup Script (Recommended)
```bash
cd /path/to/mytravelsaathi/my_agents
./start-adk-service.sh
```

### Command Breakdown
- `adk api_server`: ADK command to start the API server
- `--host=0.0.0.0`: Bind to all network interfaces
- `--port=8081`: Port number (change if needed)
- `--verbose`: Enable detailed logging
- `.`: Current directory containing the agent

### Expected Output
```
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8081 (Press CTRL+C to quit)
```

## Testing the Service

### 1. Health Check
```bash
curl http://localhost:8081/health
```

### 2. Create a Session
```bash
curl -X POST http://localhost:8081/apps/main_agent/users/test_user/sessions \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected response:
```json
{
  "id": "session-uuid",
  "appName": "main_agent",
  "userId": "test_user",
  "state": {},
  "events": [],
  "lastUpdateTime": 1758364606.5812821
}
```

### 3. Test Agent Interaction
```bash
curl -X POST http://localhost:8081/run_sse \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "main_agent",
    "userId": "test_user",
    "sessionId": "your-session-id",
    "newMessage": {
      "parts": [{"text": "Hello! I need help finding hotels in Goa"}],
      "role": "user"
    },
    "streaming": true
  }' \
  --no-buffer
```

### 4. Using the Test Script (Recommended)
```bash
./test-adk-service.sh
```

## API Endpoints

### Core Endpoints

#### 1. Create Session
- **URL**: `POST /apps/{appName}/users/{userId}/sessions`
- **Purpose**: Create a new conversation session
- **Response**: Session object with unique ID

#### 2. Run Agent (Streaming)
- **URL**: `POST /run_sse`
- **Purpose**: Send message to agent and receive streaming response
- **Request Body**:
  ```json
  {
    "appName": "main_agent",
    "userId": "user_id",
    "sessionId": "session_id",
    "newMessage": {
      "parts": [{"text": "user message"}],
      "role": "user"
    },
    "streaming": true
  }
  ```

#### 3. Health Check
- **URL**: `GET /health`
- **Purpose**: Check if service is running

### Response Format
The streaming response uses Server-Sent Events (SSE) format:
```
data: {"content":{"parts":[{"text":"Agent response"}],"role":"model"},"partial":true,"usageMetadata":{...}}
```

## Troubleshooting

### Common Issues

#### 1. Authentication Error
**Error**: `Missing key inputs argument! To use the Google AI API, provide (api_key) arguments. To use the Google Cloud API, provide (vertexai, project & location) arguments.`

**Solution**: Ensure environment variables are set correctly:
```bash
export GOOGLE_GENAI_USE_VERTEXAI=1
export GOOGLE_CLOUD_PROJECT=your-project-id
export GOOGLE_CLOUD_LOCATION=your-region
```

#### 2. Port Already in Use
**Error**: `[Errno 48] error while attempting to bind on address ('0.0.0.0', 8081): address already in use`

**Solution**: 
- Kill existing processes: `pkill -f "adk api_server"`
- Use a different port: `--port=8082`

#### 3. SSL Certificate Issues (Local Development)
**Error**: `SSLCertVerificationError`

**Solution**: The agent automatically handles SSL issues in local development mode when `ENVIRONMENT=local` is set.

#### 4. Tool Loading Issues
**Error**: `Failed to load hotel tools`

**Solution**: 
- Check if MCP toolbox is running
- Verify `TOOLBOX_URL` environment variable
- Check network connectivity

### Debug Mode
Start with verbose logging to diagnose issues:
```bash
adk api_server --host=0.0.0.0 --port=8081 --verbose .
```

## Production Deployment

### Environment Variables for Production
```bash
export GOOGLE_GENAI_USE_VERTEXAI=1
export GOOGLE_CLOUD_PROJECT=your-production-project
export GOOGLE_CLOUD_LOCATION=your-production-region
export ENVIRONMENT=production
```

### Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8081

CMD ["sh", "-c", "export GOOGLE_GENAI_USE_VERTEXAI=1 && export GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT} && export GOOGLE_CLOUD_LOCATION=${GOOGLE_CLOUD_LOCATION} && adk api_server --host=0.0.0.0 --port=8081 ."]
```

### Google Cloud Run Deployment
```bash
gcloud run deploy travel-saathi-agent \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_GENAI_USE_VERTEXAI=1,GOOGLE_CLOUD_PROJECT=your-project,GOOGLE_CLOUD_LOCATION=us-central1,ENVIRONMENT=production
```

## Agent Capabilities

The Travel Saathi agent provides the following services:

### User Management
- User registration
- User search by name/email
- User profile management

### Hotel Services
- Search hotels by location
- Search hotels by name
- Search hotels by traveler type
- Hotel booking
- Booking history

### Travel Planning
- Places search (restaurants, attractions, nightlife)
- Travel recommendations
- Itinerary planning

### Example Usage
```bash
# Register a new user
curl -X POST http://localhost:8081/run_sse \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "main_agent",
    "userId": "user123",
    "sessionId": "session-id",
    "newMessage": {
      "parts": [{"text": "Register me: John Doe, john@example.com, 123-456-7890"}],
      "role": "user"
    },
    "streaming": true
  }'

# Search for hotels
curl -X POST http://localhost:8081/run_sse \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "main_agent",
    "userId": "user123",
    "sessionId": "session-id",
    "newMessage": {
      "parts": [{"text": "Find hotels in Paris"}],
      "role": "user"
    },
    "streaming": true
  }'
```

## Security Considerations

### Local Development
- SSL verification is disabled for local development
- Environment variables control security settings
- Use `ENVIRONMENT=local` for development

### Production
- SSL verification is enabled
- Use `ENVIRONMENT=production` for production
- Ensure proper Google Cloud credentials
- Use HTTPS in production

## Monitoring and Logs

### Log Levels
- `INFO`: General information
- `DEBUG`: Detailed debugging information
- `ERROR`: Error messages
- `WARNING`: Warning messages

### Key Log Messages
- `✅ Loaded X MCP tools`: Tools loaded successfully
- `🔧 Running in LOCAL DEVELOPMENT mode`: Development mode active
- `🚀 Running in PRODUCTION mode`: Production mode active
- `INFO: Uvicorn running on http://0.0.0.0:8081`: Server started successfully

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify environment variables
3. Check Google Cloud credentials
4. Review logs for specific error messages
5. Ensure all dependencies are installed

---

**Last Updated**: September 20, 2025
**Version**: 1.0
**Author**: Travel Saathi Development Team
