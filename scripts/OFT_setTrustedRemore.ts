import { ethers } from "hardhat";
import { MyOFT } from "../typechain-types";
import { AddressLike, Signer } from "ethers";

async function main() {
    let chainId: number = 10109; // Mumbai (Testnet) 
    let remoteOFTAddress: AddressLike = "0x686Ebc39eCF8351714cF0888408951af82C249ae";
    let srcOFTAddress: AddressLike = "0x9cA7e9BafABA92F02a80E19C4A7B0ec66dB5c81B";

    const srcChainName = "Arbitrum Goerli";
    const dstChainName = "Mumbai";

    const myOFT = await ethers.getContractFactory("MyOFT");
    const srcOFT = myOFT.attach(srcOFTAddress);
    await srcOFT.setTrustedRemoteAddress(chainId, remoteOFTAddress);

    console.log("Called function \"setTrustedRemoteAddress\" at " + srcChainName + "with" + dstChainName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
