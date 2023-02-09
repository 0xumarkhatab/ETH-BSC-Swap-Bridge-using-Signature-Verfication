const { parseEther, ethers } = require("ethers");

const BridgeEth = artifacts.require("./BridgeEth.sol");

const privKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";
let accountAddress = "0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1";

module.exports = async (done) => {
  const nonce = 2; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  let amount = 10;
  const message = web3.utils
    .soliditySha3(
      { t: "address", v: accountAddress },
      { t: "uint256", v: amount },
      { t: "uint256", v: nonce }
    )
    .toString("hex");
  const { signature } = web3.eth.accounts.sign(message, privKey);
  console.log({ signature });

  let res = await bridgeEth.swap(accountAddress, amount, nonce, signature);
  console.log(res);
  done();
};
