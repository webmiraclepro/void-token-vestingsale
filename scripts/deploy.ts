import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const router = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";
    const EP = "0x82f0B8B456c1A451378467398982d4834b6829c1";
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Middleware = await ethers.getContractFactory("Middleware");
    const Void = await ethers.getContractFactory("Void");
    const tokenVoid = await Void.deploy(router, await deployer.getAddress(), EP);
    const middleware = await Middleware.deploy();
  
    console.log("VoidToken address:", tokenVoid.address);
    console.log("Middleware address:", middleware.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });