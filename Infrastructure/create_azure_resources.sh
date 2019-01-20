#!/bin/bash

export RG=$1
export location=$2
export functionAppName=$3
export pgpKey=$4
export pgpPassword=$5

az login 
az group create -n $RG -l $location

funcStorageName=${functionAppName}sa
keyVaultName=${functionAppName}keyvault001

# Create an Azure Function with storage accouunt in the resource group.
az storage account create --name $funcStorageName --location $location --resource-group $RG --sku Standard_LRS
az functionapp create --name $functionAppName --storage-account $funcStorageName --consumption-plan-location $location --resource-group $RG
az functionapp identity assign --name $functionAppName --resource-group $RG
functionAppId="$(az functionapp identity show --name $functionAppName --resource-group $RG --query 'principalId' --output tsv)"

#Ceate containers 
key=$(az storage account keys list -n $funcStorageName --query "[0].value" -o tsv)
az storage container create --name 'samples-workitems' --account-key $key --account-name $funcStorageName
az storage container create --name 'sample-output' --account-key $key --account-name $funcStorageName

# Create Key Vault 
az keyvault create --name $keyVaultName --resource-group $RG --location $location 
az keyvault set-policy --name $keyVaultName --object-id $functionAppId --secret-permissions get

pgpKeyId="$(az keyvault secret set --vault-name $keyVaultName --name GPGPrivateKey --value $pgpKey --query 'id' --output tsv)"
pgpPasswordId="$(az keyvault secret set --vault-name $keyVaultName --name PrivateKeyPassword --value $pgpPassword --query 'id' --output tsv)"

az functionapp config appsettings set -g $RG -n $functionAppName --settings GPGPrivateKey="@Microsoft.KeyVault(SecretUri=$pgpKeyId)"
az functionapp config appsettings set -g $RG -n $functionAppName --settings PrivateKeyPassword="@Microsoft.KeyVault(SecretUri=$pgpPasswordId)"