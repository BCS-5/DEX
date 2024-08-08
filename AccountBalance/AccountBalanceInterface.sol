// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 < 0.9.0;

interface AccountBalanceInterface {
    // 이벤트
    event FundingPaymentSettled(address indexed trader, address indexed baseToken, int256 longFundingPayment, int256 shortFundingPayment);
    event LiquidationWarning(address indexed trader, address indexed baseToken, int256 positionSize, uint256 marginRatio);

    // 함수
    function updateFundingRate(address baseToken) external;
    function settleFundingPayment(address trader, address baseToken) external;
    function getPositionSize(address trader, address baseToken) external view returns (int256);
    function checkLiquidation(address trader, address baseToken, int256 positionSize, int256 openNotional, int256 unrealizedPnl) external view;
    function getPrice(address baseToken) external view returns (uint256);
    function getMarkPrice(address baseToken) external view returns (uint256);
}