 import { ethers } from "hardhat";
import { MyProxyOFT, MyToken } from "../typechain-types";
import { AddressLike, Signer } from "ethers";

async function main() {
    let chainId: number = 10109; // Mumbai (Testnet)
    let endpointAddress: AddressLike = "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8"; // Mumbai L0 endpoint
    const chainName = "Mumbai";

    let erc20Token: MyToken;
    let proxyOFT: MyProxyOFT;

    let addresses = ["0xdf0f562260AeaFfeB1DFd0ec9536adD13C1f65af"]; // My MetaMask Address

    // Deploying ERC20 Token
    const MyToken = await ethers.getContractFactory("MyToken");
    erc20Token = await MyToken.deploy(addresses);
    console.log("deployed ERC20 token at" + chainName);

    // Deploying Proxy for ERC20 Token
    let erc20TokenAddress = "0x6c84bA610460d077E3A772979F71a022C52e591B";
    const MyProxyOFT = await ethers.getContractFactory("MyProxyOFT");
    proxyOFT = await MyProxyOFT.deploy(endpointAddress, erc20TokenAddress);
    console.log("deployed ProxyOFT token to" + chainName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
