'use strict';

const fs = require('fs');
const openpgp = require('openpgp'); 
openpgp.initWorker({ path:'openpgp.worker.js' });

var privKey = fs.readFileSync('./keys/sample.key', 'utf8'); 
var fileToDecrypt = fs.readFileSync('./files/sample.txt.enc', 'utf8'); 
var decrytedFile = './files/sample_decrypted.txt';
var password = 'password123';

async function main() {
    var privKeyObj = await openpgp.key.readArmored(privKey);
    await privKeyObj.keys[0].decrypt(password);

    const options = {
        message: await openpgp.message.readArmored(fileToDecrypt),
        privateKeys: privKeyObj.keys[0],
    }

    openpgp.decrypt(options).then(plaintext => {
        var plaintext = plaintext.data
        return plaintext
    })
    .then(plaintext => {
        fs.writeFile( decrytedFile, plaintext, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    });
}
main();