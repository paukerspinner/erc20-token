import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [
        process.env.PRK1 as string,
      ]
    }
  }
};

export default config;
