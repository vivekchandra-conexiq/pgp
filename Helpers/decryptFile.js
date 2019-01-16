'use strict';

const fs = require('fs');
const openpgp = require('openpgp'); 
openpgp.initWorker({ path:'openpgp.worker.js' });

var privKey = fs.readFileSync('./brian.key', 'utf8'); 
var fileToDecrypt = fs.readFileSync('./sample.txt.enc', 'utf8'); 
var decrytedFile = './sample_decrypted.txt';

async function main() {
    var privKeyObj = await openpgp.key.readArmored(privKey);
    await privKeyObj.keys[0].decrypt('password123');

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