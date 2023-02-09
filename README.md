# ETH-To-BSC-Swap-Bridge
This is a simple Ethereum to Binance Smart Chain Bridge for Swapping tokens across different chains on testnet

# How it Works?

We have two cross chain Smart contracts (Bridges)

- ETH Bridge
- BSC Bridge

We can transfer Tokens from one chain ( Bridge ) to other chain (Other Bridge).

From transferring from Eth to BSC , we Deposit tokens on Eth-bridge and Withdraw on BSC-Bridge and vice verca.
There is a Bridge API script that runs 24/7.It has an event handlers for Deposit on Ethereum Goerli and Binance smart chain testnet. 


Whenever Deposit happens on Eth-Bridge , DepositSuccess Event is fired 
and the API catches it.
After API observe the DepositSuccess event , it calls the Withdraw function of the Binance Smart Chain Bridge and transfer tokens to user's wallet.


Make sure Both the bridges have enough liquidity and that's why initially when the tokens are deployed ,

we Mint 1000 tokens on each bridge so it has good liquidity. We can increase that amount too.


# Run it

      - Make Sure you have Installed Truffle Suit
      - Clone the repository using the command `git clone https://github.com/umaresso/ETH-To-BSC-Bridge` 
      - Open the newly created repository after cloning
      - In the Truffle config , enter your own mnemonic 
      - In the scripts and migration files , enter the private keys and mnemonic by your own testwallets
      - Run `npm install` in a new terminal by pressing ` CTRL+` `
      - Run following commands for deploying Both the Bridges

## Deploy Bridges

Deploy Ethereum Bridge `truffle migrate --network ethereum_testnet` 

The output will be like as follows

![image](https://user-images.githubusercontent.com/71306738/215405211-d1c6e150-1d69-4e4d-bf14-e1722520cfdd.png)
![image](https://user-images.githubusercontent.com/71306738/215405329-52ef3fc7-4a28-4a36-9555-50f1900184a8.png)



Deploy BSC Bridge `truffle migrate --network bsc_testnet` 

The output will be like as follows

![image](https://user-images.githubusercontent.com/71306738/215405502-9b06f0b3-603d-4750-8319-e5b07c95499a.png)

## Balance Check

Check the Token Balances again by running following Commands

ETH Token Balance of the User : `truffle exec scripts/eth-token-balance.js --network ethereum_testnet `

BSC Token Balance of the User : `truffle exec scripts/bsc-token-balance.js --network bsc_testnet `

## Run API for listening token Transfer Events

Time to run BSC Bridge for listening to the Burning event:

Type `node scripts/eth-bsc-bridge.js` in the terminal
![image](https://user-images.githubusercontent.com/71306738/215405761-e185dbf0-7db6-42af-a0cb-9ba799e4016f.png)

## Actual Swap

### Approve Bridge for Tokens


Now Open Another terminal and Run `truffle exec scripts/approve-eth.js --network ethereum_testnet`

Let the transaction be completed.

Open the first terminal and you will see something like this 

![approval](https://user-images.githubusercontent.com/71306738/217811965-d7693801-35c3-473e-9b83-7486017fc932.PNG)

Now Run `truffle exec scripts/eth-bsc-swap.js --network ethereum_testnet`

Take some time to complete it and observe the other terminal where we ran our BridgeAPI.

![BridgeAPI](https://user-images.githubusercontent.com/71306738/217812144-5ca8aaed-f719-40f4-bb4f-d80f680c5fb0.PNG)


## Recheck Balances

Check the Token Balances again by running following Commands

ETH Token Balance of the User : `truffle exec scripts/eth-token-balance.js --network ethereum_testnet `

BSC Token Balance of the User : `truffle exec scripts/bsc-token-balance.js --network bsc_testnet `

![afterSwap](https://user-images.githubusercontent.com/71306738/217812162-d8651461-6c87-4d25-a420-f51f6d21962e.PNG)
