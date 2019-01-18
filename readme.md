# Open PGP with Azure Functions Blob Triggers
More details to come. 

# Setup
* git clone https://github.com/bjd145/OpenPGPwithAzureFunctions
* cd Infrastructure 
* .\create_azure_resources.sh 

# Scripts
## Generate Keys
* cd Scripts
* mkdir keys
* npm install
* npm run generate 
* Note - This will create a pub/private key with a Password of Password123. This should be changed 

## Encrypt File
* del sample\*
* echo HelloWorld >> sample.txt
* npm run encrypt (creates a file name sample.txt.enc)
* npm run decrypt  (creates a file name sample_decrypted.txt) 

# Key Vault
## Secrets
## Access Policies

# Azure Function
## Code
## Trigger
## Output
## Application Settings




