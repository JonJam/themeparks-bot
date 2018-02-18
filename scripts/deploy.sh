#!/bin/bash

# Setting -e and -v as pert https://docs.travis-ci.com/user/customizing-the-build/#Implementing-Complex-Build-Steps
# -e: immediately exit if any command has a non-zero exit status
# -v: print all lines in the script before executing them
# -o: prevents errors in a pipeline from being masked
set -euo pipefail

# IFS new value is less likely to cause confusing bugs when looping arrays or arguments (e.g. $@)
IFS=$'\n\t'

# Follow the steps here to create a Service Principal: https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal
az login --service-principal -u $SERVICE_PRINCIPAL_ID -p $SERVICE_PRINCIPAL_SECRET --tenant $TENANT 1> /dev/null

echo "Getting credentials for cluster..."
az aks get-credentials --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP_NAME

echo "Installing release"
helm upgrade --install "one-and-only" --set imageTag=0.0.$TRAVIS_BUILD_NUMBER,secret.luisAppUrl=$LUIS_APP_URL,secret.storageAccountName=$STORAGE_ACCOUNT_NAME,secret.storageAccountKey=$STORAGE_ACCOUNT_KEY,secret.microsoftAppId=$MICROSOFT_APP_ID,secret.microsoftAppPassword=$MICROSOFT_APP_PASSWORD ./themeparks-bot/