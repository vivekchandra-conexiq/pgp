var fs = require('fs');
var openpgp = require('openpgp'); 
openpgp.initWorker({ path:'openpgp.worker.js' });

console.log("Initialized");
var options = {
    userIds: [{ name:'Sample User', email:'user@sample.com' }],
    passphrase: 'password123'
};

var keyFileName = "./keys/sample";

console.log("Created Options");
openpgp.generateKey(options).then(function(key) {
    var privkey = key.privateKeyArmored; 
    var pubkey = key.publicKeyArmored;   

    fs.writeFile( keyFileName + ".pub", pubkey, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The Public Key File was saved!");
    }); 

    fs.writeFile( keyFileName + ".key", privkey, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The Private Key File was saved!");
    }); 
});

