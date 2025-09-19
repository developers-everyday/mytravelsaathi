#!/bin/bash

# ----------------------------
# Cloud Run Deployment Script for My Travel Saathi Agent (Flask Version)
# ----------------------------

set -e  # Exit on any error

# ----------------------------
# Configuration
# ----------------------------
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"mytravelsaathi-472115"}
REGION=${GOOGLE_CLOUD_LOCATION:-"us-central1"}
SERVICE_NAME="travel-saathi-agent-flask"
TOOLBOX_URL=${TOOLBOX_URL:-"https://toolbox-345761725129.us-central1.run.app"}
MAPS_SERVICE_URL=${MAPS_SERVICE_URL:-"https://maps-service-345761725129.us-central1.run.app/places-search"}

echo "🚀 Deploying My Travel Saathi Agent (Flask) to Cloud Run..."
echo "📋 Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service Name: $SERVICE_NAME"
echo "  Toolbox URL: $TOOLBOX_URL"
echo "  Maps Service URL: $MAPS_SERVICE_URL"
echo "  Framework: Flask"
echo ""

# ----------------------------
# Enable Required APIs
# ----------------------------
echo "🔧 Enabling required APIs..."
gcloud services enable \
    aiplatform.googleapis.com \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    cloudresourcemanager.googleapis.com \
    sqladmin.googleapis.com \
    --project=$PROJECT_ID

# ----------------------------
# Deploy to Cloud Run
# ----------------------------
echo "📦 Building and deploying Flask version to Cloud Run..."

gcloud run deploy $SERVICE_NAME \
    --source . \
    --port 8080 \
    --project $PROJECT_ID \
    --allow-unauthenticated \
    --region $REGION \
    --set-env-vars="TOOLBOX_URL=$TOOLBOX_URL,MAPS_SERVICE_URL=$MAPS_SERVICE_URL,SERVER_TYPE=flask" \
    --memory=2Gi \
    --cpu=2 \
    --max-instances=10 \
    --min-instances=0 \
    --concurrency=10 \
    --timeout=900

# ----------------------------
# Get Service URL
# ----------------------------
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --project=$PROJECT_ID \
    --format="value(status.url)")

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📚 Available endpoints:"
echo "  Health Check: $SERVICE_URL/health"
echo "  Agent Info: $SERVICE_URL/info"
echo "  Run Agent (Simple): $SERVICE_URL/run"
echo "  Run Agent (Streaming): $SERVICE_URL/run_sse"
echo ""
echo "🧪 Test the deployment:"
echo "  curl -X GET $SERVICE_URL/health"
echo "  curl -X POST $SERVICE_URL/run -H 'Content-Type: application/json' -d '{\"message\": \"Hello!\"}'"
echo ""
echo "🎉 My Travel Saathi Agent is now live and ready to help users plan their trips!"
