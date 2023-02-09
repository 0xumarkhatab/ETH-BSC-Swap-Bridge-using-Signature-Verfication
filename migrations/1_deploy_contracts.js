const TokenEth = artifacts.require("TokenEth.sol");
const TokenBsc = artifacts.require("TokenBsc.sol");
const BridgeEth = artifacts.require("BridgeEth.sol");
const BridgeBsc = artifacts.require("BridgeBsc.sol");

module.exports = async function (deployer, network, addresses) {
  if (network === "ethereum_testnet") {
    await deployer.deploy(TokenEth);
    const tokenEth = await TokenEth.deployed();
    // console.log("addresses are ", addresses);
    await tokenEth.mint(addresses[0], 1000);
    await deployer.deploy(BridgeEth, tokenEth.address);
    const bridgeEth = await BridgeEth.deployed();
    await tokenEth.mint(bridgeEth.address, 1000);
  }
  if (network === "bsc_testnet") {
    await deployer.deploy(TokenBsc);
    const tokenBsc = await TokenBsc.deployed();
    await tokenBsc.mint(addresses[0], 1000);
    await deployer.deploy(BridgeBsc, tokenBsc.address);
    const bridgeBsc = await BridgeBsc.deployed();
    await tokenBsc.mint(bridgeBsc.address, 1000);
  }
};
