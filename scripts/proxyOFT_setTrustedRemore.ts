import { ethers } from "hardhat";
import {MyProxyOFT } from "../typechain-types";
import { AddressLike, Signer } from "ethers";

async function main() {
    let chainId: number = 10143; // Arbitrum-Goerli (Testnet) 
    let remoteOFTAddress: AddressLike = "0x9cA7e9BafABA92F02a80E19C4A7B0ec66dB5c81B"; // OFT address at Arbitrum
    let srcProxyOFTAddress: AddressLike = "0x686Ebc39eCF8351714cF0888408951af82C249ae"; // ProxyOFT address at mumbai

    const srcChainName = "Mumbai";
    const dstChainName = "Arbitrum Goerli";

    const myProxyOFT = await ethers.getContractFactory("MyProxyOFT")
    const srcOFT = myProxyOFT.attach(srcProxyOFTAddress)
    await srcOFT.setTrustedRemoteAddress(chainId, remoteOFTAddress); 

    console.log("Called function \"setTrustedRemoteAddress\" at " + srcChainName + "with" + dstChainName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
