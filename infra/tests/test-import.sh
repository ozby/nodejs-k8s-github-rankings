#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Test namespace
NAMESPACE="test-import"
RELEASE_NAME="test-import"

# CI mode flag
CI_MODE=${CI:-false}

# MongoDB credentials
MONGODB_DATABASE=${MONGODB_DATABASE:-"testdb"}
MONGODB_USERNAME=${MONGODB_USERNAME:-"testuser"}
MONGODB_PASSWORD=${MONGODB_PASSWORD:-"testpass"}

echo "🚀 Starting import test..."

echo "Installing MongoDB chart..."
helm upgrade --install mongodb oci://registry-1.docker.io/bitnamicharts/mongodb \
    --namespace "$NAMESPACE" \
    --create-namespace \
    --set auth.usernames[0]="$MONGODB_USERNAME" \
    --set auth.passwords[0]="$MONGODB_PASSWORD" \
    --set auth.databases[0]="$MONGODB_DATABASE" \
    --wait

echo "Installing Helm chart..."
helm upgrade --install "$RELEASE_NAME" . \
    --namespace "$NAMESPACE" \
    --create-namespace \
    --set mongodb.host="mongodb" \
    --set mongodb.database="$MONGODB_DATABASE" \
    --set mongodb.username="$MONGODB_USERNAME" \
    --set mongodb.password="$MONGODB_PASSWORD" \
    --wait

echo "Triggering import job..."
kubectl create job --from=cronjob/"$RELEASE_NAME"-mongoimport manual-import \
    --namespace "$NAMESPACE"
echo "Waiting for job to complete..."
if ! kubectl wait --for=condition=complete job/manual-import \
    --namespace "$NAMESPACE" \
    --timeout=300s; then
    echo "Job timed out after 300s. Showing logs:"
    kubectl logs -n "$NAMESPACE" job/manual-import -c download-csv
    kubectl logs -n "$NAMESPACE" job/manual-import -c mongoimport
    exit 1
fi

# Show logs in real-time if job completes successfully
kubectl logs -n "$NAMESPACE" job/manual-import -c download-csv -f
kubectl logs -n "$NAMESPACE" job/manual-import -c mongoimport -f

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Import job completed successfully${NC}"
    
    # Get logs from init container
    echo -e "\n📥 Download container logs:"
    kubectl logs -n "$NAMESPACE" job/manual-import -c download-csv
    
    # Get logs from main container
    echo -e "\n📤 Import container logs:"
    kubectl logs -n "$NAMESPACE" job/manual-import -c mongoimport
    
    # Verify MongoDB data (requires mongosh)
    if command -v mongosh &> /dev/null; then
        echo -e "\n🔍 Verifying MongoDB data..."
        mongosh "mongodb://$MONGODB_USERNAME:$MONGODB_PASSWORD@$MONGODB_HOST/$MONGODB_DATABASE" --eval '
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const collName = `github-ranking-${yesterday.toISOString().split("T")[0]}`;
            
            // Check if collection exists
            const collections = db.getCollectionNames();
            if (collections.includes(collName)) {
                print("✅ Collection exists");
                
                // Check if data exists
                const count = db[collName].countDocuments();
                print(`📊 Document count: ${count}`);
                
                // Check if index exists
                const indexes = db[collName].getIndexes();
                const hasLanguageIndex = indexes.some(idx => idx.key.language === 1);
                if (hasLanguageIndex) {
                    print("✅ Language index exists");
                } else {
                    print("❌ Language index not found");
                    exit(1);
                }
            } else {
                print("❌ Collection not found");
                exit(1);
            }
        '
    fi
else
    echo -e "${RED}❌ Import job failed${NC}"
    kubectl logs -n "$NAMESPACE" job/manual-import -c download-csv
    kubectl logs -n "$NAMESPACE" job/manual-import -c mongoimport
    cleanup
    exit 1
fi