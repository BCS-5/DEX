// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "../libraries/UniswapV2Library.sol";
import "../MarketRegistry.sol";

interface IClearingHouse {
    struct Position {
        uint256 margin;                    
        uint256 positionSize;               
        uint256 openNotional;               
        bool isLong;                        
        uint256 priceCumulativeLast;        
        uint32 openPositionTimestamp;      
        int256 fundingRateCumulativeLast;  
    }

    event AddLiquidity(address indexed provider, address indexed baseToken, uint liquidity);
    event RemoveLiquidity(address indexed provider, address indexed baseToken, uint liquidity);
    event UpdatePosition(address indexed trader, address indexed baseToken, bytes32 positionHash, uint margin, uint positionSize, uint openNotional, bool isLong);
    event ClosePosition(address indexed trader, address indexed baseToken, bytes32 positionHash, uint margin, uint positionSize, uint openNotional, bool isLong);
    event SettlePNL(address indexed trader, address indexed baseToken, bytes32 positionHash, uint margin, uint positionSize, uint closeNotional, bool isLong, int PNL);
    event Buy(address indexed trader, address indexed baseToken, uint amountIn, uint amountOut);
    event Sell(address indexed trader, address indexed baseToken, uint amountIn, uint amountOut);

    function initializePool(address baseToken, uint amountBase, uint amountQuote) external ;

    function getQuote(address quoteToken, address baseToken, uint quoteAmount) external view returns(uint baseAmount);
    function getPricecumulativeLast(address baseToken, address quoteToken) external view returns(uint priceCumulativeLast) ;

    function addLiquidity (address baseToken, uint quoteAmount, uint quoteMinimum, uint baseTokenMinimum, uint deadline) external ;
    function removeLiquidity (address baseToken, uint liquidity, uint quoteMinimum, uint baseTokenMinimum, uint deadline) external  ;

    function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) external;
    function openPositionForOrderBook(address trader, address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) external;

    function closePosition (address baseToken, bytes32 positionHash, uint amountIn, uint amountOut, uint deadline) external;
    function closePositionBatch (address[] memory baseTokens, bytes32[] memory positionHashs, uint[] memory slippageAdjustedAmounts, uint deadline) external;
    function closePositionForOrderBook (address trader, address baseToken, bytes32 positionHash, uint closePercent, uint slippageAdjustedAmount, uint deadline) external;

    function liquidateBatch (address[] memory traders, address[] memory baseTokens, bytes32[] memory positionHashs) external ;
    function liquidate(address trader, address baseToken, bytes32 positionHash) external ;

    function approve(address _token) external;

    function setMarketRegistry(address _marketRegistry) external;
    function setRouter(address _router) external;
    function setVault(address _vault) external;
    function setQuoteToken(address _quete) external;
    function setOrderBook(address _orderBook) external;    

    function getMarketRegistry() external view returns(address) ;
    function getRouter() external view returns(address); 
    function getVault() external view returns(address);
    function getOrderBook() external view returns(address);
    function getPosition(address trader, address baseToken, bytes32 positionHash) external view returns(Position memory);

    function getpositionHash(address trader, address baseToken, uint salt) external pure returns(bytes32);
}