const Web3 = require("web3");
const BridgeEth = require("../build/contracts/BridgeEth.json");
const BridgeBsc = require("../build/contracts/BridgeBsc.json");

// Instantiating web3 object with the Ethereum network's WebSocket URL
const web3Eth = new Web3(
  "wss://goerli.infura.io/ws/v3/e3562069a1d44d18aa58a3ea55ccf21a"
);

// Instantiating web3 object with the Binance Smart Chain network's RPC URL
const web3Bsc = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545");

// The private key of the wallet to be used as the admin address
const adminPrivKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";

// Deriving the public address of the wallet using the private key
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

// Instantiating the BridgeEth contract with its ABI and address
const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks["5"].address
);

// Instantiating the BridgeBsc contract with its ABI and address
const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks["97"].address
);

// Listening to Transfer events emitted by the BridgeEth contract
console.log("Listening to the events....");

//

bridgeEth.events.DepositSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Signature ${signature}
  `);

  // initiate withdraw transaction
  // Destructuring the values from the event
  const tx = bridgeBsc.methods.withdraw(user, amount, nonce, signature);

  // Getting the gas price and gas cost required for the method call
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({ from: admin }),
  ]);

  // Encoding the ABI of the method
  const data = tx.encodeABI();

  // Preparing the transaction data
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice,
  };

  // Sending the transaction to the Binance Smart Chain
  try {
    const receipt = await web3Bsc.eth.sendTransaction(txData);
    // Logging the transaction hash
    console.log(`Transaction hash: ${receipt.transactionHash}`);
  } catch (e) {
    console.log("error in Withdrawing money from BSC Bridge", e);
  }
});

bridgeEth.events.WithdrawSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    ETH Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
});

// BSC Events Handling

bridgeBsc.events.DepositSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    BSC Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Signature ${signature}
  `);

  // initiate withdraw transaction
  // Destructuring the values from the event
  const tx = bridgeBsc.methods.withdraw(user, amount, nonce, signature);

  // Getting the gas price and gas cost required for the method call
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({ from: admin }),
  ]);

  // Encoding the ABI of the method
  const data = tx.encodeABI();

  // Preparing the transaction data
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice,
  };

  // Sending the transaction to the Binance Smart Chain
  const receipt = await web3Eth.eth.sendTransaction(txData);
  // Logging the transaction hash
  console.log(`Transaction hash: ${receipt.transactionHash}`);
});

bridgeBsc.events.WithdrawSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    BSC Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
});
