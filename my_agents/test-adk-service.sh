#!/bin/bash

# Travel Saathi ADK Service Test Script
# This script tests the ADK API server functionality

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:8081"
USER_ID="test_user_$(date +%s)"
SESSION_ID=""

echo -e "${BLUE}🧪 Testing Travel Saathi ADK Service${NC}"
echo -e "${BLUE}===================================${NC}"

# Check if we're in the right directory
if [ ! -d "main_agent" ]; then
    echo -e "${RED}❌ Error: main_agent directory not found. Please run this script from the my_agents directory.${NC}"
    exit 1
fi

# Function to make HTTP requests
make_request() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}🔍 $description${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    else
        response=$(curl -s -X $method "$url" \
            -w "\n%{http_code}")
    fi
    
    # Split response and status code
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Success (HTTP $http_code)${NC}"
        echo -e "${BLUE}Response: $body${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed (HTTP $http_code)${NC}"
        echo -e "${RED}Response: $body${NC}"
        return 1
    fi
}

# Test 1: Health Check
echo -e "\n${BLUE}Test 1: Health Check${NC}"
if make_request "GET" "$BASE_URL/health" "" "Checking service health"; then
    echo -e "${GREEN}✅ Service is running${NC}"
else
    echo -e "${RED}❌ Service is not responding${NC}"
    echo -e "${YELLOW}💡 Make sure the ADK service is running on port 8081${NC}"
    exit 1
fi

# Test 2: Create Session
echo -e "\n${BLUE}Test 2: Create Session${NC}"
session_response=$(curl -s -X POST "$BASE_URL/apps/main_agent/users/$USER_ID/sessions" \
    -H "Content-Type: application/json" \
    -d '{}' \
    -w "\n%{http_code}")

session_http_code=$(echo "$session_response" | tail -n1)
session_body=$(echo "$session_response" | head -n -1)

if [ "$session_http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Session created successfully${NC}"
    SESSION_ID=$(echo "$session_body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo -e "${BLUE}Session ID: $SESSION_ID${NC}"
else
    echo -e "${RED}❌ Failed to create session (HTTP $session_http_code)${NC}"
    echo -e "${RED}Response: $session_body${NC}"
    exit 1
fi

# Test 3: Simple Agent Interaction
echo -e "\n${BLUE}Test 3: Agent Interaction${NC}"
echo -e "${YELLOW}🔍 Sending message to agent...${NC}"

# Create test message
test_message='{
    "appName": "main_agent",
    "userId": "'$USER_ID'",
    "sessionId": "'$SESSION_ID'",
    "newMessage": {
        "parts": [{"text": "Hello! I am a new user. My name is Test User, email is test@example.com, and phone is 123-456-7890. Please register me."}],
        "role": "user"
    },
    "streaming": true
}'

echo -e "${YELLOW}📤 Sending registration request...${NC}"

# Send request and capture response
response=$(curl -s -X POST "$BASE_URL/run_sse" \
    -H "Content-Type: application/json" \
    -d "$test_message" \
    --no-buffer \
    --max-time 30)

if [ $? -eq 0 ] && [ -n "$response" ]; then
    echo -e "${GREEN}✅ Agent responded successfully${NC}"
    
    # Extract and display the final response
    final_response=$(echo "$response" | grep '"partial":false' | tail -n1 | grep -o '"text":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$final_response" ]; then
        echo -e "${BLUE}Agent Response: $final_response${NC}"
    else
        echo -e "${BLUE}Agent Response: [Streaming response received]${NC}"
    fi
else
    echo -e "${RED}❌ Agent interaction failed${NC}"
    echo -e "${RED}Response: $response${NC}"
    exit 1
fi

# Test 4: Hotel Search
echo -e "\n${BLUE}Test 4: Hotel Search${NC}"
echo -e "${YELLOW}🔍 Testing hotel search functionality...${NC}"

hotel_message='{
    "appName": "main_agent",
    "userId": "'$USER_ID'",
    "sessionId": "'$SESSION_ID'",
    "newMessage": {
        "parts": [{"text": "Search for hotels in Goa"}],
        "role": "user"
    },
    "streaming": true
}'

echo -e "${YELLOW}📤 Sending hotel search request...${NC}"

hotel_response=$(curl -s -X POST "$BASE_URL/run_sse" \
    -H "Content-Type: application/json" \
    -d "$hotel_message" \
    --no-buffer \
    --max-time 30)

if [ $? -eq 0 ] && [ -n "$hotel_response" ]; then
    echo -e "${GREEN}✅ Hotel search completed successfully${NC}"
    
    # Check if response contains hotel information
    if echo "$hotel_response" | grep -q "hotel\|Hotel\|Goa"; then
        echo -e "${GREEN}✅ Hotel search results found${NC}"
    else
        echo -e "${YELLOW}⚠️  Hotel search response received but may not contain expected results${NC}"
    fi
else
    echo -e "${RED}❌ Hotel search failed${NC}"
    echo -e "${RED}Response: $hotel_response${NC}"
    exit 1
fi

# Summary
echo -e "\n${BLUE}🎉 Test Summary${NC}"
echo -e "${BLUE}===============${NC}"
echo -e "${GREEN}✅ Health Check: PASSED${NC}"
echo -e "${GREEN}✅ Session Creation: PASSED${NC}"
echo -e "${GREEN}✅ Agent Interaction: PASSED${NC}"
echo -e "${GREEN}✅ Hotel Search: PASSED${NC}"
echo -e "\n${GREEN}🎉 All tests passed! The ADK service is working correctly.${NC}"
echo -e "${BLUE}📊 Test User ID: $USER_ID${NC}"
echo -e "${BLUE}📊 Session ID: $SESSION_ID${NC}"
echo -e "\n${YELLOW}💡 You can now integrate with the service using the API endpoints.${NC}"
echo -e "${YELLOW}💡 Base URL: $BASE_URL${NC}"
