# Travel Saathi Agents

This directory contains all the Travel Saathi agents and their configurations.

## Quick Start

### 1. Start the ADK Service (Recommended)
```bash
./start-adk-service.sh
```

### 2. Test the Service
```bash
./test-adk-service.sh
```

## Directory Structure

```
my_agents/
├── main_agent/                    # Main Travel Saathi agent
│   ├── agent.py                   # Agent implementation
│   ├── server_fastapi.py          # FastAPI server (alternative)
│   ├── requirements.txt           # Dependencies
│   └── fastapi_env/               # Virtual environment
├── start-adk-service.sh           # ADK service startup script
├── test-adk-service.sh            # Service testing script
├── ADK-SERVICE-MODE-GUIDE.md      # Complete service mode documentation
└── README.md                      # This file
```

## Available Agents

### Main Agent (`main_agent/`)
The primary Travel Saathi agent that provides:
- User registration and management
- Hotel search and booking
- Travel planning and recommendations
- Places search (restaurants, attractions, nightlife)

## Service Mode Documentation

For detailed information on running agents in service mode, see:
- **[ADK-SERVICE-MODE-GUIDE.md](./ADK-SERVICE-MODE-GUIDE.md)** - Complete guide for ADK service mode
- **[main_agent/README.md](./main_agent/README.md)** - Main agent specific documentation

## Quick Commands

### Start ADK Service
```bash
./start-adk-service.sh
```

### Test Service
```bash
./test-adk-service.sh
```

### Manual Start
```bash
cd main_agent
source fastapi_env/bin/activate
export GOOGLE_GENAI_USE_VERTEXAI=1
export GOOGLE_CLOUD_PROJECT=mytravelsaathi-472115
export GOOGLE_CLOUD_LOCATION=us-central1
cd ..
adk api_server --host=0.0.0.0 --port=8081 --verbose .
```

## Environment Variables

### Required for ADK Service
```bash
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=mytravelsaathi-472115
GOOGLE_CLOUD_LOCATION=us-central1
ENVIRONMENT=local  # or 'production'
```

## API Endpoints

When running in ADK service mode:
- `GET /health` - Health check
- `POST /apps/main_agent/users/{userId}/sessions` - Create session
- `POST /run_sse` - Run agent with streaming responses

## Troubleshooting

### Common Issues
1. **Authentication Error**: Ensure `GOOGLE_GENAI_USE_VERTEXAI=1` is set
2. **Port in Use**: Kill existing processes with `pkill -f "adk api_server"`
3. **SSL Issues**: Set `ENVIRONMENT=local` for development

### Debug Mode
```bash
adk api_server --host=0.0.0.0 --port=8081 --verbose .
```

## Integration Examples

### cURL Example
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

## Development vs Production

### Local Development
- SSL verification disabled
- Detailed logging enabled
- Mock data fallbacks available

### Production
- SSL verification enabled
- Optimized logging
- Full Google Cloud integration

## Support

For detailed information, see:
- `ADK-SERVICE-MODE-GUIDE.md` - Complete service mode documentation
- `main_agent/README.md` - Main agent specific documentation
- `main_agent/DEPLOYMENT-GUIDE.md` - Production deployment guide

---

**Last Updated**: September 20, 2025
**Version**: 1.0
