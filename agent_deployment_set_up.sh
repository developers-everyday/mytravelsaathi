#!/bin/bash
set -euo pipefail

# Project + Region
export GOOGLE_CLOUD_PROJECT="mytravelsaathi-472115"
export GOOGLE_CLOUD_LOCATION="us-central1"

# Agent App Config
export AGENT_PATH="my_agents/hotel_agent_app/"
export SERVICE_NAME="hotels-service"
export APP_NAME="hotels-app"

# External services
export TOOLBOX_URL="https://toolbox-345761725129.us-central1.run.app"
export MAPS_SERVICE_URL="https://maps-service-345761725129.us-central1.run.app/places-search"

# Use Vertex AI for reasoning
export GOOGLE_GENAI_USE_VERTEXAI=True

echo "✅ Environment variables set:"
echo "  GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT"
echo "  GOOGLE_CLOUD_LOCATION=$GOOGLE_CLOUD_LOCATION"
echo "  AGENT_PATH=$AGENT_PATH"
echo "  SERVICE_NAME=$SERVICE_NAME"
echo "  APP_NAME=$APP_NAME"
echo "  TOOLBOX_URL=$TOOLBOX_URL"
echo "  MAPS_SERVICE_URL=$MAPS_SERVICE_URL"
echo "  GOOGLE_GENAI_USE_VERTEXAI=$GOOGLE_GENAI_USE_VERTEXAI"

