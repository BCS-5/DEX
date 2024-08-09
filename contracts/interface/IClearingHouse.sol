//SPDX-License-Identifier: UNLICENCE
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "../libraries/UniswapV2Library.sol";
import "../MarketRegistry.sol";

interface IClearingHouse {
    struct Position {
        uint256 margin;                     // 담보금
        uint256 positionSize;               // 체결 계약 수
        uint256 openNotional;               // 빌린돈
        bool isLong;                        // true: long, false: short
        uint256 priceCumulativeLast;        // 포지션 진입 시점 누적 TWAP값
        uint32 openPositionTimestamp;       // 포지션 진입 시점 block timestamp
        int256 fundingRateCumulativeLast;  // 포지션 진입 시점 누적 funding Rate값
    }

    // 초기 유동성 풀 가격 비율 설정
    function initializePool(address baseToken, uint amountBase, uint amountQuote) external ;

    // usdt와 같은 가치를 가진 baseToken 개수 반환
    function getQuote(address quoteToken, address baseToken, uint quoteAmount) external view returns(uint baseAmount);

    //유동성 추가
    function addLiquidity (address baseToken, uint quoteAmount, uint quoteMinimum, uint baseTokenMinimum, uint deadline) external ;

    //유동성 제거
    function removeLiquidity (address baseToken, uint liquidity, uint quoteMinimum, uint baseTokenMinimum, uint deadline) external  ;

    // pool에 저장된 baseToken의 시간 가중치 평균 값 반환.
    function getPricecumulativeLast(address pool, address baseToken, address quoteToken) external view returns(uint priceCumulativeLast) ;

    // 포지션 오픈
    function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) external ;

    // 사용자에 의해 호출되는 포지션 종료
    function closePosition (address baseToken, bytes32 positionHash, uint amountIn, uint amountOut, uint deadline) external ;

    function getClosePercent(uint openPositionSize, uint closePositionSize) external pure returns(uint) ;

    function liquidateBatch (address[] memory traders, address[] memory baseTokens, bytes32[] memory positionHashs) external ;

    function liquidate(address trader, address baseToken, bytes32 positionHash) external ;


    function setMarketRegistry(address _marketRegistry) external;

    function setRouter(address _router) external;

    function setVault(address _vault) external  ;

    function getMarketRegistry() external view returns(address) ;

    function getRouter() external view returns(address); 

    function getVault() external view returns(address);

    function approve(address _token) external;

    function getpositionHash(address trader, address baseToken, uint salt) external pure returns(bytes32);
}