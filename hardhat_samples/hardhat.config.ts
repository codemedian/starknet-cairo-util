import { HardhatUserConfig } from "hardhat/types";
import "@shardlabs/starknet-hardhat-plugin"
import "@nomiclabs/hardhat-waffle"


// const ALCHEMY_API_KEY = "KEY"
// const ROPSTEN_PRIVATE_KEY = ""

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  networks: {
    devnet: {
      url: "http://localhost:5000"
    }
  },
  solidity: {
    version: "0.8.4"
  },
  cairo: {
     version: "0.7.0"
  },
  paths: {
    tests: "./tests"
  },
  mocha: {
    starknetNetwork: "devnet",
  }  
};

export default config;
