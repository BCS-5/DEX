//SPDX-License-Identifier: UNLICENCE
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "./libraries/UniswapV2Library.sol";
import "./interface/IMarketRegistry.sol";
import "./interface/IClearingHouse.sol";

contract ClearingHouse is IClearingHouse, Ownable{

    
    event AddLiquidity(address indexed provider, address indexed baseToken, uint liquidity);
    event RemoveLiquidity(address indexed provider, address indexed baseToken, uint liquidity);
    event UpdatePosition(address indexed trader, address indexed baseToken, bytes32 PositionHash, uint margin, uint positionSize, uint openNotional);
    event ClosePosition(address indexed trader, address indexed baseToken, bytes32 PositionHash, uint margin, uint positionSize, uint openNotional);
    event Buy(address indexed trader, address indexed baseToken, uint amountIn, uint amountOut);
    event Sell(address indexed trader, address indexed baseToken, uint amountIn, uint amountOut);
    
    mapping(address => mapping(address => mapping(bytes32 => Position))) positionMap;

    address marketRegistry;
    address router;    
    address vault;
    address accountBalance;
    address factory;    
    address quoteToken;

    // uint feePerLiquidityCumulative;         
    // uint fundingRateCumulative;

    // uint longOpenInterest;
    // uint shortOpenInterest;

    constructor() Ownable(msg.sender) {
    }

    // 유동성 풀이 존재하는지 확인
    modifier hasPool(address baseToken) {        
        require(IMarketRegistry(marketRegistry).hasPool(baseToken), "");
        _;
    }

    // 초기 유동성 풀 가격 비율 설정
    function initializePool(address baseToken, uint amountBase, uint amountQuote) public onlyOwner {        
        // LiquidityProvider storage _provider = liquidityProvider[msg.sender][baseToken];
        /* unclaimed reward가 있다면 클레임 */
        
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(baseToken, quoteToken, amountBase, amountQuote, 0, 0, address(this), block.timestamp);
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */
        // (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity + liquidity, feePerLiquidityCumulative);
        // emit AddLiquidity(msg.sender, baseToken, liquidity);
    }

    // usdt와 같은 가치를 가진 baseToken 개수 반환
    function getQuote(address quoteToken, address baseToken, uint quoteAmount) public view returns(uint baseAmount){
        address _pool = IMarketRegistry(marketRegistry).getPool(baseToken);
        
        (address tokenA, ) = UniswapV2Library.sortTokens(quoteToken, baseToken);               
        (uint reserveA, uint reserveB, ) = IUniswapV2Pair(_pool).getReserves();
        (reserveA, reserveB) = tokenA == quoteToken ? (reserveA, reserveB) : (reserveB, reserveA);

        baseAmount = UniswapV2Library.quote(quoteAmount, reserveA, reserveB);        
    }   

    //유동성 추가
    function addLiquidity (address baseToken, uint quoteAmount, uint quoteMinimum, uint baseTokenMinimum, uint deadline) public hasPool(baseToken) {
        // LiquidityProvider storage _provider = liquidityProvider[msg.sender][baseToken];        
        /* unclaimed reward가 있다면 클레임 */

        /* Vault에서 msg.sender의 보증금 amountIn*2 만큼 차감 요청 */        
        // IVault(vault).updateCollateral(msg.sender, int112(uint112(quoteAmount*2)));

        address _quoteToken = quoteToken;
        uint baseAmount = getQuote(_quoteToken, baseToken, quoteAmount);
        
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(_quoteToken, baseToken, quoteAmount, baseAmount, quoteMinimum, baseTokenMinimum, address(this), deadline);
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */
        // (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity + liquidity, feePerLiquidityCumulative);    
        // emit AddLiquidity(msg.sender, baseToken, liquidity);     
    }

    //유동성 제거
    function removeLiquidity (address baseToken, uint liquidity, uint quoteMinimum, uint baseTokenMinimum, uint deadline) public hasPool(baseToken) {
        // LiquidityProvider storage _provider = liquidityProvider[msg.sender][baseToken];
        /* unclaimed reward가 있다면 클레임 */        

        /* msg.sender의 LPToken 보유 개수가 liquidity 보다 큰 지 확인 */
        // require(_provider.liquidity >= liquidity, "");
        
        
        (uint amountA, ) = IUniswapV2Router02(router).removeLiquidity(quoteToken, baseToken, liquidity, quoteMinimum, baseTokenMinimum, address(this), deadline); 
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */        
        // (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity - liquidity, feePerLiquidityCumulative);         
        // emit RemoveLiquidity(msg.sender, baseToken, liquidity);
        /* Vault에서 msg.sender의 보증금 amountA*2 만큼 증가 요청 */
        // IVault(vault).updateCollateral(msg.sender, int112(uint112(amountA*2)))

    }

    // pool에 저장된 baseToken의 시간 가중치 평균 값 반환.
    function getPricecumulativeLast(address pool, address baseToken, address quoteToken) public view returns(uint priceCumulativeLast) {
        (address tokenA, ) = UniswapV2Library.sortTokens(baseToken, quoteToken);
        priceCumulativeLast = tokenA == baseToken ? IUniswapV2Pair(pool).price0CumulativeLast() : IUniswapV2Pair(pool).price1CumulativeLast();
    }

    // 포지션 오픈
    function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
        _openPosition(msg.sender, baseToken, isExactInput, isLong, margin, amountIn, amountOut, deadline);
    }

    function _openPosition(address trader, address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) internal {
        address pool = IMarketRegistry(marketRegistry).getPool(baseToken);
        Position memory position;        
        (position.margin, position.isLong) = (margin, isLong);

        {            
            address[] memory path = new address[](2);
            
            (path[0], path[1]) = isLong ? (quoteToken, baseToken) : (baseToken, quoteToken);
            (uint[] memory amounts, uint fee) = isLong ? _buy(trader, path, isExactInput, amountIn, amountOut, deadline) : _sell(trader, path, isExactInput, amountIn, amountOut, deadline);
            
            (position.positionSize, position.openNotional) = isLong ? (amounts[1], amounts[0]) : (amounts[0], amounts[1]);
        }            

        
        /* 수수료 누적 Vault에서 처리 예정*/
        // feePerLiquidityCumulative += fee * 2**112 / IUniswapV2Pair(pool).totalSupply(); 
        
        /* feePerLiquidityCumulative값 Valut에 요청   */
        uint feePerLiquidityCumulative;  

        /* LongOI 증가 AccountBalance에서 처리 예정 */ /* ShortOI 증가 AccountBalance에서 처리 예정 */
        // longOpenInterest += position.positionSize;
        // ShortOpenInterest += position.positionSize;      

        bytes32 positionHash = getpositionHash(trader, baseToken, feePerLiquidityCumulative);
        _updatePosition(position, trader, baseToken, positionHash );
    }

    function _updatePosition(Position memory position, address trader, address baseToken, bytes32 positionHash) internal {
        /* closePosition 시 평균 가격을 측정하기 위한 priceCumulative, block.timestamp 저장*/
        address pool = IMarketRegistry(marketRegistry).getPool(baseToken);
        position.priceCumulativeLast = getPricecumulativeLast(pool, baseToken,quoteToken);
        position.openPositionTimestamp = uint32(block.timestamp % 2**32);    

              

        /* fundingRateCumulative값 AccountBalanace에 요청 */
        // position.fundingRateCumulativeLast = ;        

        positionMap[trader][baseToken][positionHash] = position;
        emit UpdatePosition(trader, baseToken, positionHash, position.margin, position.positionSize, position.openNotional);
    }

    // 사용자에 의해 호출되는 포지션 종료
    function closePosition (address baseToken, bytes32 positionHash, uint amountIn, uint amountOut, uint deadline) public {
        _closePosition(msg.sender, baseToken, positionHash, amountIn, amountOut, deadline);
    }

    // 사용자 또는 청산자에 의해 호출되는 포지션 종료
    function _closePosition(address trader, address baseToken, bytes32 positionHash, uint amountIn, uint amountOut, uint deadline) internal {
        address _pool = IMarketRegistry(marketRegistry).getPool(baseToken);
        Position memory position = positionMap[trader][baseToken][positionHash];                
        
        {            
            address[] memory path = new address[](2);
            (path[0], path[1]) = position.isLong ? (quoteToken, baseToken) : (baseToken, quoteToken);

            (uint[] memory amounts, uint fee) = position.isLong ? _sell(trader, path, true, amountIn, amountOut, deadline) : _buy(trader, path, false, amountIn, amountOut, deadline);
            (uint positionSize, uint closeNotional) = position.isLong ? (amounts[0], amounts[1]) : (amounts[1], amounts[0]);
            uint closePercent = getClosePercent(position.positionSize, amountIn);

            /* 수수료 누적 Vault에서 처리 예정*/
            // feePerLiquidityCumulative += fee * 2**112 / IUniswapV2Pair(pool).totalSupply();

            position.margin -= position.margin * closePercent / 100;
            position.positionSize -= positionSize;
            position.openNotional -= position.openNotional * closePercent / 100;

            uint refundMargin = position.margin * closePercent / 100;
            /* fundingPayment AccountBalance에 계산 요청 */
            int256 fundingPayment;

            /* PNL AccountBalance에 계산 요청 */
            int256 PNL;

            /* vault에 trader의 보증금 PNL만큼 증감 요청 */
            // IVault(vault).updateCollateral(trader, int112(PNL))
            /* LongOI 감소 AccountBalance에서 처리 예정 */ /* ShortOI 감소 AccountBalance에서 처리 예정 */
            // LongOpenInterest -= position.positionSize;
            // ShortOpenInterest -= position.positionSize;
        }

        if(position.positionSize == 0) {
            delete positionMap[trader][baseToken][positionHash];
            //emit         
        } else {
            _updatePosition(position, trader, baseToken, positionHash);
        }
    }

    function getClosePercent(uint openPositionSize, uint closePositionSize) public pure returns(uint) {
        return closePositionSize * 100 / openPositionSize;
    }

    // quoteToken => baseToken(롱포지션 오픈 or 숏포지션 종료)
    function _buy(address trader, address[] memory path, bool isExactInput, uint amountIn, uint amountOut, uint deadline) private returns(uint[] memory amounts, uint fee){           
        (uint amountInMaximum, uint amountOutMinimum) = (amountIn, amountOut);
   
        if(isExactInput) {  
            fee = amountIn * 3 / 1e4; // 수수료 0.03%
            amounts = IUniswapV2Router02(router).swapExactTokensForTokens(amountIn - fee, amountOutMinimum, path, address(this), deadline);                
        } else {            
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountInMaximum, amountOut, path, address(this), deadline);
            fee = amounts[0] * 3 / 1e4;
        }        
        amounts[0] += fee;
        emit Buy(trader, path[1], amountIn, amountOut);
    }

    // baseToken => quoteToken(롱포지션 종료 or 숏포지션 오픈)
    function _sell(address trader, address[] memory path, bool isExactInput, uint amountIn, uint amountOut, uint deadline) private returns(uint[] memory amounts, uint fee) {           
        (uint amountInMaximum, uint amountOutMinimum) = (amountIn, amountOut);

        if(isExactInput) {
            amounts = IUniswapV2Router02(router).swapExactTokensForTokens(amountIn, amountOutMinimum, path, address(this), deadline);
            fee = amounts[1] * 3 / 1e4;
        } else {
            fee = amountOut * 3 / 1e4;
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountInMaximum, amountOut + fee, path, address(this), deadline);
        }        
        amounts[1] -= fee;
        emit Sell(trader, path[0], amountIn, amountOut);
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

        (uint amountIn, uint amountOut) = position.isLong ? (position.positionSize, 0) : (type(uint256).max, position.positionSize);
        _closePosition(trader, baseToken, positionHash, amountIn, amountOut, block.timestamp);

        //vault에 msg.sender의 보증금 clearingFee만큼 증가 요청
         // IVault(vault).updateCollateral(msg.sender, int112(uint112(clearingFee)))
    }


    function setMarketRegistry(address _marketRegistry) public onlyOwner {
        marketRegistry = _marketRegistry;
    }

    function setRouter(address _router) public onlyOwner {
        router = _router;
    }

    function setVault(address _vault) public onlyOwner {
        vault = _vault;
    }

    function setAccountBalance(address _accountBalance) public onlyOwner {
        accountBalance = _accountBalance;
    }

    function getMarketRegistry() public view returns(address) {
        return marketRegistry;
    }

    function getRouter() public view returns(address) {
        return router;
    }

    function getVault() public view returns(address) {
        return vault;
    }

    function getAccountBalance() public view returns(address) {
        return accountBalance;
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