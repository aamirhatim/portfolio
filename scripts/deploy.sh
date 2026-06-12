#!/bin/bash

# Configuration
REQUIRED_EMAIL="aamirhatim.h@gmail.com"

# 1. Check firebase login
echo "Checking Firebase login status..."
# Use 2>&1 to capture both stdout and stderr
LOGIN_STATUS=$(firebase login 2>&1)

if [[ $LOGIN_STATUS == *"Already logged in as $REQUIRED_EMAIL"* ]]; then
    echo "Successfully verified login as $REQUIRED_EMAIL."
else
    echo "Error: Firebase is not logged in as $REQUIRED_EMAIL."
    echo "Current status summary:"
    # Print only the line containing "Already logged in as" or the whole thing if not found
    echo "$LOGIN_STATUS" | grep "Already logged in as" || echo "$LOGIN_STATUS"
    exit 1
fi

# 2. Run build
echo "----------------------------------------"
echo "Running build: npm run build..."
if npm run build; then
    echo "Build succeeded."
else
    echo "Error: Build failed."
    exit 1
fi

# 3. Deploy
echo "----------------------------------------"
echo "Deploying to Firebase hosting..."
if firebase deploy --only hosting; then
    echo "----------------------------------------"
    echo "Deployment successful!"
else
    echo "----------------------------------------"
    echo "Error: Deployment failed."
    exit 1
fi
