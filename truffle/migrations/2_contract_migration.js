const Dummy = artifacts.require("Dummy");
const TokenCounter = artifacts.require("TokenCounter");
const Credential = artifacts.require("Credential");

module.exports = function(deployer, network, accounts) {
    let deployAccount = accounts[0];

    deployer.deploy(Dummy, {from: deployAccount}).then(async () => {
        return deployer.deploy(TokenCounter, {from: deployAccount}).then(async () => {
            return deployer.deploy(Credential, TokenCounter.address, {from: deployAccount});
        });
    });
}

