// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import "./interfaces/IClearingHouse.sol";
import "./interfaces/IMarketRegistry.sol";
import "./interfaces/IAccountBalance.sol";
import "./interfaces/IOpenOrder.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenOrder is IOpenOrder,Ownable {
    // 외부 컨트랙트 인터페이스
    IClearingHouse public clearingHouse;
    IMarketRegistry public marketRegistry;
    IAccountBalance public accountBalance;
    IUniswapV2Router02 public uniswapRouter;

    // 주문 ID에 대한 주문 매핑
    mapping(uint256 => Order) public orders;
    // 다음 주문 ID
    uint256 public nextOrderId;

    // 거래 만료 시간 (5분)
    uint256 public constant TRADE_DEADLINE = 5 minutes;

    // 생성자
    constructor() Ownable(msg.sender) {
        clearingHouse = IClearingHouse(0xAcA919554aACE3aE08aEba17Ad9519bE16234fa6);
        marketRegistry = IMarketRegistry(0x9a37A60c1CaA20081E5543dF598Ac5a3CcA815C9);
        accountBalance = IAccountBalance(0x1dDCac4613623824b1fbc944217bC5764bdD74e8);
        uniswapRouter = IUniswapV2Router02(0x921C79fa5E725a8851501540fD0F73FD303173b3);
    }

    // 주문 생성 함수
    function createOrder(address baseToken, uint256 margin, uint256 amountIn, uint256 amountOut, bool isLong) external {
        require(marketRegistry.hasPool(baseToken), "Pool does not exist");

        orders[nextOrderId] = Order({
            trader: msg.sender,
            baseToken: baseToken,
            margin: margin,
            amountIn: amountIn,
            amountOut: amountOut,
            isLong: isLong,
            status: OrderStatus.PENDING
        });

        emit OrderCreated(msg.sender, baseToken, nextOrderId, margin, amountIn, amountOut, isLong);
        nextOrderId++;
    }

    // 주문 실행 함수
    function executeOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.PENDING, "Order is not pending");
        
        require(checkExecutionCondition(order), "Execution condition not met");

        // ClearingHouse의 openPositionForOrderBook 호출
        clearingHouse.openPositionForOrderBook(
            order.trader,
            order.baseToken,
            true,  // isExactInput
            order.isLong,
            order.margin,
            order.amountIn,
            order.amountOut,
            block.timestamp + TRADE_DEADLINE
        );

        order.status = OrderStatus.EXECUTED;
        emit OrderExecuted(order.trader, order.baseToken, orderId);
    }

    // 주문 취소 배치 함수
    function cancelOrderBatch(uint256[] memory orderIds) external {
        for(uint i = 0; i < orderIds.length; i++) {
            cancelOrder(orderIds[i]);
        }
    }

    // 주문 취소 함수
    function cancelOrder(uint256 orderId) public {
        Order storage order = orders[orderId];
        require(msg.sender == order.trader, "Only order owner can cancel");
        require(order.status == OrderStatus.PENDING, "Order is not pending");

        order.status = OrderStatus.CANCELLED;
        emit OrderCancelled(order.trader, order.baseToken, orderId);
    }

    // 주문 실행 조건 확인 함수
    function checkExecutionCondition(Order memory order) public view returns (bool) {
        address[] memory path = new address[](2);
        path[0] = order.isLong ? marketRegistry.getQuoteToken() : order.baseToken;
        path[1] = order.isLong ? order.baseToken : marketRegistry.getQuoteToken();

        // Uniswap Router를 사용하여 실제 교환 가능한 금액 계산
        uint256[] memory amounts = uniswapRouter.getAmountsOut(order.amountIn, path);
        uint256 expectedOutput = amounts[1];

        // Long 포지션: 예상 출력이 주문의 amountOut 이하일 때 실행
        // Short 포지션: 예상 출력이 주문의 amountOut 이상일 때 실행
        return expectedOutput >= order.amountOut;
    }

    // ClearingHouse 주소 설정 함수 (오너만 호출 가능)
    function setClearingHouse(address _clearingHouse) external onlyOwner {
        clearingHouse = IClearingHouse(_clearingHouse);
    }

    // MarketRegistry 주소 설정 함수 (오너만 호출 가능)
    function setMarketRegistry(address _marketRegistry) external onlyOwner {
        marketRegistry = IMarketRegistry(_marketRegistry);
    }

    // AccountBalance 주소 설정 함수 (오너만 호출 가능)
    function setAccountBalance(address _accountBalance) external onlyOwner {
        accountBalance = IAccountBalance(_accountBalance);
    }

    // UniswapRouter 주소 설정 함수 (오너만 호출 가능)
    function setUniswapRouter(address _uniswapRouter) external onlyOwner {
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }
}