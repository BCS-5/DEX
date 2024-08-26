// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

interface IOpenOrder {
    // 주문 상태 열거형
    enum OrderStatus { PENDING, EXECUTED, CANCELLED }

    // 주문 구조체
    struct Order {
        address trader;      // 트레이더 주소
        address baseToken;   // 기본 토큰 주소
        uint256 margin;      // 증거금
        uint256 amountIn;    // 입력 금액
        uint256 amountOut;   // 출력 금액
        bool isLong;         // 롱 포지션 여부
        OrderStatus status;  // 주문 상태
    }

    // 이벤트
    event OrderCreated(address indexed trader, address indexed baseToken, uint256 indexed orderId, uint256 margin, uint256 amountIn, uint256 amountOut, bool isLong);
    event OrderExecuted(address indexed trader, address indexed baseToken, uint256 indexed orderId);
    event OrderCancelled(address indexed trader, address indexed baseToken, uint256 indexed orderId);

    // 주문 생성 함수
    function createOrder(address baseToken, uint256 margin, uint256 amountIn, uint256 amountOut, bool isLong) external;

    // 주문 실행 함수
    function executeOrder(uint256 orderId) external;

    // 주문 취소 배치 함수
    function cancelOrderBatch(uint256[] memory orderIds) external;

    // 주문 취소 함수
    function cancelOrder(uint256 orderId) external;

    // 주문 실행 조건 확인 함수
    function checkExecutionCondition(Order memory order) external view returns (bool);

    // 주문 정보 조회 함수
    // function orders(uint256 orderId) external view returns (Order memory);

    // 다음 주문 ID 조회 함수
    function nextOrderId() external view returns (uint256);

    // 외부 컨트랙트 주소 설정 함수
    function setClearingHouse(address _clearingHouse) external;
    function setMarketRegistry(address _marketRegistry) external;
    function setAccountBalance(address _accountBalance) external;
    function setUniswapRouter(address _uniswapRouter) external;

    // 외부 컨트랙트 주소 조회 함수
    // function clearingHouse() external view returns (address);
    // function marketRegistry() external view returns (address);
    // function accountBalance() external view returns (address);
    // function uniswapRouter() external view returns (address);
}