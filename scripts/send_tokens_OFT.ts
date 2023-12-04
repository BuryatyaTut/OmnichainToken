import { ethers } from "hardhat";
import { MyOFT, MyProxyOFT, MyToken } from "../typechain-types";
import { AddressLike, Signer } from "ethers";

async function main() {
    let chainId: number = 10109; // Mumbai (Testnet) 
    let srcOFT: MyOFT;

    let srcOFTAddress: AddressLike =      "0x9cA7e9BafABA92F02a80E19C4A7B0ec66dB5c81B";
    let senderAddress: AddressLike = "0xdf0f562260AeaFfeB1DFd0ec9536adD13C1f65af"; // Address at sending chain
    let receiverAddress: AddressLike = "0xdf0f562260AeaFfeB1DFd0ec9536adD13C1f65af"; // Address at receiving chain

    const myOFT = await ethers.getContractFactory("MyOFT");
    srcOFT = myOFT.attach(srcOFTAddress);

    let tokensAmount = ethers.parseEther("3");
    let refundAddress = senderAddress;
    let zroPaymentAddress = ethers.ZeroAddress;
    let adapterParams = ethers.solidityPacked(["uint16", "uint256"], [1, 200000])
    let fees = await srcOFT.estimateSendFee(chainId, receiverAddress, tokensAmount, false, adapterParams, {from: senderAddress});

    console.log("The fee amount is " + fees[0]); 

    await srcOFT.sendFrom(senderAddress, chainId, receiverAddress, tokensAmount, 
        refundAddress, zroPaymentAddress, "0x", {value: fees[0], from: senderAddress});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
