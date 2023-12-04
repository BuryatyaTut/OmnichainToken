import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'

import 'dotenv/config';

const PRIVATE_KEY  = process.env.PRIVATE_KEY as string;
const ALCHEMY_SEPOLIA_API_KEY = process.env.ALCHEMY_SEPOLIA_URL as string;
const ALCHEMY_ARBITRUM_GEORLI_URL = process.env.ALCHEMY_ARBITRUM_URL as string;
const ALCHEMY_MUMBAI_URL = process.env.ALCHEMY_MUMBAI_URL as string;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY as string;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.19",

  networks: {
    eth_sepolia_testnet: {
      url: ALCHEMY_SEPOLIA_API_KEY,
      accounts: [PRIVATE_KEY]
    },

    arbitrum_goerli_testnet: {
      url: ALCHEMY_ARBITRUM_GEORLI_URL,
      accounts: [PRIVATE_KEY]
    },

    mumbai: {
      url: ALCHEMY_MUMBAI_URL,
      accounts: [PRIVATE_KEY]
    } 
  }, 

  etherscan: {
    apiKey: {
      eth_sepolia_testnet: ETHERSCAN_API_KEY,
      arbitrumGoerli: ARBISCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY
    }
  }
};

export default config;
