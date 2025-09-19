#!/bin/bash

# =============================================================================
# Quick Service Check Script
# =============================================================================
# Simple script for quick service status checks
# =============================================================================

FASTAPI_URL="https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app"

echo "🚀 Quick Service Check - My Travel Saathi"
echo "========================================="
echo ""

# Quick health check
echo "🔍 Checking FastAPI Agent health..."
if curl -s -f "$FASTAPI_URL/health" > /dev/null 2>&1; then
    echo "✅ FastAPI Agent: HEALTHY"
    
    # Quick chat test
    echo ""
    echo "🧪 Testing chat functionality..."
    response=$(curl -s -X POST "$FASTAPI_URL/chat" \
        -H "Content-Type: application/json" \
        -d '{"message": "Hello! Quick test."}' 2>/dev/null)
    
    if [[ "$response" == *"Travel Saathi"* ]]; then
        echo "✅ Chat endpoint: WORKING"
        echo "📝 Response preview: $(echo "$response" | head -c 100)..."
    else
        echo "⚠️  Chat endpoint: RESPONSE UNEXPECTED"
        echo "📝 Response: $response"
    fi
    
    echo ""
    echo "🔗 Service URLs:"
    echo "   API: $FASTAPI_URL"
    echo "   Docs: $FASTAPI_URL/docs"
    echo "   Health: $FASTAPI_URL/health"
    
else
    echo "❌ FastAPI Agent: DOWN"
    echo "🔗 URL: $FASTAPI_URL/health"
fi

echo ""
echo "💡 For detailed monitoring, run: ./infrastructure/monitoring/health-check.sh"
echo "🖥️  For dashboard, open: infrastructure/monitoring/monitor-dashboard.html"
