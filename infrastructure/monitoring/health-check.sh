#!/bin/bash

# =============================================================================
# My Travel Saathi Agent Health Check Script
# =============================================================================
# This script checks the health and status of deployed services
# =============================================================================

set -euo pipefail

# Configuration
FASTAPI_URL="https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app"
FLASK_URL="https://travel-saathi-agent-flask-345761725129.us-central1.run.app"
TOOLBOX_URL="https://toolbox-345761725129.us-central1.run.app"
MAPS_SERVICE_URL="https://maps-service-345761725129.us-central1.run.app/places-search"

echo "🏥 My Travel Saathi - Service Health Check"
echo "=========================================="
echo ""

# Function to check service health
check_service() {
    local service_name="$1"
    local url="$2"
    local endpoint="$3"
    
    echo "🔍 Checking $service_name..."
    
    if curl -s -f "$url$endpoint" > /dev/null 2>&1; then
        echo "✅ $service_name: HEALTHY"
        
        # Get response time
        response_time=$(curl -s -w "%{time_total}" -o /dev/null "$url$endpoint")
        echo "   ⏱️  Response time: ${response_time}s"
        
        # Get status code
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url$endpoint")
        echo "   📊 Status code: $status_code"
        
        return 0
    else
        echo "❌ $service_name: UNHEALTHY"
        echo "   🔗 URL: $url$endpoint"
        return 1
    fi
}

# Function to test API functionality
test_api_functionality() {
    local service_name="$1"
    local url="$2"
    
    echo ""
    echo "🧪 Testing $service_name API functionality..."
    
    # Test health endpoint
    echo "   🔍 Testing health endpoint..."
    if curl -s -f "$url/health" > /dev/null 2>&1; then
        echo "   ✅ Health endpoint: OK"
    else
        echo "   ❌ Health endpoint: FAILED"
        return 1
    fi
    
    # Test info endpoint
    echo "   🔍 Testing info endpoint..."
    if curl -s -f "$url/info" > /dev/null 2>&1; then
        echo "   ✅ Info endpoint: OK"
    else
        echo "   ❌ Info endpoint: FAILED"
        return 1
    fi
    
    # Test chat endpoint
    echo "   🔍 Testing chat endpoint..."
    response=$(curl -s -X POST "$url/chat" \
        -H "Content-Type: application/json" \
        -d '{"message": "Hello, test message"}' 2>/dev/null || echo "FAILED")
    
    if [[ "$response" != "FAILED" && "$response" == *"Travel Saathi"* ]]; then
        echo "   ✅ Chat endpoint: OK"
    else
        echo "   ❌ Chat endpoint: FAILED"
        echo "   📝 Response: $response"
        return 1
    fi
    
    return 0
}

# Main health checks
echo "🌐 Checking deployed services..."
echo ""

# Check FastAPI service
if check_service "Travel Saathi Agent (FastAPI)" "$FASTAPI_URL" "/health"; then
    test_api_functionality "FastAPI Agent" "$FASTAPI_URL"
    fastapi_healthy=true
else
    fastapi_healthy=false
fi

echo ""

# Check Flask service
if check_service "Travel Saathi Agent (Flask)" "$FLASK_URL" "/health"; then
    test_api_functionality "Flask Agent" "$FLASK_URL"
    flask_healthy=true
else
    flask_healthy=false
fi

echo ""

# Check Toolbox service
if check_service "MCP Toolbox" "$TOOLBOX_URL" "/health"; then
    toolbox_healthy=true
else
    toolbox_healthy=false
fi

echo ""

# Check Maps service
if check_service "Maps Service" "$MAPS_SERVICE_URL" ""; then
    maps_healthy=true
else
    maps_healthy=false
fi

echo ""
echo "📊 Summary Report"
echo "================="

if [ "$fastapi_healthy" = true ]; then
    echo "✅ FastAPI Agent: OPERATIONAL"
    echo "   🔗 URL: $FASTAPI_URL"
    echo "   📚 Docs: $FASTAPI_URL/docs"
else
    echo "❌ FastAPI Agent: DOWN"
fi

if [ "$flask_healthy" = true ]; then
    echo "✅ Flask Agent: OPERATIONAL"
    echo "   🔗 URL: $FLASK_URL"
else
    echo "❌ Flask Agent: DOWN"
fi

if [ "$toolbox_healthy" = true ]; then
    echo "✅ MCP Toolbox: OPERATIONAL"
    echo "   🔗 URL: $TOOLBOX_URL"
else
    echo "❌ MCP Toolbox: DOWN"
fi

if [ "$maps_healthy" = true ]; then
    echo "✅ Maps Service: OPERATIONAL"
    echo "   🔗 URL: $MAPS_SERVICE_URL"
else
    echo "❌ Maps Service: DOWN"
fi

echo ""
if [ "$fastapi_healthy" = true ] || [ "$flask_healthy" = true ]; then
    echo "🎉 My Travel Saathi is ready to help with travel planning!"
else
    echo "⚠️  Main services are down. Check deployment logs."
fi
