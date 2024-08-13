// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import "./IClearingHouse.sol";

interface IAccountBalance {
    // 함수
    function setKeeper(address newKeeper) external;
    function getMarkPrice(address baseToken) external view returns (uint256);
    function setIndexPrice(address baseToken, uint256 price) external;
    function getIndexPrice(address baseToken) external view returns (uint256);
    function setOpenInterest(address baseToken, int256 positionSize, bool isLong) external;
    function getLongOpenInterest(address baseToken) external view returns (uint256);
    function getShortOpenInterest(address baseToken) external view returns (uint256);
    function checkLiquidation(
        IClearingHouse.Position memory position,
        address baseToken,
        address poolAddress
    ) external view returns (bool);
    function calculateFundingPayment(
        IClearingHouse.Position memory position,
        address baseToken,
        address poolAddress
    ) external view returns (int256);

    // 상태 변수에 대한 getter 함수들
    function lastFundingTimes(address baseToken) external view returns (uint256);
    function cumulativeLongFundingRates(address baseToken) external view returns (int256);
    function cumulativeShortFundingRates(address baseToken) external view returns (int256);
    function userLongFundingPayments(address baseToken, address user) external view returns (int256);
    function userShortFundingPayments(address baseToken, address user) external view returns (int256);
}