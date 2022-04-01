import { time } from '@openzeppelin/test-helpers';
import { expect } from "chai";
import { ethers } from "hardhat";
import { Middleware, Void } from "../../typechain-types";
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
    const router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const routerSpooky = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";
    const EP = "0x82f0B8B456c1A451378467398982d4834b6829c1";
    // const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const deadline: BigNumber = ethers.BigNumber.from('2').pow('256').sub('2');
    const alchemyprovider = new ethers.providers.AlchemyProvider(
      'mainnet', 
      'https://eth-mainnet.alchemyapi.io/v2/PvSrH4tdBNOxV9rrLRFuzkmR_AbhKsoO'
    );
    const signer = new ethers.Wallet('d7f6ba85816a785036f9fc52c7c2e7cbfa4cd2a6cf077d25e8a8f87a3e600c87', alchemyprovider); 
    const account = signer.connect(alchemyprovider);
    
    //added for test
    const chainId = ChainId.MAINNET;
    const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const weth = WETH[chainId];
    const init = async() => {
      const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
      const pair = await Fetcher.fetchPairData(dai, weth);
      const route = new Route([pair], weth);
      const trade = new Trade(route, new TokenAmount(weth, '1000000000000000'), TradeType.EXACT_INPUT);
      console.log(route.midPrice.toSignificant(6));
      console.log(route.midPrice.invert().toSignificant(6));
      console.log(trade.executionPrice.toSignificant(6));
      console.log(trade.nextMidPrice.toSignificant(6));

      const slippageTolerance = new Percent('50', '10000');
      const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
      const path = [weth.address, dai.address];
      const to= '';
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const value = trade.inputAmount.raw;

      // const provider = ethers.getDefaultProvider('mainnet', {
      //   infura: 'https://mainnet.infura.io/v3/d0debf79f4554c5d89b825963aacc844'
      // });

      // const signer = new ethers.Wallet('d7f6ba85816a785036f9fc52c7c2e7cbfa4cd2a6cf077d25e8a8f87a3e600c87');
      // const account = signer.connect(provider);
      
    }

    init();

    before(async function () {
        [owner, wallet, marketer, liguiditer, marketing, treasurey] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        walletAddress = await wallet.getAddress();
        marketerAddress = await marketer.getAddress();
        liguiditerAddr = await liguiditer.getAddress();
        marketingAddr = await marketing.getAddress();
        treasureyAddr = await treasurey.getAddress();
        latestBlock = await ethers.provider.getBlock("latest")      

      });
  
      beforeEach(async function () {
        const Middleware = await ethers.getContractFactory("Middleware");
        const Void = await ethers.getContractFactory("Void");
        middleware = await Middleware.deploy();
        tokenVoid = await Void.deploy(router, marketerAddress, EP);
        const routerContract = new ethers.Contract(router, IUniswapV2Router02.abi, signer)
        await middleware.deployed();
        await tokenVoid.deployed();
        await tokenVoid.approve(router, '1000000');
        await tokenVoid.approve(ownerAddress, '1000000');
        await tokenVoid.approve(walletAddress, '1000000');
        await tokenVoid.connect(wallet).approve(ownerAddress, '1000000');
        // const urouter = routerContract.attach('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');
        await routerContract.addLiquidity(weth.address, tokenVoid, 1000000, 1000000, 1000000, 1000000, ownerAddress, deadline, {
          gasLimit: 9500000,
        });
      })

      // it("should get CirculatingSupply correctly", async function () {
      //     await tokenVoid.getCirculatingSupply();
      // });

      // it("should transfer correctly", async function () {
      //     await tokenVoid.transfer(walletAddress, 100);
      //     expect(BigNumber.from(await tokenVoid.balanceOf(walletAddress))).to.equal(BigNumber.from(100));
      // });

      // it("should transferFrom correctly", async function () {
      //   await tokenVoid.transferFrom(ownerAddress, walletAddress, 100);
      //   expect(BigNumber.from(await tokenVoid.balanceOf(walletAddress))).to.equal(BigNumber.from(100));
      // });

      // it("shouldn't transferFrom when max wallet has been triggered", async function () {
      //   await tokenVoid.transfer(walletAddress, 100);
      //   await expect(tokenVoid.transferFrom(walletAddress,ownerAddress, 50)).to.revertedWith("Max wallet has been triggered");
      // })

      it("should transferFrom when walletAddress to ownerAddress correctly", async function () {
        await tokenVoid.setFeeReceivers(liguiditerAddr, marketingAddr, treasureyAddr);
        await tokenVoid.setSwapBackSettings(true, 1000);
        await tokenVoid.balanceOf(ownerAddress);
        await tokenVoid.transfer(tokenVoid.address, 10000);
        await tokenVoid.transfer(walletAddress, 100);
        // await tokenVoid.transferFrom(walletAddress,router, 50);
      //   // expect(BigNumber.from(await tokenVoid.balanceOf(walletAddress))).to.equal(BigNumber.from(100));
      })
})
