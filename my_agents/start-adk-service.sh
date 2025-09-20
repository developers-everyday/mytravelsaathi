#!/bin/bash

# Travel Saathi ADK Service Startup Script
# This script starts the ADK API server with proper environment configuration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="mytravelsaathi-472115"
LOCATION="us-central1"
PORT=${PORT:-8081}
HOST=${HOST:-"0.0.0.0"}
ENVIRONMENT=${ENVIRONMENT:-"local"}

echo -e "${BLUE}🚀 Starting Travel Saathi ADK Service${NC}"
echo -e "${BLUE}=====================================${NC}"

# Check if we're in the right directory
if [ ! -d "main_agent" ]; then
    echo -e "${RED}❌ Error: main_agent directory not found. Please run this script from the my_agents directory.${NC}"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "main_agent/fastapi_env" ]; then
    echo -e "${RED}❌ Error: Virtual environment 'main_agent/fastapi_env' not found.${NC}"
    echo -e "${YELLOW}💡 Please create the virtual environment first:${NC}"
    echo -e "${YELLOW}   cd main_agent${NC}"
    echo -e "${YELLOW}   python -m venv fastapi_env${NC}"
    echo -e "${YELLOW}   source fastapi_env/bin/activate${NC}"
    echo -e "${YELLOW}   pip install -r requirements.txt${NC}"
    exit 1
fi

# Activate virtual environment
echo -e "${YELLOW}🔧 Activating virtual environment...${NC}"
source main_agent/fastapi_env/bin/activate

# Check if ADK is installed
if ! command -v adk &> /dev/null; then
    echo -e "${RED}❌ Error: ADK command not found. Please install Google ADK.${NC}"
    exit 1
fi

# Set environment variables
echo -e "${YELLOW}🔧 Setting environment variables...${NC}"
export GOOGLE_GENAI_USE_VERTEXAI=1
export GOOGLE_CLOUD_PROJECT=$PROJECT_ID
export GOOGLE_CLOUD_LOCATION=$LOCATION
export ENVIRONMENT=$ENVIRONMENT

echo -e "${GREEN}✅ Environment configured:${NC}"
echo -e "${GREEN}   GOOGLE_GENAI_USE_VERTEXAI=1${NC}"
echo -e "${GREEN}   GOOGLE_CLOUD_PROJECT=$PROJECT_ID${NC}"
echo -e "${GREEN}   GOOGLE_CLOUD_LOCATION=$LOCATION${NC}"
echo -e "${GREEN}   ENVIRONMENT=$ENVIRONMENT${NC}"

# Check if port is available
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port $PORT is already in use. Attempting to kill existing processes...${NC}"
    pkill -f "adk api_server" || true
    sleep 2
fi

# Start the ADK API server
echo -e "${BLUE}🚀 Starting ADK API server on $HOST:$PORT...${NC}"
echo -e "${YELLOW}💡 Press Ctrl+C to stop the server${NC}"
echo -e "${BLUE}=====================================${NC}"

# Start the server (we're already in the my_agents directory)
adk api_server --host=$HOST --port=$PORT --verbose .

echo -e "${GREEN}✅ ADK Service stopped successfully${NC}"
