const TokenEth = artifacts.require("./TokenEth.sol");
const Bridge = artifacts.require("./BridgeEth.sol");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const privKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";
let accountAddress = "0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1";
const localKeyProvider = new HDWalletProvider({
  privateKeys: [privKey],
  providerOrUrl:
    "wss://goerli.infura.io/ws/v3/e3562069a1d44d18aa58a3ea55ccf21a",
});
const web3Eth = new Web3(localKeyProvider);
const tokenContract = new web3Eth.eth.Contract(
  TokenEth.abi,
  TokenEth.networks["5"].address
);
const BridgeAddress = Bridge.networks["5"].address;

module.exports = async (done) => {
  const ethers = require("ethers");
  const nonce = 2; //Need to increment this for each new transfer
  // const accounts = await web3.eth.getAccounts();
  const amount = 10; // allowing for 10 tokens
  console.log("Making Approval Transaction...");
  let tx = await tokenContract.methods
    .approve(BridgeAddress, amount)
    .send({ from: accountAddress });
  console.log("transaction initiated !");
  let allowance = await tokenContract.methods
    .allowance(accountAddress, BridgeAddress)
    .call();

  console.log("approved", allowance, "tokens");
  done();
};
