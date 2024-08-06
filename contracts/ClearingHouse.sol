//SPDX-License-Identifier: UNLICENCE
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "./libraries/UniswapV2Library.sol";
import "./MarketRegistry.sol";

contract ClearingHouse is Ownable{
    struct Position {
        uint256 margin;                     // 담보금
        uint256 positionSize;               // 체결 계약 수
        uint256 openNotional;               // 빌린돈
        bool isLong;                        // true: long, false: short
        uint256 priceCumulativeLast;        // 포지션 진입 시점 누적 TWAP값
        uint32 openPositionTimestamp;       // 포지션 진입 시점 block timestamp
        int256 fundingRateCumulativeLast;  // 포지션 진입 시점 누적 funding Rate값
    }

    struct LiquidityProvider {
        uint256 liquidity;                           // 얼마나 예치했는지
        uint256 feePerLiquidityCumulativeLast;       // 마지막으로 유동성 추가, claim 했을 때 누적 이자가 얼마였는지 기록
    }

    event OpenPosition(address indexed trader, address indexed baseToken, uint margin, bool isLong, uint amountInput, uint amountOutput);
    event AddLiquidity(address indexed provider, address indexed baseToken, uint margin);
    event RemoveLiquidity(address indexed provider, address indexed baseToken, uint margin);
    event Liquidate(address indexed trader, address indexed baseToken, address miner, uint margin);
    
    mapping(address => mapping(address => mapping(bytes32 => Position))) positionMap;
    mapping(address => mapping(address => LiquidityProvider)) liquidityProvider;

    address marketRegistry;
    address router;    
    address factory;    
    address quoteToken;

    uint feePerLiquidityCumulative;         
    uint fundingRateCumulative;

    uint longOpenInterest;
    uint shortOpenInterest;

    constructor() Ownable(msg.sender) {
    }

    // 유동성 풀이 존재하는지 확인
    modifier hasPool(address baseToken) {        
        require(MarketRegistry(marketRegistry).hasPool(baseToken), "");
        _;
    }

    // 초기 유동성 풀 가격 비율 설정
    function initializePool(address baseToken, uint amountBase, uint amountQuote) public onlyOwner {        
        LiquidityProvider storage _provider = liquidityProvider[msg.sender][baseToken];
        /* unclaimed reward가 있다면 클레임 */

        /* Vault에서 msg.sender의 보증금 amountIn*2 만큼 차감 요청 */
        
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(baseToken, quoteToken, amountBase, amountQuote, 0, 0, address(this), block.timestamp);
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */
        (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity + liquidity, feePerLiquidityCumulative);       
    }

    // usdt와 같은 가치를 가진 baseToken 개수 반환
    function getQuote(address quoteToken, address baseToken, uint quoteAmount) public view returns(uint baseAmount){
        address _pool = MarketRegistry(marketRegistry).getPool(baseToken);
        
        (address tokenA, ) = UniswapV2Library.sortTokens(quoteToken, baseToken);               
        (uint reserveA, uint reserveB, ) = IUniswapV2Pair(_pool).getReserves();
        (reserveA, reserveB) = tokenA == quoteToken ? (reserveA, reserveB) : (reserveB, reserveA);

        baseAmount = UniswapV2Library.quote(quoteAmount, reserveA, reserveB);        
    }   

    //유동성 추가
    function addLiquidity (address baseToken, uint quoteAmount, uint quoteMinimum, uint baseTokenMinimum, uint deadline) public hasPool(baseToken) {
        LiquidityProvider storage _provider = liquidityProvider[msg.sender][baseToken];        
        /* unclaimed reward가 있다면 클레임 */

        /* Vault에서 msg.sender의 보증금 amountIn*2 만큼 차감 요청 */

        address _quoteToken = quoteToken;
        uint baseAmount = getQuote(_quoteToken, baseToken, quoteAmount);
        
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(_quoteToken, baseToken, quoteAmount, baseAmount, quoteMinimum, baseTokenMinimum, address(this), deadline);
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */
        (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity + liquidity, feePerLiquidityCumulative);         
    }

    //유동성 제거
    function removeLiquidity (address baseToken, uint liquidity, uint quoteMinimum, uint baseTokenMinimum, uint deadline) public hasPool(baseToken) {
        LiquidityProvider storage _provider = liquidityProvider[msg.sender][baseToken];
        /* unclaimed reward가 있다면 클레임 */        

        /* msg.sender의 LPToken 보유 개수가 liquidity 보다 큰 지 확인 */
        require(_provider.liquidity >= liquidity, "");
        
        
        (uint amountA, ) = IUniswapV2Router02(router).removeLiquidity(quoteToken, baseToken, liquidity, quoteMinimum, baseTokenMinimum, address(this), deadline); 
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */        
        (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity - liquidity, feePerLiquidityCumulative);         

        /* Vault에서 msg.sender의 보증금 amountA*2 만큼 증가 요청 */
    }

    // pool에 저장된 baseToken의 시간 가중치 평균 값 반환.
    function getPricecumulativeLast(address pool, address baseToken, address quoteToken) public view returns(uint priceCumulativeLast) {
        (address tokenA, ) = UniswapV2Library.sortTokens(baseToken, quoteToken);
        priceCumulativeLast = tokenA == baseToken ? IUniswapV2Pair(pool).price0CumulativeLast() : IUniswapV2Pair(pool).price1CumulativeLast();
    }

    // 포지션 오픈
    function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
        /* Vault에서 msg.sender의 보증금 margin 만큼 차감 요청 */
        address pool = MarketRegistry(marketRegistry).getPool(baseToken);
        Position memory position;        
        (position.margin, position.isLong) = (margin, isLong);

        {
            address[] memory path = new address[](2);
            uint[] memory amounts;            
            uint fee;
            if(isLong) {
                (path[0], path[1]) = (quoteToken, baseToken);
                (amounts, fee) = _buy(path, isExactInput, amountIn, amountOut, deadline);
                (position.positionSize, position.openNotional) = (amounts[1], amounts[0]);
                longOpenInterest += position.positionSize;
            } else {

                (path[0], path[1]) = (baseToken, quoteToken);
                (amounts, fee) = _sell(path, isExactInput, amountIn, amountOut, deadline);
                (position.positionSize, position.openNotional) = (amounts[0], amounts[1]);
                shortOpenInterest += position.positionSize;
                
            }

            
            /* 수수료 누적 Vault에서 처리 예정*/
            feePerLiquidityCumulative += fee * 2**112 / IUniswapV2Pair(pool).totalSupply();            
        }

        /* closePosition 시 평균 가격을 측정하기 위한 priceCumulative, block.timestamp 저장*/
        position.priceCumulativeLast = getPricecumulativeLast(pool, baseToken, quoteToken);
        position.openPositionTimestamp = uint32(block.timestamp % 2**32);    

        /* feePerLiquidityCumulative는 매 거래마다 증가하는 고유한 값으로 거래마다 서로 다른 hash가 생성됨이 보장됨   */
        bytes32 positionHash = getpositionHash(msg.sender, baseToken, feePerLiquidityCumulative);

        /* AccountBalanace에 요청 */
        position.fundingRateCumulativeLast;        
        positionMap[msg.sender][baseToken][positionHash] = position;

        // // emit
    }

    // 사용자에 의해 호출되는 포지션 종료
    function closePosition (address baseToken, bytes32 positionHash, uint amountInput, uint amountOutput, uint deadline) public {
        _closePosition(msg.sender, baseToken, positionHash, amountInput, amountOutput, deadline);
    }

    // 사용자 또는 청산자에 의해 호출되는 포지션 종료
    function _closePosition(address trader, address baseToken, bytes32 positionHash, uint amountInput, uint amountOutput, uint deadline) internal {
        address _pool = MarketRegistry(marketRegistry).getPool(baseToken);
        Position memory position = positionMap[trader][baseToken][positionHash];        
    
        // closePosition 비율 계산
        uint closePositionSize = position.isLong ? amountInput : amountOutput;
        uint refundMargin  = position.margin - (position.margin * (position.positionSize - closePositionSize) / position.positionSize);
        int256 PNL;
        {
            address[] memory path = new address[](2);
            uint[] memory amounts;
            uint fee;
            if(position.isLong) {
                (path[0], path[1]) = (baseToken, quoteToken);
                (amounts, fee) = _sell(path, true, amountInput, amountOutput, deadline);
                
                PNL = int256(refundMargin + amounts[1]) - (int256(position.openNotional) - int256((position.openNotional * (position.positionSize - closePositionSize) / position.positionSize)));
                
                longOpenInterest -= closePositionSize;
            } else {
                (path[0], path[1]) = (quoteToken, baseToken);
                (amounts, fee) = _buy(path, false, amountInput, amountOutput, deadline);
                
                PNL = int256(refundMargin + position.openNotional) - int256((position.openNotional * (position.positionSize - closePositionSize) / position.positionSize)) - int256(amounts[0]);
                shortOpenInterest -= closePositionSize;
            }
            
            /* 수수료 누적 Vault에서 처리 예정*/
            feePerLiquidityCumulative += fee * 2**112 / IUniswapV2Pair(_pool).totalSupply();     
        }
        require(PNL > 0, "");
   
        
        int256 fundingPayment = getFundingPayment(_pool, baseToken, position.positionSize, position.fundingRateCumulativeLast, position.openPositionTimestamp, position.priceCumulativeLast);
        PNL -= fundingPayment;
             
        /* vault에 trader의 보증금 PNL만큼 증감 요청 */
        
        if(position.margin > refundMargin) {
            /* AccountBalanace에 fundingRateCumulative 요청 */
            int256 fundingRateCumulative;
            positionMap[trader][baseToken][positionHash] = Position(position.margin - refundMargin, position.positionSize - closePositionSize, position.openNotional, position.isLong, position.priceCumulativeLast, uint32(block.number % 2 ** 32), fundingRateCumulative);
        } else { 
            delete positionMap[trader][baseToken][positionHash];
        }
        // emit
    }

    // quoteToken => baseToken(롱포지션 오픈 or 숏포지션 종료)
    function _buy(address[] memory path, bool isExactInput, uint amountIn, uint amountOut, uint deadline) private returns(uint[] memory amounts, uint fee){           
        (uint amountInMaximum, uint amountOutMinimum) = (amountIn, amountOut);
   
        if(isExactInput) {  
            fee = amountIn * 3 / 1e4; // 수수료 0.03%
            amounts = IUniswapV2Router02(router).swapExactTokensForTokens(amountIn - fee, amountOutMinimum, path, address(this), deadline);                
        } else {            
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountInMaximum, amountOut, path, address(this), deadline);
            fee = amounts[0] * 3 / 1e4;
        }        
        amounts[0] += fee;
    }

    // baseToken => quoteToken(롱포지션 종료 or 숏포지션 오픈)
    function _sell(address[] memory path, bool isExactInput, uint amountIn, uint amountOut, uint deadline) private returns(uint[] memory amounts, uint fee) {           
        (uint amountInMaximum, uint amountOutMinimum) = (amountIn, amountOut);

        if(isExactInput) {
            amounts = IUniswapV2Router02(router).swapExactTokensForTokens(amountIn, amountOutMinimum, path, address(this), deadline);
            fee = amounts[1] * 3 / 1e4;
        } else {
            fee = amountOut * 3 / 1e4;
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountInMaximum, amountOut + fee, path, address(this), deadline);
        }        
        amounts[1] -= fee;
    }

    function getFundingPayment(address _pool, address baseToken, uint positionSize, int fundingRateCumulativeLast, uint32 openPositionTimestamp, uint priceCumulativeLast) private view returns(int256) {
        // AccountBalanace에 요청 
        int fundingRateCumulative;

        // 누적 funding rate와의 차이값 계산
        int fundingRate = fundingRateCumulative - fundingRateCumulativeLast;
            
        // twap 계산
        (address tokenA, ) = UniswapV2Library.sortTokens(baseToken, quoteToken);   
        uint priceCumulative = tokenA == baseToken ? IUniswapV2Pair(_pool).price0CumulativeLast() : IUniswapV2Pair(_pool).price1CumulativeLast();
        (,,uint32 blockTimestampLast) = IUniswapV2Pair(_pool).getReserves();            
        uint32 timeElapsed = blockTimestampLast - openPositionTimestamp;
        uint twap = (priceCumulative - priceCumulativeLast);            

        // 평균가격 * 체결 개수 * fundingRate
        return int256(twap) * int256(positionSize) * fundingRate  / int(int32(timeElapsed));          
    }

    function liquidateBatch (address[] memory traders, address[] memory baseTokens, bytes32[] memory positionHashs) public {
        require((traders.length == baseTokens.length) && (baseTokens.length == positionHashs.length), "");

        for(uint i = 0; i < traders.length; i++) {
            liquidate(traders[i], baseTokens[i], positionHashs[i]);
        }
    }

    function liquidate(address trader, address baseToken, bytes32 positionHash) public {
        // accountBalance에 trader, baseToken, positionHash가 청산 포지션인지 확인
        Position storage position = positionMap[msg.sender][baseToken][positionHash];
        uint clearingFee;
        // clearingFee = position.margin / 100;
        position.margin -= clearingFee;

        (uint amountInput, uint amountOutput) = position.isLong ? (position.positionSize, 0) : (type(uint256).max, position.positionSize);
        _closePosition(trader, baseToken, positionHash, amountInput, amountOutput, block.timestamp);

        //vault에 msg.sender의 보증금 clearingFee만큼 증가 요청
    }


    function setMarketRegistry(address _marketRegistry) public onlyOwner {
        marketRegistry = _marketRegistry;
    }

    function setRouter(address _router) public onlyOwner {
        router = _router;
    }

    function getMarketRegistry() public view returns(address) {
        return marketRegistry;
    }

    function getRouter() public view returns(address) {
        return router;
    }

    function approve(address _token) public onlyOwner {
        require(router != address(0), "");
        (bool success, ) = _token.call(abi.encodeWithSignature("approve(address,uint256)", router, type(uint256).max));
        require(success);
    }

    function getpositionHash(address trader, address baseToken, uint salt) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(trader, baseToken, salt));
    }
}