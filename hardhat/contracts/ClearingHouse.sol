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
    mapping(address => mapping(address => mapping(bytes32 => Position))) positionMap;

    address marketRegistry;
    address router;    
    address vault;
    address accountBalance;
    address factory;    
    address quoteToken;

    constructor() Ownable(msg.sender) {
    }

    // 유동성 풀이 존재하는지 확인
    modifier hasPool(address baseToken) {        
        require(IMarketRegistry(marketRegistry).hasPool(baseToken), "");
        _;
    }

    // 초기 유동성 풀 가격 비율 설정
    function initializePool(address baseToken, uint amountBase, uint amountQuote) public onlyOwner {      
        address pool = getPool(baseToken);
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(baseToken, quoteToken, amountBase, amountQuote, 0, 0, address(this), block.timestamp);
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */        
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
        /* unclaimed reward가 있다면 클레임 */
        address pool = getPool(baseToken);
        IVault(vault).claimRewards(msg.sender, pool);

        /* Vault에서 msg.sender의 보증금 amountIn*2 만큼 차감 요청 */        
        IVault(vault).updateCollateral(msg.sender, quoteAmount*2, false);

        address _quoteToken = quoteToken;
        uint baseAmount = getQuote(_quoteToken, baseToken, quoteAmount);
        
        (,,uint liquidity) = IUniswapV2Router02(router).addLiquidity(_quoteToken, baseToken, quoteAmount, baseAmount, quoteMinimum, baseTokenMinimum, address(this), deadline);
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */
        // (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity + liquidity, feePerLiquidityCumulative);            
        IVault(vault).updateUserLP(msg.sender, pool, liquidity, true);
        emit AddLiquidity(msg.sender, baseToken, liquidity);     
    }

    //유동성 제거
    function removeLiquidity (address baseToken, uint liquidity, uint quoteMinimum, uint baseTokenMinimum, uint deadline) public hasPool(baseToken) {
        /* unclaimed reward가 있다면 클레임 */        
        address pool = getPool(baseToken);
        IVault(vault).claimRewards(msg.sender, pool);

        /* msg.sender의 LPToken 보유 개수가 liquidity 보다 큰 지 확인 */
        uint userLP = IVault(vault).getUserLP(msg.sender, pool);
        require(userLP >= liquidity, "");
                
        (uint amountA, ) = IUniswapV2Router02(router).removeLiquidity(quoteToken, baseToken, liquidity, quoteMinimum, baseTokenMinimum, address(this), deadline); 
        
        /* msg.sender => baseToken => lp토큰 개수 업데이트 */        
        // (_provider.liquidity, _provider.feePerLiquidityCumulativeLast) = (_provider.liquidity - liquidity, feePerLiquidityCumulative); 
        IVault(vault).updateUserLP(msg.sender, pool, liquidity, false);

        emit RemoveLiquidity(msg.sender, baseToken, liquidity);

        /* Vault에서 msg.sender의 보증금 amountA*2 만큼 증가 요청 */
        IVault(vault).updateCollateral(msg.sender, amountA*2, true);

    }

    // pool에 저장된 baseToken의 시간 가중치 평균 값 반환.
    function getPricecumulativeLast(address baseToken, address quoteToken) public view returns(uint priceCumulativeLast) {
        address pool = getPool(baseToken);
        (address tokenA, ) = UniswapV2Library.sortTokens(baseToken, quoteToken);
        priceCumulativeLast = tokenA == baseToken ? IUniswapV2Pair(pool).price0CumulativeLast() : IUniswapV2Pair(pool).price1CumulativeLast();
    }

    function addMargin(address baseToken, bytes32 positionHash, uint amount) public {
        _updateMargin(msg.sender, baseToken, positionHash, int(amount));
    }

    function _updateMargin(address trader, address baseToken, bytes32 positionHash, int amount) internal {
        Position storage position = positionMap[msg.sender][baseToken][positionHash];        

        IVault(vault).updateCollateral(trader, uint(amount > 0 ? amount : -amount), amount < 0);

        if(amount > 0)
            position.margin += uint(amount);
        else
            position.margin -= uint(-amount);
        emit UpdatePosition(trader, baseToken, positionHash, position.margin, position.positionSize, position.openNotional);
    }

    // 포지션 오픈
    function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
        _openPosition(msg.sender, baseToken, isExactInput, isLong, margin, amountIn, amountOut, deadline);
    }

    function _openPosition(address trader, address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) internal {
        address pool = getPool(baseToken);
        Position memory position;        
        (position.margin, position.isLong) = (margin, isLong);
        IVault(vault).updateCollateral(trader, margin, false);

        {             
            address[] memory path = new address[](2);
            
            (path[0], path[1]) = isLong ? (quoteToken, baseToken) : (baseToken, quoteToken);
            (uint[] memory amounts, uint fee) = isLong ? _buy(trader, path, isExactInput, amountIn, amountOut, deadline) : _sell(trader, path, isExactInput, amountIn, amountOut, deadline);
            
            (position.positionSize, position.openNotional) = isLong ? (amounts[1], amounts[0]) : (amounts[0], amounts[1]);            
            require(position.openNotional <= margin * 100, "Exceeded the maximum allowed leverage");

            IVault(vault).setCumulativeTransactionFee(pool, fee);
        }                    

        /* feePerLiquidityCumulative값 Valut에 요청   */
        uint feePerLiquidityCumulative = IVault(vault).getCumulativeTransactionFee(pool);  

        /* Long or Short 포지션 규모 누적 */
        IAccountBalance(accountBalance).setOpenInterest(baseToken, int256(position.positionSize), isLong);

        bytes32 positionHash = getpositionHash(trader, baseToken, feePerLiquidityCumulative);
        _updatePosition(position, trader, baseToken, positionHash );
    }

    function _updatePosition(Position memory position, address trader, address baseToken, bytes32 positionHash) internal {
        /* closePosition 시 평균 가격을 측정하기 위한 priceCumulative, block.timestamp 저장*/        
        position.priceCumulativeLast = getPricecumulativeLast(baseToken,quoteToken);
        position.openPositionTimestamp = uint32(block.timestamp % 2**32);    

        /* fundingRateCumulative값 AccountBalanace에 요청 */
        position.fundingRateCumulativeLast = position.isLong ? 
            IAccountBalance(accountBalance).cumulativeLongFundingRates(baseToken) : IAccountBalance(accountBalance).cumulativeShortFundingRates(baseToken);        

        positionMap[trader][baseToken][positionHash] = position;
        emit UpdatePosition(trader, baseToken, positionHash, position.margin, position.positionSize, position.openNotional);
    }

    // 사용자에 의해 호출되는 포지션 종료
    function closePosition (address baseToken, bytes32 positionHash, uint amountIn, uint amountOut, uint deadline) public {
        _closePosition(msg.sender, baseToken, positionHash, amountIn, amountOut, deadline);
    }

    // 사용자 또는 청산자에 의해 호출되는 포지션 종료
    function _closePosition(address trader, address baseToken, bytes32 positionHash, uint amountIn, uint amountOut, uint deadline) internal {
        address pool = IMarketRegistry(marketRegistry).getPool(baseToken);
        Position memory position = positionMap[trader][baseToken][positionHash];                
        
        /* fundingPayment AccountBalance에 계산 요청 */
        int256 fundingPayment = IAccountBalance(accountBalance).calculateFundingPayment(position, baseToken, pool);
        {            
            address[] memory path = new address[](2);
            (path[0], path[1]) = position.isLong ? (baseToken, quoteToken ) : (quoteToken, baseToken);
            
            (uint[] memory amounts, uint fee) = position.isLong ? _sell(trader, path, true, amountIn, amountOut, deadline) : _buy(trader, path, false, amountIn, amountOut, deadline);
            (uint positionSize, uint closeNotional) = position.isLong ? (amounts[0], amounts[1]) : (amounts[1], amounts[0]);            
            

            /* 수수료 적립 */
            IVault(vault).setCumulativeTransactionFee(pool, fee);

            /* PNL 정리 */
            _settlePNL(position, trader, positionSize, closeNotional, fundingPayment);
        }        

        /* LongOI 감소 AccountBalance에서 처리 예정 */ /* ShortOI 감소 AccountBalance에서 처리 예정 */            
        IAccountBalance(accountBalance).setOpenInterest(baseToken, -int256(position.positionSize), position.isLong);

        if(position.positionSize == 0) {
            delete positionMap[trader][baseToken][positionHash];
            //emit         
        } else {
            _updatePosition(position, trader, baseToken, positionHash);
        }
    }

    function _settlePNL(Position memory position, address trader, uint closePositionSize, uint closeNotional, int256 fundingPayment) private {
        uint closePercent = closePositionSize * 100 / position.positionSize;
        uint refundMargin = position.margin * closePercent / 100;        
        uint256 leverage = position.openNotional * closePercent / 100;

        position.margin -= refundMargin;
        position.positionSize -= closePositionSize;
        position.openNotional -= leverage;

        console.log(position.isLong ? "Long":"Short");
        console.log(uint(fundingPayment > 0 ? fundingPayment:-fundingPayment), fundingPayment >0 );
        console.log(refundMargin, leverage, closeNotional);

        int PNL = int256(refundMargin) + fundingPayment;
        if(position.isLong) {
            PNL += int256(closeNotional) - int256(leverage);
        }else {
            PNL += int256(leverage) - int256(closeNotional);
        }

        IVault(vault).updateCollateral(trader, PNL > 0 ? uint(PNL) : uint(-PNL), PNL > 0);
    }

    // quoteToken => baseToken(롱포지션 오픈 or 숏포지션 종료)
    function _buy(address trader, address[] memory path, bool isExactInput, uint amountIn, uint amountOut, uint deadline) private returns(uint[] memory amounts, uint fee){           
        (uint amountInMaximum, uint amountOutMinimum) = (amountIn, amountOut);
        if(isExactInput) {  
            fee = amountIn * 3 / 1e4; // 수수료 0.03%
            amounts = IUniswapV2Router02(router).swapExactTokensForTokens(amountIn - fee, amountOutMinimum, path, address(this), deadline);                
        } else {            
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountOut, amountInMaximum, path, address(this), deadline);
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
            amounts = IUniswapV2Router02(router).swapTokensForExactTokens(amountOut + fee, amountInMaximum, path, address(this), deadline);
        }        
        amounts[1] -= fee;
        emit Sell(trader, path[0], amountIn, amountOut);
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
         IVault(vault).updateCollateral(msg.sender, clearingFee, true);
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

    function getPool(address baseToken) internal view returns(address) {
        return IMarketRegistry(marketRegistry).getPool(baseToken);
    }

    function getPosition(address trader, address baseToken, bytes32 positionHash) public view returns(Position memory) {
        return positionMap[trader][baseToken][positionHash];
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