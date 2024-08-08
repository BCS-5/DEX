// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 < 0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";  
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

// 계정 잔액을 관리하는 스마트 컨트랙트
contract AccountBalance is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    // 클리어링 하우스 설정 주소
    address private CLEARING_HOUSE;
    // 금고 주소
    address private VAULT;
    //콜백함수 호출하는 주소
    address private KEEPER;
    
    // 기본 토큰 주소에 대한 마지막 펀딩 시간 매핑
    mapping(address => uint256) public lastFundingTimes;
    
    // 기본 토큰 주소에 대한 Uniswap 페어 주소 매핑
    mapping(address => address) public uniswapPairs;
    
    // 펀딩 지불 정산 이벤트
    event FundingPaymentSettled(address indexed trader, address indexed baseToken, int256 longFundingPayment, int256 shortFundingPayment);
    // 청산 경고 이벤트
    event LiquidationWarning(address indexed trader, address indexed baseToken, int256 positionSize, uint256 marginRatio);
    
    // 기본 토큰 주소에 대한 누적 롱 펀딩 비율 매핑
    mapping(address => mapping(address => int256)) public userLongFundingPayments;
    // 기본 토큰 주소에 대한 누적 숏 펀딩 비율 매핑
    mapping(address => mapping(address => int256)) public userShortFundingPayments;
    // 포지션 매핑
    mapping(address => mapping(address => int256)) public positions;

    // 생성자: 클리어링 하우스 설정과 금고 주소 초기화
    constructor(address _clearingHouse, address _vault) {
        CLEARING_HOUSE = _clearingHouse;
        VAULT = _vault;
        KEEPER = msg.sender;
    }

    // 초기화 함수: Ownable 컨트랙트 초기화
    function initialize() external initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
    }

    //Keeper 설정 함수
    function setKeeper(address newKeeper) external {
    require(msg.sender == KEEPER, "권한이 없습니다");
    KEEPER = newKeeper;
    }

    // Uniswap 페어 주소 설정 함수 (오너만 호출 가능)
    function setUniswapPair(address baseToken, address pairAddress) external onlyOwner nonReentrant{
        uniswapPairs[baseToken] = pairAddress;
    }

    // 펀딩 비율 업데이트 함수 (콜백 함수 호출할 때마다 갱신)
    function updateFundingRate(address baseToken) public nonReentrant {
    require(msg.sender == KEEPER, "접근 권한이 없습니다");

    uint256 currentTime = block.timestamp;
    uint256 timePassed = currentTime - lastFundingTimes[baseToken];
    if (timePassed == 0) return;

    uint256 currentPrice = getPrice(baseToken);
    uint256 markPrice = getMarkPrice(baseToken);
    
    // 가격 차이에 기반한 펀딩 비율 계산
    int256 priceDelta = int256(currentPrice) - int256(markPrice);
    int256 fundingRate = (priceDelta * int256(timePassed)) / (int256(currentPrice) * 1 days);
    
    // 펀딩 비율 제한 (-0.1% ~ 0.1%)
    fundingRate = fundingRate > 1e15 ? 1e15 : (fundingRate < -1e15 ? -1e15 : fundingRate);
    
    // 롱 포지션과 숏 포지션 각각의 펀딩 비율 계산
    int256 longFundingRate = fundingRate > 0 ? fundingRate : 0;
    int256 shortFundingRate = fundingRate < 0 ? -fundingRate : 0;
    
    // 누적 펀딩 비율 업데이트
    cumulativeLongFundingRates[baseToken] += longFundingRate;
    cumulativeShortFundingRates[baseToken] += shortFundingRate;
    lastFundingTimes[baseToken] = currentTime;
    }

    // 펀딩 지불 정산 함수
    function settleFundingPayment(address trader, address baseToken) internal {
    int256 positionSize = getPositionSize(trader, baseToken);
    if (positionSize == 0) return;

    // 롱 포지션과 숏 포지션 각각의 펀딩 지불액 계산
    int256 longFundingPayment = (cumulativeLongFundingRates[baseToken] - userLongFundingPayments[trader][baseToken]) * positionSize / 1e18;
    int256 shortFundingPayment = (cumulativeShortFundingRates[baseToken] - userShortFundingPayments[trader][baseToken]) * positionSize / 1e18;

    // 사용자의 누적 펀딩 지불액 업데이트
    userLongFundingPayments[trader][baseToken] = cumulativeLongFundingRates[baseToken];
    userShortFundingPayments[trader][baseToken] = cumulativeShortFundingRates[baseToken];
    
    // 펀딩 지불 적용 
    // Clearing House에 자금 이동 요청
    // CLEARING_HOUSE.transferFunds(trader, baseToken, longFundingPayment, shortFundingPayment);
    emit FundingPaymentSettled(trader, baseToken, longFundingPayment, shortFundingPayment);
    }

    // 포지션 크기 조회 함수
    function getPositionSize(address trader, address baseToken) public view returns (int256) {
        return positions[trader][baseToken];
    }

    

    // 청산 가능성 체크 함수
    function checkLiquidation(address trader, address baseToken, int256 positionSize, int256 openNotional, int256 unrealizedPnl) internal view {
    uint256 positionNotional = uint256(positionSize * int256(getPrice(baseToken)));
    uint256 accountValue = uint256(openNotional + unrealizedPnl);
    uint256 marginRatio = (accountValue * 100) / positionNotional;

    // 마진 비율이 10% 미만일 경우 청산 경고
    if (marginRatio < 10) {
        emit LiquidationWarning(trader, baseToken, positionSize, marginRatio);
    }
}

    // 현재 가격 조회 함수 (마지막 블록 콜백 함수 사용)
    function getPrice(address baseToken) public view returns (uint256) {
    bytes32 slot = keccak256(abi.encodePacked(baseToken, blockhash(block.number - 1)));
    uint256 price = uint256(slot);
    require(price > 0, "가격 정보가 없습니다");
    
    return price;
}


    // 마크 가격 조회 함수 (TWAP 사용하지 않음)
    function getMarkPrice(address baseToken) internal view returns (uint256) {
    address pairAddress = uniswapPairs[baseToken];
    require(pairAddress != address(0), "Uniswap 페어가 설정되지 않았습니다");

    IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
    (uint256 reserve0, uint256 reserve1,) = pair.getReserves();
    
    // 기본 토큰의 위치에 따라 적절한 가격 반환
    return pair.token0() == baseToken ? reserve1 * 1e18 / reserve0 : reserve0 * 1e18 / reserve1;
}

