import { ethers } from "hardhat";
import {  MyOFT } from "../typechain-types";
import { AddressLike, Signer } from "ethers";

async function main() {
    let chainId: number = 10143; // Arbitrum-Goerli (Testnet) 
    let endpointAddress: AddressLike = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab"; //Arbitrum-Goerli
    const chainName = "Arbitrum Goerli";
    let oft: MyOFT;
    let owner: Signer;

    // Deploying OFT at chain
    const MyOFT = await ethers.getContractFactory("MyOFT");
    oft = await MyOFT.deploy("MyToken", "MTK", endpointAddress);
    console.log("MyOFT was deployed to " + chainName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
