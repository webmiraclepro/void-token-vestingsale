//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Middleware {

    using SafeMath for uint256;
    using SafeMath for uint64;

    uint256 totalSellFee = 3000;
    uint256 sellFeeDenominator = 10000;
    uint256 feeDecreasingRate = 500;

    struct buyTimeToAmount {
        uint64 buyTime;
        uint256 amount;
    }

    buyTimeToAmount[] buytimeArrays;
    mapping(address => uint []) private buyerToIndexes;
    mapping(address => buyTimeToAmount[]) private buyerToArray;

    function setBuytimeToAmount(address receiver, uint256 amount, uint64 buytime) public {
        buyTimeToAmount [] storage buyAmounts = buyerToArray[receiver];
        buyTimeToAmount memory buyTx;
        buyTx = buyTimeToAmount(buytime, amount);
        buyAmounts.push(buyTx);
    }
    
    function getSellFeeAmount(address sender, uint256 amount, uint64 sellTime) public returns(uint256 sellFeeAmount) {
        require(amount > 0, "MW: amount is zero");
        uint256 totalAmount = getTotalAmount(sender);
        require(totalAmount >= amount, "MW: amount is over totalAmount");

        buyTimeToAmount [] storage buyAmounts = buyerToArray[sender];
        uint256 sellAmount = 0;
        uint256 tempAmount = amount;
        uint i = 0;
        while(tempAmount > 0) {
            if(buyAmounts[i].amount >= tempAmount) {
                sellAmount  += (tempAmount * vestingSaleSchedule(sellTime, buyAmounts[i].buyTime)).div(sellFeeDenominator);
                buyAmounts[i].amount -= tempAmount;
                break;
            }
            sellAmount  += (buyAmounts[i].amount * vestingSaleSchedule(sellTime, buyAmounts[i].buyTime)).div(sellFeeDenominator);
            tempAmount -= buyAmounts[i].amount;
            buyAmounts[i].amount = 0;
            i++;
        } 
        refreshArray(sender);
        sellFeeAmount = amount.sub(sellAmount);
    }

    function refreshArray(address _sender) public {
        buyTimeToAmount [] storage buyAmounts = buyerToArray[_sender];
        while(buyAmounts[0].amount == 0) {
            // move all elements to the left, starting from the `1`
            if(buyAmounts.length-1 == 0) {
                buyAmounts.pop();
                break;
            }
            for (uint i = 0; i < buyAmounts.length - 1; i++) {
                buyAmounts[i] = buyAmounts[i+1];
            }
            buyAmounts.pop();
       }
    }

    function getArrayLength(address _sender) public view returns(uint256) {
        buyTimeToAmount [] storage buyAmounts = buyerToArray[_sender];
        return buyAmounts.length;
    }

    function getTotalAmount(address account) public view returns(uint256) {
        buyTimeToAmount [] storage buyAmounts = buyerToArray[account];
        uint256 totalAmount = 0;
        for(uint j = 0; j < buyAmounts.length; j++) {
            totalAmount += buyAmounts[j].amount;
        }
        return totalAmount;
    }

    function vestingSaleSchedule(uint64 sellTime, uint64 buyTime) public view returns(uint256 discountRate) {
        require(sellTime >= buyTime,"MW:buyTime over");
        uint8 day = uint8((sellTime.sub(buyTime)).div(1 days));
        return day < 7 ? sellFeeDenominator.sub(totalSellFee.sub(feeDecreasingRate.mul(day))): sellFeeDenominator;
    }
}
