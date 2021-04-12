const Credential = artifacts.require("Credential");

module.exports = function(deployer, networks, accounts) {
    let credentialInstance;

    deployer.then(() => {
        return deployer.deploy(Credential, {overwrite: true});
    }).then(_credentialInstance => {
        credentialInstance = _credentialInstance;
        console.log("Credential contract at address = " + credentialInstance.address);
})
};
