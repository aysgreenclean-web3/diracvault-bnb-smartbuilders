require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",

  networks: {
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY
        ? [`0x${process.env.PRIVATE_KEY}`]
        : [],
    },
  },

  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
};