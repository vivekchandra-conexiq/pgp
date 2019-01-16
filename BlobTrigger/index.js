module.exports = async function (context, encryptedBlob, decryptedBlob) {
    context.log("JavaScript blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", encryptedBlob.length, "Bytes");

    var openpgp = require('openpgp'); 
    openpgp.initWorker({ path:'openpgp.worker.js' })

    var password = process.env.PrivateKeyPasword;
    var privKey = new Buffer(process.env.GPGPrivateKey, 'base64');
    var privKeyObj = await openpgp.key.readArmored(privKey.toString());
    
    await privKeyObj.keys[0].decrypt(password);

    const options = {
        message: await openpgp.message.readArmored(encryptedBlob),
        privateKeys: privKeyObj.keys[0],
    }

    context.bindings.decryptedBlob = (await openpgp.decrypt(options)).data;
    context.done();
};