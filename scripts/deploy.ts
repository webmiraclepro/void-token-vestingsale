import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const router = "0xa6AD18C2aC47803E193F75c3677b14BF19B94883";// fantom testnet router
    const EP = "0x30a40BC648799a746947417c675E54d5915ACA38"; //dai for fantom testnet
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const providers = ethers.providers;
    const provider = providers.getDefaultProvider( "https://rpc.testnet.fantom.network");
    provider.getGasPrice().then(function(gasPrice) {
        const gasPriceString = gasPrice.toString();
        console.log("Current gas price: " + gasPriceString);
    });
  
    const Middleware = await ethers.getContractFactory("Middleware");
    const Void = await ethers.getContractFactory("Void");
    const tokenVoid = await Void.deploy(router, await deployer.getAddress(), EP);
    const middleware = await Middleware.deploy();
    await tokenVoid.deployed();
    await middleware.deployed();
  
    console.log("VoidToken address:", tokenVoid.address);
    console.log("Middleware address:", middleware.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });