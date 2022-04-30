import { time } from '@openzeppelin/test-helpers';
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Middleware, Void, DividendDistributor } from "../../typechain-types";
import { Signer, BigNumber, Contract } from "ethers";
import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent} from "@uniswap/sdk";

describe("VoidTest", function() {
    let owner: Signer;
    let wallet: Signer;
    let marketer: Signer;
    let liguiditer: Signer;
    let marketing: Signer;
    let treasurey: Signer;
    let middleware: Middleware;
    let ownerAddress: string;
    let walletAddress: string;
    let marketerAddress: string;
    let liguiditerAddr: string;
    let marketingAddr: string;
    let treasureyAddr: string;
    let latestBlock:any;
    let tokenVoid: Void;
    let distributer: DividendDistributor;
    let routerContract: any;

    const router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //unirouter on mainnet
    const EP = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //dai on mainnet
    
    // const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const deadline: BigNumber = ethers.BigNumber.from('2').pow('256').sub('2');
    //added for test
    const chainId = ChainId.MAINNET;
    const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const weth = WETH[chainId];
  
    before(async function () {
      [owner, wallet, marketer, liguiditer, marketing, treasurey] = await ethers.getSigners();
      ownerAddress = await owner.getAddress();
      walletAddress = await wallet.getAddress();
      marketerAddress = await marketer.getAddress();
      liguiditerAddr = await liguiditer.getAddress();
      marketingAddr = await marketing.getAddress();
      treasureyAddr = await treasurey.getAddress();
      latestBlock = await ethers.provider.getBlock("latest");
      routerContract = new ethers.Contract(router, IUniswapV2Router02.abi, owner)      
    });
  
    beforeEach(async function () {
  
      const Middleware = await ethers.getContractFactory("Middleware");
      const Void = await ethers.getContractFactory("Void");
      
      middleware = await Middleware.deploy();
      tokenVoid = await Void.deploy(router, marketerAddress, EP);
      
      await middleware.deployed();
      await tokenVoid.deployed();

      const dividenDistributerAddress = await tokenVoid.distributorAddress();
      const DividendDistributor = await ethers.getContractFactory("DividendDistributor");
      distributer = DividendDistributor.attach(dividenDistributerAddress);
      
      await tokenVoid.approve(ownerAddress, ethers.utils.parseUnits("1000000", "9"));
      await tokenVoid.approve(walletAddress, ethers.utils.parseUnits("1000000", "9"));
      await tokenVoid.connect(wallet).approve(ownerAddress, ethers.utils.parseUnits("1000000", "9"));
      await tokenVoid.approve(router, ethers.utils.parseUnits("100000", "9"));

      await routerContract.addLiquidityETH(
        tokenVoid.address,
        ethers.utils.parseUnits("10000", "9"), 
        0, 
        0, 
        ownerAddress, 
        Date.now(), 
        { 
          from: ownerAddress,
          value: ethers.utils.parseEther("100")
        }
      );
    })

    it("should get CirculatingSupply correctly", async function () {
        await tokenVoid.getCirculatingSupply();
    });

    it("should transfer correctly", async function () {
        await tokenVoid.transfer(walletAddress, 100);
        expect(BigNumber.from(await tokenVoid.balanceOf(walletAddress))).to.equal(BigNumber.from(100));
    });

    it("should transferFrom correctly", async function () {
      await tokenVoid.transferFrom(ownerAddress, walletAddress, 100);
      expect(BigNumber.from(await tokenVoid.balanceOf(walletAddress))).to.equal(BigNumber.from(100));
    });

    it("shouldn't transferFrom when max wallet has been triggered", async function () {
      await tokenVoid.transfer(walletAddress, 100);
      await expect(tokenVoid.transferFrom(walletAddress,ownerAddress, 50)).to.revertedWith("Max wallet has been triggered");
    })

    it("should transferFrom when ownerAddres to router correctly", async function () {
      await tokenVoid.setFeeReceivers(liguiditerAddr, marketingAddr, treasureyAddr);
      await tokenVoid.setSwapBackSettings(true, ethers.utils.parseUnits("10000", "9"));
      await tokenVoid.transfer(tokenVoid.address, ethers.utils.parseUnits("100000", "9"));
      await tokenVoid.transfer(walletAddress, ethers.utils.parseUnits("1000", "9"));
      await tokenVoid.transferFrom(ownerAddress, router, ethers.utils.parseUnits("100", "9"));
      await distributer.claimDividend();
      const totalRealised = await distributer.getTotalRealised(ownerAddress);
      const unpaidEarning = await distributer.getUnpaidEarnings(walletAddress);

      expect(BigNumber.from(await tokenVoid.balanceOf(walletAddress))).to.equal(ethers.utils.parseUnits("1000", "9"));
      expect(BigNumber.from(totalRealised)).to.equal("43348326415643149290227");
      expect(BigNumber.from(unpaidEarning)).to.equal("43348326420");
    })
})
