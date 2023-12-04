import { ethers } from "hardhat";
import { MyOFT, MyProxyOFT, MyToken } from "../typechain-types";
import { AddressLike, Signer } from "ethers";

async function main() {
    let chainId: number = 10143; // Arbitrum-Goerli (Testnet) 
    
    let srcOFT: MyProxyOFT;
    let srcToken: MyToken;

    let srcTokenAddress: AddressLike = "0x6c84bA610460d077E3A772979F71a022C52e591B";
    let srcProxyOFTAddress: AddressLike = "0x686Ebc39eCF8351714cF0888408951af82C249ae";
    let senderAddress: AddressLike = "0xdf0f562260AeaFfeB1DFd0ec9536adD13C1f65af";
    let receiverAddress: AddressLike = "0xdf0f562260AeaFfeB1DFd0ec9536adD13C1f65af";

    const myToken = await ethers.getContractFactory("MyToken");
    srcToken = myToken.attach(srcTokenAddress);

    const myProxyOFT = await ethers.getContractFactory("MyProxyOFT");
    srcOFT = myProxyOFT.attach(srcProxyOFTAddress);

    let tokensAmount = ethers.parseEther("10");
    let refundAddress = senderAddress;
    let zroPaymentAddress = ethers.ZeroAddress;
    let adapterParams = ethers.solidityPacked(["uint16", "uint256"], [1, 200000])
    let fees = await srcOFT.estimateSendFee(chainId, receiverAddress, tokensAmount, false, adapterParams, {from: senderAddress});

    console.log("The fee amount is " + fees[0]); 

    srcToken.approve(srcProxyOFTAddress, tokensAmount, {from: senderAddress});
    await srcOFT.sendFrom(senderAddress, chainId, receiverAddress, tokensAmount, 
        refundAddress, zroPaymentAddress, "0x", {value: fees[0], from: senderAddress});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
