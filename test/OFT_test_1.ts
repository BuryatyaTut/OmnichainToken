import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
import { LZEndpointMock, MyOFT, MyProxyOFT, MyToken } from "../typechain-types";
import { AddressLike, Signer } from "ethers";

describe("MyProxyOFT", function () {
    let srcChainId: number;
    let dstChainId: number;
    let chainId3: number;

    let token: MyToken;
    let srcProxyOFT: MyProxyOFT;
    let dstOFT: MyOFT;
    let thirdOFT: MyOFT;
    
    let srcLzEndpointMock: LZEndpointMock;
    let dstLzEndpointMock: LZEndpointMock;
    let lzEndpointMock3: LZEndpointMock;

    let owner: Signer;
    let address2: Signer;
    let address3: Signer;
  
    beforeEach(async function () {
      console.log();
      [owner, address2] = await ethers.getSigners();
  
      srcChainId = 10161; // Sepolia (Testnet)
      dstChainId = 10132; // Optimism-Goerli (Testnet)
      chainId3 = 3;
  
      // Deploying Mock EndPoints; 
      const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
      srcLzEndpointMock = await LZEndpointMock.deploy(srcChainId);
      dstLzEndpointMock = await LZEndpointMock.deploy(dstChainId);
      lzEndpointMock3 = await LZEndpointMock.deploy(chainId3);

      // Deploying MyToken
      const MyToken = await ethers.getContractFactory("MyToken");
      token = await MyToken.deploy([owner]);

      // Deploying Proxy for MyToken
      const MyProxyOFT = await ethers.getContractFactory("MyProxyOFT");
      srcProxyOFT = await MyProxyOFT.deploy(await srcLzEndpointMock.getAddress(), await token.getAddress());

      // Deploying OFT token at 2nd chain
      const MyOFT = await ethers.getContractFactory("MyOFT");
      dstOFT = await MyOFT.deploy("MyToken", "MTK", await dstLzEndpointMock.getAddress());

      // Deploying OFT token at 3nd chain
      thirdOFT = await MyOFT.deploy("MyToken", "MTK", await lzEndpointMock3.getAddress());
      
      // Setting Destination EndPoints for each MockEndPoint 
      await srcLzEndpointMock.setDestLzEndpoint(await dstOFT.getAddress(), await dstLzEndpointMock.getAddress());
      await srcLzEndpointMock.setDestLzEndpoint(await thirdOFT.getAddress(), await lzEndpointMock3.getAddress());

      await dstLzEndpointMock.setDestLzEndpoint(await srcProxyOFT.getAddress(), await srcLzEndpointMock.getAddress());
      await dstLzEndpointMock.setDestLzEndpoint(await thirdOFT.getAddress(), await lzEndpointMock3.getAddress());
      
      await lzEndpointMock3.setDestLzEndpoint(await srcProxyOFT.getAddress(), await srcLzEndpointMock.getAddress());
      await lzEndpointMock3.setDestLzEndpoint(await dstOFT.getAddress(), await dstLzEndpointMock.getAddress());


      // Setting Remote Access for OFT tokens on each chain
      await srcProxyOFT.setTrustedRemoteAddress(dstChainId, await dstOFT.getAddress());  
      await srcProxyOFT.setTrustedRemoteAddress(chainId3, await thirdOFT.getAddress());

      await dstOFT.setTrustedRemoteAddress(srcChainId, await srcProxyOFT.getAddress());
      await dstOFT.setTrustedRemoteAddress(chainId3, await thirdOFT.getAddress());

      await thirdOFT.setTrustedRemoteAddress(srcChainId, await srcProxyOFT.getAddress());
      await thirdOFT.setTrustedRemoteAddress(dstChainId, await dstOFT.getAddress());
    });
  
    describe("Test1", function (){
      it("Empty Test", async function () {
          expect(await token.balanceOf(owner)).to.equal(ethers.parseEther("100000"));

          await token.mint(owner, ethers.parseEther("0.1"));
          expect(await token.balanceOf(owner)).to.equal(ethers.parseEther("100000.1"));
      });

      it("Transfer to another chain", async function () {
        let tokensCnt = ethers.parseEther("2");
        let refundAddress = await owner.getAddress();
        let zroPaymentAddress = ethers.ZeroAddress;
        let adapterParams = ethers.solidityPacked(["uint16", "uint256"], [1, 200000])
        let fees = await srcProxyOFT.estimateSendFee(dstChainId, await owner.getAddress(), tokensCnt, false, adapterParams);

        await token.balanceOf(owner).then(balance => {
          console.log("myToken(owner) balance: " + ethers.formatEther(balance));
        });
        await dstOFT.balanceOf(address2).then(balance => {
            console.log("dstOFT(address2) balance: " + ethers.formatEther(balance));
        });

        token.approve(await srcProxyOFT.getAddress(), tokensCnt, {from: owner});    
        await srcProxyOFT.sendFrom(await owner.getAddress(), dstChainId, await address2.getAddress(), tokensCnt, 
                                    refundAddress, zroPaymentAddress, "0x", {value: fees[0]});
        
        await token.balanceOf(owner).then(balance => {
            console.log("myToken(owner) balance: " + ethers.formatEther(balance));
        });
        await dstOFT.balanceOf(address2).then(balance => {
          console.log("dstOFT(address2) balance: " + ethers.formatEther(balance));
        });

        expect(await dstOFT.connect(address2).balanceOf(address2)).to.equal(ethers.parseEther("2"));
      });

      it("Transfer between three chains", async function () {
        let tokensCnt = ethers.parseEther("15");
        let refundAddress = await owner.getAddress();
        let zroPaymentAddress = ethers.ZeroAddress;
        let adapterParams = ethers.solidityPacked(["uint16", "uint256"], [1, 200000])
        let fees1 = await srcProxyOFT.estimateSendFee(dstChainId, await owner.getAddress(), tokensCnt, false, adapterParams);

        await token.balanceOf(owner).then(balance => {
          console.log("srcToken(owner) balance: " + ethers.formatEther(balance));
        });
        await dstOFT.balanceOf(owner).then(balance => {
          console.log("dstOFT(owner) balance: " + ethers.formatEther(balance));
        });
        await thirdOFT.balanceOf(owner).then(balance => {
          console.log("thirdOFT(owner) balance: " + ethers.formatEther(balance));
        });

        token.approve(await srcProxyOFT.getAddress(), tokensCnt, {from: owner});
        await srcProxyOFT.sendFrom(await owner.getAddress(), dstChainId, await owner.getAddress(), tokensCnt, 
        refundAddress, zroPaymentAddress, "0x", {value: fees1[0]});

        let fees2 = await dstOFT.estimateSendFee(chainId3, await owner.getAddress(), tokensCnt, false, adapterParams);
        await dstOFT.sendFrom(await owner.getAddress(), chainId3, await owner.getAddress(), tokensCnt, 
        refundAddress, zroPaymentAddress, "0x", {value: fees2[0]});

        await token.balanceOf(owner).then(balance => {
          console.log("srcToken(owner) balance: " + ethers.formatEther(balance));
        });
        await dstOFT.balanceOf(owner).then(balance => {
          console.log("dstOFT(owner) balance: " + ethers.formatEther(balance));
        });
        await thirdOFT.balanceOf(owner).then(balance => {
          console.log("thirdOFT(owner) balance: " + ethers.formatEther(balance));
        });


        expect(await dstOFT.balanceOf(owner)).to.equal(ethers.parseEther("0"));
        expect(await thirdOFT.balanceOf(owner)).to.equal(ethers.parseEther("15"));
      });
    });
  });