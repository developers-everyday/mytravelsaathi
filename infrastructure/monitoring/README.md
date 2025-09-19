# 🔍 My Travel Saathi - Service Monitoring

This directory contains monitoring tools and dashboards to check the health and status of your deployed My Travel Saathi services.

## 📁 Monitoring Tools

### 1. 🏥 Health Check Script
**File**: `health-check.sh`

A comprehensive bash script that checks all deployed services and provides detailed status reports.

```bash
# Run health check
./infrastructure/monitoring/health-check.sh
```

**Features:**
- ✅ Health status for all services
- ⏱️ Response time measurements
- 📊 HTTP status codes
- 🧪 API functionality tests
- 📝 Summary report

### 2. 🖥️ Monitoring Dashboard
**File**: `monitor-dashboard.html`

A beautiful web-based dashboard for real-time service monitoring.

```bash
# Open dashboard in browser
open infrastructure/monitoring/monitor-dashboard.html
# or
firefox infrastructure/monitoring/monitor-dashboard.html
```

**Features:**
- 🎨 Beautiful, responsive UI
- 🔄 Auto-refresh every 30 seconds
- 🧪 Built-in API testing tools
- 📊 Real-time status updates
- 📱 Mobile-friendly design

## 🌐 Monitored Services

| Service | URL | Health Endpoint |
|---------|-----|-----------------|
| **FastAPI Agent** | `https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app` | `/health` |
| **Flask Agent** | `https://travel-saathi-agent-flask-345761725129.us-central1.run.app` | `/health` |
| **MCP Toolbox** | `https://toolbox-345761725129.us-central1.run.app` | `/health` |
| **Maps Service** | `https://maps-service-345761725129.us-central1.run.app` | `/places-search` |

## 🧪 Testing Endpoints

### FastAPI Agent Endpoints
```bash
# Health Check
curl -X GET https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app/health

# Agent Info
curl -X GET https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app/info

# Chat
curl -X POST https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello! Can you help me plan a trip?"}'

# Streaming Chat
curl -X POST https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about travel planning"}'

# API Documentation
open https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app/docs
```

### Flask Agent Endpoints
```bash
# Health Check
curl -X GET https://travel-saathi-agent-flask-345761725129.us-central1.run.app/health

# Agent Info
curl -X GET https://travel-saathi-agent-flask-345761725129.us-central1.run.app/info

# Chat
curl -X POST https://travel-saathi-agent-flask-345761725129.us-central1.run.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello! Can you help me plan a trip?"}'
```

## 📊 Monitoring Best Practices

### 1. Regular Health Checks
```bash
# Add to crontab for automated monitoring
# Check every 5 minutes
*/5 * * * * /path/to/mytravelsaathi/infrastructure/monitoring/health-check.sh

# Or use the dashboard for manual checks
```

### 2. Alert Setup
- Monitor response times > 5 seconds
- Alert on HTTP status codes != 200
- Check for service unavailability

### 3. Log Monitoring
```bash
# Check Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Check specific service logs
gcloud logging read "resource.labels.service_name=travel-saathi-agent-fastapi" --limit=20
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Service Unavailable (503)
- **Cause**: Service is starting up or crashed
- **Solution**: Wait a few minutes, check Cloud Run console

#### 2. SSL Certificate Errors
- **Cause**: Certificate verification issues
- **Solution**: Use `-k` flag with curl for testing

#### 3. CORS Errors
- **Cause**: Cross-origin requests blocked
- **Solution**: Check CORS configuration in FastAPI/Flask

#### 4. Timeout Errors
- **Cause**: Service taking too long to respond
- **Solution**: Check Cloud Run timeout settings

### Debug Commands
```bash
# Check Cloud Run service status
gcloud run services list

# Check service details
gcloud run services describe travel-saathi-agent-fastapi --region=us-central1

# Check recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=travel-saathi-agent-fastapi" --limit=20 --format="table(timestamp,severity,textPayload)"
```

## 📈 Performance Metrics

### Expected Response Times
- **Health Check**: < 1 second
- **Info Endpoint**: < 2 seconds
- **Chat Endpoint**: < 10 seconds
- **Streaming**: Real-time chunks

### Resource Limits
- **Memory**: 2GB per instance
- **CPU**: 2 vCPU per instance
- **Timeout**: 15 minutes
- **Max Instances**: 10

## 🔄 Automated Monitoring

### GitHub Actions (Optional)
Create `.github/workflows/monitor.yml`:
```yaml
name: Service Monitoring
on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Health Check
        run: ./infrastructure/monitoring/health-check.sh
```

---

## 🎯 Quick Start

1. **Run Health Check**: `./infrastructure/monitoring/health-check.sh`
2. **Open Dashboard**: `open infrastructure/monitoring/monitor-dashboard.html`
3. **Test API**: Use the dashboard's test buttons or curl commands above

Your services are being monitored! 🚀
