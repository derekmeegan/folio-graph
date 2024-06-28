#!/bin/bash

# Prompt the user for their email
read -p "Enter your Google Cloud user email: " USER_EMAIL

# Set your Google Cloud project ID and secret name
PROJECT_ID="nonprod1-svc-pd7p"
SECRET_ID="SUPABASE_KEY"
VERSION_ID="latest"  # or specify a specific version if needed

# Authenticate the user using their email
gcloud auth login "$USER_EMAIL"

# Access the secret from Google Cloud Secret Manager
SECRET_VALUE=$(gcloud secrets versions access "$VERSION_ID" --secret="$SECRET_ID" --project="$PROJECT_ID")

# Check if the secret retrieval was successful
if [ $? -ne 0 ]; then
    echo "Failed to retrieve the secret. Please check your credentials and secret details."
    exit 1
fi

# Write the secret to a .env file
echo "REACT_APP_SUPABASE_SECRET=$SECRET_VALUE" > .env

# Confirm the secret has been written to the .env file
if [ $? -eq 0 ]; then
    echo "The secret has been successfully written to .env file."
else
    echo "Failed to write the secret to .env file."
    exit 1
fi
