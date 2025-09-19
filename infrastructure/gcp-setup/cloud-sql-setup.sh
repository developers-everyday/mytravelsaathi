#!/bin/bash

# =============================================================================
# Cloud SQL Instance Setup Script
# =============================================================================
# This script creates a PostgreSQL Cloud SQL instance for My Travel Saathi
# =============================================================================

set -euo pipefail

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"mytravelsaathi-472115"}
REGION="us-central1"
INSTANCE_NAME="hoteldb-instance"
DATABASE_VERSION="POSTGRES_15"
TIER="db-g1-small"
ROOT_PASSWORD="postgres"

echo "🚀 Setting up Cloud SQL instance for My Travel Saathi..."
echo "📋 Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Instance Name: $INSTANCE_NAME"
echo "  Region: $REGION"
echo "  Database Version: $DATABASE_VERSION"
echo "  Tier: $TIER"
echo ""

# Create Cloud SQL instance
echo "🔧 Creating Cloud SQL instance..."
gcloud sql instances create $INSTANCE_NAME \
    --database-version=$DATABASE_VERSION \
    --tier=$TIER \
    --region=$REGION \
    --edition=ENTERPRISE \
    --root-password=$ROOT_PASSWORD \
    --project=$PROJECT_ID

echo ""
echo "✅ Cloud SQL instance created successfully!"
echo "🌐 Instance: $INSTANCE_NAME"
echo "🔗 Connection: $INSTANCE_NAME.$PROJECT_ID.$REGION"
echo ""
echo "📝 Next steps:"
echo "  1. Run database setup: ./database/setup/01-create-tables.sql"
echo "  2. Insert sample data: ./database/setup/02-insert-sample-data.sql"
echo "  3. Test connection from your application"
echo ""
echo "🎉 Database infrastructure is ready!"
