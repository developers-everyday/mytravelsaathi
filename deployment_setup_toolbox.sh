#!/bin/bash
set -euo pipefail

PROJECT_ID="mytravelsaathi-472115"
REGION="us-central1"
SA_NAME="toolbox-identity"

echo "🔹 Enabling required services..."
gcloud services enable run.googleapis.com \
                       cloudbuild.googleapis.com \
                       artifactregistry.googleapis.com \
                       iam.googleapis.com \
                       secretmanager.googleapis.com \
                       --project $PROJECT_ID

echo "🔹 Creating service account (if not exists)..."
gcloud iam service-accounts create $SA_NAME \
  --project $PROJECT_ID || echo "Service account $SA_NAME already exists"

echo "🔹 Granting Secret Manager access..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --role roles/secretmanager.secretAccessor

echo "🔹 Granting Cloud SQL Client role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --role roles/cloudsql.client

echo "🔹 Creating tools.yaml secret..."
if gcloud secrets describe tools --project $PROJECT_ID >/dev/null 2>&1; then
  echo "Secret already exists, adding new version..."
  gcloud secrets versions add tools --data-file=mcp-toolbox/tools.yaml --project $PROJECT_ID
else
  gcloud secrets create tools --data-file=mcp-toolbox/tools.yaml --project $PROJECT_ID
fi

echo "✅ Setup complete. You can now run Cloud Build with cloudbuild.toolbox.yaml"
