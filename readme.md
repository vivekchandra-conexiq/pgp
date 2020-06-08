# Open PGP with Azure Functions Blob Triggers
This repository is a demo of how to use OpenPGP.js with Azure Functions to decrypt files placed in a Azure Blob container.  The function will trigger when a file is uploaded to the source container and the decrypted file will be placed in an output container. 

git clone https://github.com/briandenicola/azure-functions-openpgp

# Setup
## PreReqs
* PGP Keys - If you do not have a PGP key then you can use the generateKey.js script create a pair that can be used for testing.  
* An encrypted file - If you do not have an encrypt file then you can use the encryptFile.js to encrypt a file
* Access to Azure DevOps, Visual Studio Code, Azure Function Core Tools or another CI/CD tool to publish to Azure Functions. This document will show how to publish using the Function tools.

### Generate Keys
* cd Scripts
* mkdir keys
* npm install
* npm run generate 
    * Note - This will create a pub/private key with a Password of Password123.

### Encrypt File
* rm files/*
* echo HelloWorld >> files/sample.txt
* npm run encrypt - creates a file name sample.txt.enc
* npm run decrypt - creates a file name sample_decrypted.txt

## Azure Environment 
* cd Infrastructure 
* key=$(cat keys/sample.key | base64)
* .\create_azure_resources.sh DemoRG southcentralus pgptestfunc01 $key 'Password123'  
    * Replace the pgptestfunc01 and 'Password123' with values appropriate for your setup.

### Notes
* This will setup the following in Azure:
    * Key Vault
    * Azure Storage Account with two Blob containers - sample-workitems and sample-output
        * The name of the account will be $}functionName}sa
    * Azure Function Host
* The script will create an Manage Identity for the Azure Functions and assign that to the access policies on the Key Vault.  
* It will upload PGP private key and password to Key Vault as secrets
* The script will also create Application Settings to access those secrets. 
    * It uses the format @Microsoft.KeyVault(SecretUri={keyVaultSecretUri})
    * This format uses the Managed Identity to access KeyVault and assign the secret to the Application Setting.
    * The code will access the secrets via an Environmental Variable.
    * Without any code, you can access application secrets stored in Key Vault securely! No more plumbing code to get an oAuth token with a client id/secret

## Publish Code Azure Function
* cd functionapp/
* func azure functionapp publish pgptestfunc01

## Test
* Upload an encrypted file (samep.txt.enc if you used the sameple scripts in this repo)  to the Azure Blob container - sample-workitems
    * key=$(az storage account keys list -n pgptestfunc01sa --query "[0].value" -o tsv)
    * az storage blob upload -f Scripts/files/sample.txt.enc -c sample-workitems -n sample.txt.enc --account-key $key --acount-name pgptestfunc01sa
* The file encrypted should be created in sample-output



