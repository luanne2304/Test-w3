const Testcontract = artifacts.require("Testcontract");

module.exports = function (deployer) {
  deployer.deploy(Testcontract);
};