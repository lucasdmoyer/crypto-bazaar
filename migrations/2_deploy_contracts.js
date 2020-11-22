var Adoption = artifacts.require("Adoption");
var Estate = artifacts.require("Estate");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(Estate);
};