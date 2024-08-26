// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "./libraries/UniswapV2Library.sol";
import "./console.sol";

import {IMarketRegistry} from "./interfaces/IMarketRegistry.sol";
import { IClearingHouse } from "./interfaces/IClearingHouse.sol";
import { IAccountBalance } from "./interfaces/IAccountBalance.sol";
import { IVault } from "./interfaces/IVault.sol";

contract ClearingHouse is IClearingHouse, Ownable{        
    mapping(address => mapping(address => mapping(bytes32 => Position))) positionMap;       // trader => baseToken => Position

    address marketRegistry;
    address router;    
    address vault;
    address accountBalance;
    address orderBook;
    address factory;    
    address quoteToken;

    constructor() Ownable(msg.sender) {
    }

    // 유동성 풀이 존재하는지 확인
    modifier hasPool(address baseToken) {        
        require(IMarketRegistry(marketRegistry).hasPool(baseToken), "");
        _;
    }

    modifier onlyOrderBook() {        
        require(msg.sender == orderBook , "No permission");
        _;
    }

    // 초기 유동성 풀 가격 비율 설정
    function initializePool(address baseToken, uint amountBase, uint amountQuote) public onlyOwner {      
        address pool = getPool(baseToken);

        // 유동성 추가
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(baseToken, quoteToken, amountBase, amountQuote, 0, 0, address(this), block.timestamp);
        
        // msg.sender => baseToken => lp토큰 개수 업데이트
        IVault(vault).updateUserLP(msg.sender, pool, liquidity, true);
        emit AddLiquidity(msg.sender, baseToken, liquidity);
    }

    // usdt와 같은 가치를 가진 baseToken 개수 반환
    function getQuote(address quoteToken, address baseToken, uint quoteAmount) public view returns(uint baseAmount){
        address pool = getPool(baseToken);
                
        (address tokenA, ) = UniswapV2Library.sortTokens(quoteToken, baseToken);               
        (uint reserveA, uint reserveB, ) = IUniswapV2Pair(pool).getReserves();
        (reserveA, reserveB) = tokenA == quoteToken ? (reserveA, reserveB) : (reserveB, reserveA);

        baseAmount = UniswapV2Library.quote(quoteAmount, reserveA, reserveB);        
    }   

    //유동성 추가
    function addLiquidity (address baseToken, uint quoteAmount, uint quoteMinimum, uint baseTokenMinimum, uint deadline) public hasPool(baseToken) {         
        // unclaimed reward가 있다면 클레임
        address pool = getPool(baseToken);
        IVault(vault).claimRewards(msg.sender, pool);

       // Vault에서 msg.sender의 보증금 amountIn*2 만큼 차감 요청        
        IVault(vault).updateCollateral(msg.sender, quoteAmount*2, false);

        address _quoteToken = quoteToken;
        uint baseAmount = getQuote(_quoteToken, baseToken, quoteAmount);
        
        // 유동성 추가
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(_quoteToken, baseToken, quoteAmount, baseAmount, quoteMinimum, baseTokenMinimum, address(this), deadline);
        
        // msg.sender => baseToken => lp토큰 개수 업데이트          
        IVault(vault).updateUserLP(msg.sender, pool, liquidity, true);
        emit AddLiquidity(msg.sender, baseToken, liquidity);     
    }

    //유동성 제거
    function removeLiquidity (address baseToken, uint liquidity, uint quoteMinimum, uint baseTokenMinimum, uint deadline) public hasPool(baseToken) {
        // unclaimed reward가 있다면 클레임       
        address pool = getPool(baseToken);
        IVault(vault).claimRewards(msg.sender, pool);

        // msg.sender의 LPToken 보유 개수가 liquidity 보다 큰 지 확인 
        uint userLP = IVault(vault).getUserLP(msg.sender, pool);
        require(userLP >= liquidity, "Insufficient LP tokens");
                
        // 유동성 제거
        (uint amountA, ) = IUniswapV2Router02(router).removeLiquidity(quoteToken, baseToken, liquidity, quoteMinimum, baseTokenMinimum, address(this), deadline); 
        
        // msg.sender => baseToken => lp토큰 개수 업데이트        
        IVault(vault).updateUserLP(msg.sender, pool, liquidity, false);

        emit RemoveLiquidity(msg.sender, baseToken, liquidity);

        // Vault에서 msg.sender의 보증금 amountA*2 만큼 증가 요청 
        IVault(vault).updateCollateral(msg.sender, amountA*2, true);
    }

    // pool에 저장된 baseToken의 시간 가중치 가격 반환.
    function getPricecumulativeLast(address baseToken, address quoteToken) public view returns(uint priceCumulativeLast) {
        address pool = getPool(baseToken);
        (address tokenA, ) = UniswapV2Library.sortTokens(baseToken, quoteToken);
        priceCumulativeLast = tokenA == baseToken ? IUniswapV2Pair(pool).price0CumulativeLast() : IUniswapV2Pair(pool).price1CumulativeLast();
    }

    // position의 보증금 추가 입금
    function addMargin(address baseToken, bytes32 positionHash, uint amount) public {
        _updateMargin(msg.sender, baseToken, positionHash, int(amount));
    }

    // position의 보증금 업데이트
    function _updateMargin(address trader, address baseToken, bytes32 positionHash, int amount) internal {
        Position storage position = positionMap[trader][baseToken][positionHash];        

        // Vault에 있는 보증금 업데이트
        IVault(vault).updateCollateral(trader, uint(amount > 0 ? amount : -amount), amount < 0);

        // position에 있는 보증금 업데이트
        if(amount > 0)
            position.margin += uint(amount);
        else
            position.margin -= uint(-amount);
        emit UpdatePosition(trader, baseToken, positionHash, position.margin, position.positionSize, position.openNotional, position.isLong);
    }

    // 포지션 오픈
    function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
        _openPosition(msg.sender, baseToken, isExactInput, isLong, margin, amountIn, amountOut, deadline);
    }

    // 예약 주문에 의한 포지션 오픈
    function openPositionForOrderBook(address trader, address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) onlyOrderBook {
        _openPosition(trader, baseToken, isExactInput, isLong, margin, amountIn, amountOut, deadline);
    }

    function _openPosition(address trader, address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) internal {
        address pool = getPool(baseToken);
        Position memory position;        
        (position.margin, position.isLong) = (margin, isLong);

        // Vault에 있는 보증금 차감
        IVault(vault).updateCollateral(trader, margin, false);
        {             
            address[] memory path = new address[](2);
            
            // Long: USDT => baseToken, short: baseToken => USDT
            (path[0], path[1]) = isLong ? (quoteToken, baseToken) : (baseToken, quoteToken);
            (uint[] memory amounts, uint liquidityFee, uint orderBookFee) = isLong ? _buy(trader, path, isExactInput, amountIn, amountOut, deadline) : _sell(trader, path, isExactInput, amountIn, amountOut, deadline);
            
            (position.positionSize, position.openNotional) = isLong ? (amounts[1], amounts[0]) : (amounts[0], amounts[1]);            
            require(position.openNotional <= margin * 100, "Exceeded the maximum allowed leverage");

            // 수수료 누적
            IVault(vault).setCumulativeTransactionFee(pool, liquidityFee);
            if(orderBookFee > 0) {
                IVault(vault).updateCollateral(tx.origin, orderBookFee, true);
            }
        }                    

        // feePerLiquidityCumulative값 Valut에 요청
        uint feePerLiquidityCumulative = IVault(vault).getCumulativeTransactionFee(pool);  

        // Long or Short 포지션 규모 누적
        IAccountBalance(accountBalance).setOpenInterest(baseToken, int256(position.positionSize), isLong);

        bytes32 positionHash = getpositionHash(trader, baseToken, feePerLiquidityCumulative);
        _updatePosition(position, trader, baseToken, positionHash );
    }

    // 포지션 오픈 or 포지션 종료 시 현재 시점의 누적 토큰 가격, timestamp, 누적 fundingRate 갱신
    function _updatePosition(Position memory position, address trader, address baseToken, bytes32 positionHash) internal {
        // closePosition 시 평균 가격을 측정하기 위한 priceCumulative, block.timestamp 저장
        position.priceCumulativeLast = getPricecumulativeLast(baseToken,quoteToken);
        position.openPositionTimestamp = uint32(block.timestamp % 2**32);    

        // fundingRateCumulative값 AccountBalanace에 요청
        position.fundingRateCumulativeLast = position.isLong ? 
            IAccountBalance(accountBalance).cumulativeLongFundingRates(baseToken) : IAccountBalance(accountBalance).cumulativeShortFundingRates(baseToken);        

        positionMap[trader][baseToken][positionHash] = position;
        emit UpdatePosition(trader, baseToken, positionHash, position.margin, position.positionSize, position.openNotional, position.isLong);
    }

    // 사용자에 의해 호출되는 포지션 종료
    function closePosition (address baseToken, bytes32 positionHash, uint closePercent, uint slippageAdjustedAmount, uint deadline) public {
        _closePosition(msg.sender, baseToken, positionHash, closePercent, slippageAdjustedAmount, deadline);
    }

    function closePositionBatch (address[] memory baseTokens, bytes32[] memory positionHashs, uint[] memory slippageAdjustedAmounts, uint deadline) public {
        require(baseTokens.length == positionHashs.length && positionHashs.length == slippageAdjustedAmounts.length, "Array lengths do not match");

        for(uint i = 0; i < baseTokens.length; i++ ) {
            _closePosition(msg.sender, baseTokens[i], positionHashs[i], 100, slippageAdjustedAmounts[i], deadline);
        }
    }

    // 예약 주문에 의해 호출되는 포지션 종료
    function closePositionForOrderBook (address trader, address baseToken, bytes32 positionHash, uint closePercent, uint slippageAdjustedAmount, uint deadline) public onlyOrderBook{
        _closePosition(trader, baseToken, positionHash, closePercent, slippageAdjustedAmount, deadline);
    }

    // 사용자 또는 청산자에 의해 호출되는 포지션 종료
    function _closePosition(address trader, address baseToken, bytes32 positionHash, uint closePercent, uint slippageAdjustedAmount, uint deadline) internal {
        address pool = IMarketRegistry(marketRegistry).getPool(baseToken);
        Position memory position = positionMap[trader][baseToken][positionHash];        

        if(closePercent == 100) 
            emit ClosePosition(trader, baseToken, positionHash, position.margin, position.positionSize, position.openNotional, position.isLong);        
        
        // fundingPayment AccountBalance에 계산 요청         
        int256 fundingPayment = IAccountBalance(accountBalance).calculateFundingPayment(position, baseToken, pool);
        {            
            address[] memory path = new address[](2);
            // Long: baseToken => USDT, Short: USDT => baseToken
            (path[0], path[1]) = position.isLong ? (baseToken, quoteToken ) : (quoteToken, baseToken);
            
            uint closePositionSize = closePercent * position.positionSize / 100;

            (uint[] memory amounts, uint liquidityFee, uint orderBookFee) = position.isLong ? _sell(trader, path, true, closePositionSize, slippageAdjustedAmount, deadline) : _buy(trader, path, false, slippageAdjustedAmount, closePositionSize, deadline);
            
            // 수수료 적립
            IVault(vault).setCumulativeTransactionFee(pool, liquidityFee);
            if(orderBookFee > 0) {
                IVault(vault).updateCollateral(tx.origin, orderBookFee, true);
            }

            if(!position.isLong) {
                (amounts[0], amounts[1]) = (amounts[1], amounts[0]); // amounts[0]: closePositionSize, amounts[1]: closeNotional                             
            }            

            // 포지션의 크기에 비례하는 수익 또는 손해, 펀딩비 정산
            _settlePNL(position, trader, baseToken, positionHash, amounts[0], amounts[1], fundingPayment);

            // 종료된 포지션의 크기만큼 Long, Short OI 감소
            IAccountBalance(accountBalance).setOpenInterest(baseToken, -int256(closePositionSize), position.isLong);              
        }        

        // 모든 계약이 청산되면 Close, 일부 남아 있으면 Update
        if(position.positionSize == 0) {
            delete positionMap[trader][baseToken][positionHash];
        } else {
            _updatePosition(position, trader, baseToken, positionHash);
        }
    }

    // 손익 계산 및 정산
    function _settlePNL(Position memory position, address trader, address baseToken, bytes32 positionHash, uint closePositionSize, uint closeNotional, int256 fundingPayment) private {                
        
        uint closePercent = closePositionSize * 100 / position.positionSize;
        uint refundMargin = position.margin * closePercent / 100;        
        int PNL = int256(refundMargin) + fundingPayment;
        uint256 leverage = position.openNotional * closePercent / 100;

        position.margin -= refundMargin;
        position.positionSize -= closePositionSize;
        position.openNotional -= leverage;

        bool isLong = position.isLong;        
        if(isLong) {
            PNL += int256(closeNotional) - int256(leverage);
        } else {
            PNL += int256(leverage) - int256(closeNotional);
        }
        
        IVault(vault).updateCollateral(trader, PNL > 0 ? uint(PNL) : uint(-PNL), PNL > 0);
        
        emit SettlePNL(trader, baseToken, positionHash, refundMargin, closePositionSize, closeNotional, isLong, PNL);
    }

    // base => quote, quote => base 모두 quote로 지불
    // quoteToken => baseToken(롱포지션 오픈 or 숏포지션 종료)
    function _buy(address trader, address[] memory path, bool isExactInput, uint amountIn, uint amountOut, uint deadline) private returns(uint[] memory amounts, uint liquidityFee, uint orderBookFee){           
        (uint amountInMaximum, uint amountOutMinimum) = (amountIn, amountOut);
        bool isOrderBook = msg.sender == orderBook;
        uint fee;

        if(isExactInput) {  
            // 0.03%~0.05% 만큼 baseToken이 적게 나오도록 함
            liquidityFee = amountIn * 3 / 1e4;
            orderBookFee = isOrderBook ? amountIn * 2 / 1e4 : 0;            
            fee = liquidityFee + orderBookFee; 
            amounts = IUniswapV2Router02(router).swapExactTokensForTokens(amountIn - fee, amountOutMinimum, path, address(this), deadline);                
        } else {                        
            // 지불한 금액의 0.03%~0.05% 만큼 USDT를 추가로 지불하게 함
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountOut, amountInMaximum, path, address(this), deadline);            
            liquidityFee = amounts[0] * 3 / 1e4;
            orderBookFee = isOrderBook ? amounts[0] * 2 / 1e4 : 0;            
            fee = liquidityFee + orderBookFee; 
        }        
        emit Buy(trader, path[1], amounts[0], amounts[1]);
        amounts[0] += fee;
    }

    // baseToken => quoteToken(롱포지션 종료 or 숏포지션 오픈)
    function _sell(address trader, address[] memory path, bool isExactInput, uint amountIn, uint amountOut, uint deadline) private returns(uint[] memory amounts, uint liquidityFee, uint orderBookFee) {           
        (uint amountInMaximum, uint amountOutMinimum) = (amountIn, amountOut);
        bool isOrderBook = msg.sender == orderBook;
        uint fee;

        if(isExactInput) {
            // 0.03%~0.05%만큼 USDT가 적게 나오도록 함
            amounts = IUniswapV2Router02(router).swapExactTokensForTokens(amountIn, amountOutMinimum, path, address(this), deadline);
            liquidityFee = amounts[1] * 3 / 1e4;
            orderBookFee = isOrderBook ? amounts[1] * 2 / 1e4 : 0;            
            fee = liquidityFee + orderBookFee; 
        } else {
            // 0.03%~0.05%만큼 USDT가 더 나오도록 baseToken을 더 요구함
            liquidityFee = amountOut * 3 / 1e4;
            orderBookFee = isOrderBook ? amountOut * 2 / 1e4 : 0;            
            fee = liquidityFee + orderBookFee; 
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountOut + fee, amountInMaximum, path, address(this), deadline);
        }        
        emit Sell(trader, path[0], amounts[0], amounts[1]);
        amounts[1] -= fee;
    }

    // 다수의 포지션 동시에 정리
    function liquidateBatch (address[] memory traders, address[] memory baseTokens, bytes32[] memory positionHashs) public {
        require((traders.length == baseTokens.length) && (baseTokens.length == positionHashs.length), "");

        for(uint i = 0; i < traders.length; i++) {
            liquidate(traders[i], baseTokens[i], positionHashs[i]);
        }
    }

    // 하나의 포지션 정리
    function liquidate(address trader, address baseToken, bytes32 positionHash) public {
        // accountBalance에 trader, baseToken, positionHash가 청산 포지션인지 확인
        Position storage position = positionMap[trader][baseToken][positionHash];

        address pool = getPool(baseToken);
        
        bool isLiquidatable = IAccountBalance(accountBalance).checkLiquidation(position, baseToken, pool);
        // require로 작성 시 liquidateBatch 함수로 포지션 정리 시 1개라도 청산 조건에 만족하지 못 할 경우 모두 취소되기 때문에 if문으로 return
        if(!isLiquidatable) {
            return;
        }

        uint clearingFee = position.margin / 100;
        position.margin -= clearingFee;

        uint slippageAdjustedAmount = position.isLong ? 0 : type(uint256).max;
        _closePosition(trader, baseToken, positionHash, 100, slippageAdjustedAmount, block.timestamp);

        //vault에 msg.sender의 보증금 clearingFee만큼 증가 요청
         IVault(vault).updateCollateral(msg.sender, clearingFee, true);
    }

    // router가 virtual token에 접근할 수 있도록 approve
    function approve(address _token) public onlyOwner {
        require(router != address(0), "");
        (bool success, ) = _token.call(abi.encodeWithSignature("approve(address,uint256)", router, type(uint256).max));
        require(success);
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

    function setOrderBook(address _orderBook) public onlyOwner {
        orderBook = _orderBook;
    }

    function setQuoteToken(address _quete) public onlyOwner {
        quoteToken = _quete;
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

    function getOrderBook() public view returns(address) {
        return orderBook;
    }

    function getPool(address baseToken) internal view returns(address) {
        return IMarketRegistry(marketRegistry).getPool(baseToken);
    }

    function getPosition(address trader, address baseToken, bytes32 positionHash) public view returns(Position memory) {
        return positionMap[trader][baseToken][positionHash];
    }

    function getpositionHash(address trader, address baseToken, uint salt) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(trader, baseToken, salt));
    }
}