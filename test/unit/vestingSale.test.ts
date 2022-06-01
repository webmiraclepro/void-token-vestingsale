import { time } from '@openzeppelin/test-helpers';
import { expect } from "chai";
import { ethers } from "hardhat";
import { VestingSale } from "../../typechain-types";
import { Signer, BigNumber } from "ethers";

describe("VestingSale", function () {
    let owner: Signer;
    let wallet: Signer;
    let marketer: Signer;
    let vestingSale: VestingSale;
    let ownerAddress: string;
    let walletAddress: string;
    let marketerAddress: string;
    let latestBlock: any;

    before(async function () {
        this.timeout(10000); // 10 second timeout for setup
        [owner, wallet, marketer,] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        walletAddress = await wallet.getAddress();
        marketerAddress = await marketer.getAddress();
        latestBlock = await ethers.provider.getBlock("latest")
    });

    beforeEach(async function () {
        const VestingSale = await ethers.getContractFactory("VestingSale");
        vestingSale = await VestingSale.deploy();
        await vestingSale.deployed();

    })

    it("setBuytimeToAmount", async function () {
        await vestingSale.setBuytimeToAmount(ownerAddress, 100, latestBlock.timestamp);
    });

    it("should not getSellFeeAmount when totalAmount 0", async function () {
        const latestBlock = await ethers.provider.getBlock("latest")
        const sellTime = latestBlock.timestamp + 86400;
        await expect(vestingSale.getSellFeeAmount(ownerAddress, 50, sellTime)).to.revertedWith("MW: amount is over totalAmount");
    })

    it("sale schedule shoud be 10000 after 7 days", async function () {
        const buyTime = latestBlock.timestamp;
        const sellTime = latestBlock.timestamp + time.duration.weeks(1);
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(sellTime, buyTime))).to.equal(BigNumber.from('10000'));
    })

    it("sale schedule", async function () {
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(latestBlock.timestamp, latestBlock.timestamp))).to.equal(BigNumber.from('7000'));
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(latestBlock.timestamp + 86400, latestBlock.timestamp))).to.equal(BigNumber.from('7500'));
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(latestBlock.timestamp + 86400 * 2, latestBlock.timestamp))).to.equal(BigNumber.from('8000'));
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(latestBlock.timestamp + 86400 * 3, latestBlock.timestamp))).to.equal(BigNumber.from('8500'));
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(latestBlock.timestamp + 86400 * 4, latestBlock.timestamp))).to.equal(BigNumber.from('9000'));
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(latestBlock.timestamp + 86400 * 5, latestBlock.timestamp))).to.equal(BigNumber.from('9500'));
        expect(BigNumber.from(await vestingSale.vestingSaleSchedule(latestBlock.timestamp + 86400 * 6, latestBlock.timestamp))).to.equal(BigNumber.from('10000'));
    })

    it("getSellFeeAmount", async function () {
        await vestingSale.setBuytimeToAmount(ownerAddress, 100, latestBlock.timestamp);
        await vestingSale.setBuytimeToAmount(ownerAddress, 150, latestBlock.timestamp + 86400);
        const tx = await vestingSale.getSellFeeAmount(ownerAddress, 100, latestBlock.timestamp + 86400); 
        const rc = await tx.wait(); // 0ms, as tx is already confirmed
        const event = rc.events.find(event => event.event === 'GetSellFeeAmount');
        const [sender, value] = event.args;
        expect(BigNumber.from(value)).to.equal(BigNumber.from('25'));
    })
});