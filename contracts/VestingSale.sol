//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract VestingSale {

    using SafeMath for uint256;
    using SafeMath for uint64;

    uint256 totalSellFee = 3000;
    uint256 sellFeeDenominator = 10000;
    uint256 feeDecreasingRate = 500;
    uint256 refreshThreshold = 1000;

    event GetSellFeeAmount(address indexed sender, uint256 value);

    struct buyTimeToAmount {
        uint64 buyTime;
        uint256 amount;
    }

    buyTimeToAmount[] buytimeArrays;
    mapping(address => uint []) private buyerToIndexes;
    mapping(address => buyTimeToAmount[]) private buyerToArray;
    mapping(address => uint256) buyerToPointer;
    mapping(address => uint256) buyerToTotal;

    function setBuytimeToAmount(address receiver, uint256 amount, uint64 buytime) public {
        buyTimeToAmount [] storage buyAmounts = buyerToArray[receiver];
        buyTimeToAmount memory buyTx = buyTimeToAmount(buytime, amount);
        buyerToTotal[receiver] += amount;
        buyAmounts.push(buyTx);
    }
    
    function getSellFeeAmount(address sender, uint256 amount, uint64 sellTime) public returns(uint256) {
        require(amount > 0, "MW: amount is zero");
        require(buyerToTotal[sender] >= amount, "MW: amount is over totalAmount");
        
        uint256 sellFeeAmount = 0;
        buyTimeToAmount [] storage buyAmounts = buyerToArray[sender];
        uint256 sellAmount = 0;
        uint256 tempAmount = amount;
        //set the starting pointer
        uint i = buyerToPointer[sender];
        while(tempAmount > 0) {
            if(buyAmounts[i].amount >= tempAmount) {
                sellAmount  += tempAmount.mul(vestingSaleSchedule(sellTime, buyAmounts[i].buyTime)).div(sellFeeDenominator);
                buyAmounts[i].amount -= tempAmount;
                break;
            }
            sellAmount  += (buyAmounts[i].amount * vestingSaleSchedule(sellTime, buyAmounts[i].buyTime)).div(sellFeeDenominator);
            tempAmount -= buyAmounts[i].amount;
            i++;
        } 
        //remember the starting pointer
        buyerToPointer[sender] = i;
        buyerToTotal[sender] -= amount;
        if(shouldRefresh(sender)) {
            refreshBuyterToArray(sender);
        }
        sellFeeAmount = amount.sub(sellAmount);
        emit GetSellFeeAmount(sender, sellFeeAmount);
        return sellFeeAmount;
    }

    function refreshBuyterToArray(address _sender) public {
        buyTimeToAmount [] storage buyAmounts = buyerToArray[_sender];
            // move all elements to the left, starting from the `1`
            uint start = buyerToPointer[_sender];
            for (uint i = start; i < buyAmounts.length - 1; i++) {
                buyAmounts[i-start] = buyAmounts[i];
            }
    }

    function shouldRefresh(address _sender) internal view returns(bool) {
            return buyerToPointer[_sender] >= refreshThreshold;
    }

    function vestingSaleSchedule(uint64 sellTime, uint64 buyTime) public view returns(uint256) {
        require(sellTime >= buyTime,"MW:buyTime over");
        uint8 day = uint8((sellTime.sub(buyTime)).div(1 days));
        return day < 7 ? sellFeeDenominator.sub(totalSellFee.sub(feeDecreasingRate.mul(day))): sellFeeDenominator;
    }

    function setRefreshThreshold(uint256 _threshold) public {
        refreshThreshold = _threshold;
    }

    function getBalance(address _account) public view returns(uint256) {
        return buyerToTotal[_account];
    }
}
