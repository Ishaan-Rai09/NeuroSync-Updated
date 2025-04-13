require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

// Default private key - DO NOT USE IN PRODUCTION
const DEFAULT_PRIVATE_KEY = "0x0000000000000000000000000000000000000000000000000000000000000000";
const PRIVATE_KEY = process.env.PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY]
    }
  }
}; 