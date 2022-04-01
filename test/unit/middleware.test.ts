// import { time } from '@openzeppelin/test-helpers';
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { Middleware } from "../../typechain-types";
// import { Signer, BigNumber } from "ethers";

// describe("Middleware", function () {
//     let owner: Signer;
//     let wallet: Signer;
//     let marketer: Signer;
//     let middleware: Middleware;
//     let ownerAddress: string;
//     let walletAddress: string;
//     let marketerAddress: string;
//     let latestBlock:any;

//     before(async function () {
//       [owner, wallet, marketer, ] = await ethers.getSigners();
//       ownerAddress = await owner.getAddress();
//       walletAddress = await wallet.getAddress();
//       marketerAddress = await marketer.getAddress();
//       latestBlock = await ethers.provider.getBlock("latest")      
//     });

//     beforeEach(async function () {
//       const Middleware = await ethers.getContractFactory("Middleware");
//       const Void = await ethers.getContractFactory("Void");
//       middleware = await Middleware.deploy();
//       await middleware.deployed();
      
//     })

//     it("setBuytimeToAmount", async function () {
//       await middleware.setBuytimeToAmount(ownerAddress, 100, latestBlock.timestamp);
//       expect(BigNumber.from(await middleware.getTotalAmount(ownerAddress))).to.equal(BigNumber.from('100'));
//     });
    
//     it("should not getSellFeeAmount when totalAmount 0", async function () {
//       const latestBlock = await ethers.provider.getBlock("latest")
//       const sellTime = latestBlock.timestamp + 86400;
//       await expect(middleware.getSellFeeAmount(ownerAddress, 50, sellTime)).to.revertedWith("MW: amount is over totalAmount");
//     })

//     it("sale schedule shoud be 10000 after 7 days", async function () {
//       const buyTime = latestBlock.timestamp;
//       const sellTime = latestBlock.timestamp + time.duration.weeks(1);
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(sellTime, buyTime))).to.equal(BigNumber.from('10000'));
//     })

//     it("sale schedule", async function () {
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(latestBlock.timestamp, latestBlock.timestamp))).to.equal(BigNumber.from('7000'));
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(latestBlock.timestamp + 86400, latestBlock.timestamp))).to.equal(BigNumber.from('7500'));
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(latestBlock.timestamp + 86400 * 2, latestBlock.timestamp))).to.equal(BigNumber.from('8000'));
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(latestBlock.timestamp + 86400 * 3, latestBlock.timestamp))).to.equal(BigNumber.from('8500'));
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(latestBlock.timestamp + 86400 * 4, latestBlock.timestamp))).to.equal(BigNumber.from('9000'));
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(latestBlock.timestamp + 86400 * 5, latestBlock.timestamp))).to.equal(BigNumber.from('9500'));
//       expect(BigNumber.from(await middleware.vestingSaleSchedule(latestBlock.timestamp + 86400 * 6, latestBlock.timestamp))).to.equal(BigNumber.from('10000'));
//     })

//     it("refresh array", async function () {
//       await middleware.setBuytimeToAmount(ownerAddress, 100, latestBlock.timestamp);
//       await middleware.setBuytimeToAmount(ownerAddress, 150, latestBlock.timestamp + 86400);
//       await middleware.getSellFeeAmount(ownerAddress, 150, latestBlock.timestamp + 86400);
//       await middleware.refreshArray(ownerAddress);

//       expect(BigNumber.from(await middleware.getArrayLength(ownerAddress))).to.equal(BigNumber.from(1));
//     })

//     it("getSellFeeAmount", async function () {
//       await middleware.setBuytimeToAmount(ownerAddress, 100, latestBlock.timestamp);
//       await middleware.setBuytimeToAmount(ownerAddress, 150, latestBlock.timestamp + 86400);

//       // await middleware.getSellFeeAmount(ownerAddress, 200, latestBlock.timestamp + 86400);
//       const sellFeeAmount = await middleware.getSellFeeAmount(ownerAddress, 100, latestBlock.timestamp + 86400);
//       // console.log('sellFeeAmount///',sellFeeAmount);
//       // expect((await middleware.getSellFeeAmount(ownerAddress, 100, latestBlock.timestamp + 86400))).to.equal(BigNumber.from('225'));
//       // expect(BigNumber.from(await middleware.getTotalAmount(ownerAddress))).to.equal(BigNumber.from('50'));
//       // expect(BigNumber.from(await middleware.getTotalAmount(ownerAddress))).to.equal(BigNumber.from('0'));
//     })
// });