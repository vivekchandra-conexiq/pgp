'use strict';

const fs = require('fs');
const openpgp = require('openpgp'); 
openpgp.initWorker({ path:'openpgp.worker.js' });

var pubKey = fs.readFileSync('./keys/brian.pub', 'utf8'); 
var fileToEncrypt = fs.readFileSync('./sample/sample.txt', 'utf8'); 
var encrytedFile = './sample/sample.txt.enc';

async function main() {
    const options = {
        message: openpgp.message.fromText(fileToEncrypt),       
        publicKeys: (await openpgp.key.readArmored(pubKey)).keys
    }
    
    openpgp.encrypt(options).then(ciphertext => {
        var encrypted = ciphertext.data
        return encrypted
    })
    .then(encrypted => {
        fs.writeFile( encrytedFile, encrypted, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    });
}
main();