var fs = require('fs');
var openpgp = require('openpgp'); 
openpgp.initWorker({ path:'openpgp.worker.js' });

console.log("Initialized");
var options = {
    userIds: [{ name:'Brian Denicola', email:'brdenico@microsoft.com' }],
    passphrase: 'password123'
};

console.log("Created Options");
openpgp.generateKey(options).then(function(key) {
    var privkey = key.privateKeyArmored; 
    var pubkey = key.publicKeyArmored;   
    console.log("Public Key" + pubkey);

    fs.writeFile("./brian.pub", pubkey, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    fs.writeFile("./brian.key", privkey, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
});

