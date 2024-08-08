// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 < 0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";  
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

// 계정 잔액을 관리하는 스마트 컨트랙트
contract AccountBalance is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    // 클리어링 하우스 설정 주소 (변경 불가)
    address private immutable CLEARING_HOUSE_CONFIG;
    // 금고 주소 (변경 불가)
    address private immutable VAULT;

    // 기본 토큰 주소에 대한 가격 오라클 매핑
    mapping(address => AggregatorV3Interface) public priceOracles;
    // 기본 토큰 주소에 대한 누적 펀딩 비율 매핑
    mapping(address => int256) public cumulativeFundingRates;
    // 기본 토큰 주소에 대한 마지막 펀딩 시간 매핑
    mapping(address => uint256) public lastFundingTimes;
    // 트레이더와 기본 토큰 주소에 대한 사용자 펀딩 지불 매핑
    mapping(address => mapping(address => int256)) public userFundingPayments;
    // 기본 토큰 주소에 대한 Uniswap 페어 주소 매핑
    mapping(address => address) public uniswapPairs;

    // 트레이더와 기본 토큰 주소에 대한 포지션 크기 매핑 (추가)
    mapping(address => mapping(address => int256)) public positions;
    // 트레이더와 기본 토큰 주소에 대한 오픈 노셔널 매핑 (추가)
    mapping(address => mapping(address => int256)) public openNotionals;

    // 포지션 변경 이벤트
    event PositionChanged(address indexed trader, address indexed baseToken, int256 positionSize, int256 openNotional);
    // 실현된 손익 이벤트
    event PnlRealized(address indexed trader, address indexed baseToken, int256 amount);
    // 펀딩 지불 정산 이벤트
    event FundingPaymentSettled(address indexed trader, address indexed baseToken, int256 amount);
    // 청산 경고 이벤트
    event LiquidationWarning(address indexed trader, address indexed baseToken, int256 positionSize, uint256 marginRatio);

    // 생성자: 클리어링 하우스 설정과 금고 주소 초기화
    constructor(address _clearingHouseConfig, address _vault) {
        CLEARING_HOUSE_CONFIG = _clearingHouseConfig;
        VAULT = _vault;
    }

    // 초기화 함수: Ownable 컨트랙트 초기화
    function initialize() external initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
    }

    // 가격 오라클 설정 함수 (오너만 호출 가능, 재진입공격방지 뺄까?)
    function setPriceOracle(address baseToken, address oracleAddress) external onlyOwner nonReentrant {
        priceOracles[baseToken] = AggregatorV3Interface(oracleAddress);
    }

    // Uniswap 페어 주소 설정 함수 (오너만 호출 가능)
    function setUniswapPair(address baseToken, address pairAddress) external onlyOwner nonReentrant{
        uniswapPairs[baseToken] = pairAddress;
    }

    // 포지션 수정 함수
    function modifyPosition(
        address trader,
        address baseToken,
        int256 baseChange,
        int256 quoteChange,
        int256 positionSize,
        int256 openNotional
    ) external nonReentrant {
        require(msg.sender == CLEARING_HOUSE_CONFIG, "오직 클리어링 하우스만 포지션을 수정할 수 있습니다");

        // 펀딩 비율 업데이트 및 펀딩 지불 정산
        updateFundingRate(baseToken);
        settleFundingPayment(trader, baseToken);

        // 포지션 크기와 오픈 노셔널 업데이트
        positions[trader][baseToken] += baseChange;
        openNotionals[trader][baseToken] += quoteChange;

        // 진입 가격 계산
        uint256 entryPrice = positions[trader][baseToken] != 0 ? uint256(openNotionals[trader][baseToken] * 1e18 / positions[trader][baseToken]) : 0;

        // 미실현 및 실현 손익 계산
        int256 unrealizedPnl = calculateUnrealizedPnl(positions[trader][baseToken], entryPrice, baseToken);
        int256 realizedPnl = calculateRealizedPnl(baseChange, entryPrice, baseToken);

        // 청산 가능성 체크
        checkLiquidation(trader, baseToken, positions[trader][baseToken], openNotionals[trader][baseToken], unrealizedPnl);

        // 이벤트 발생
        emit PositionChanged(trader, baseToken, positions[trader][baseToken], openNotionals[trader][baseToken]);
        emit PnlRealized(trader, baseToken, realizedPnl);
    }

    // 펀딩 비율 업데이트 함수
    function updateFundingRate(address baseToken) public nonReentrant {
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
        
        // 누적 펀딩 비율 업데이트
        cumulativeFundingRates[baseToken] += fundingRate;
        lastFundingTimes[baseToken] = currentTime;
    }

    // 펀딩 지불 정산 함수
    function settleFundingPayment(address trader, address baseToken) internal {
        int256 positionSize = getPositionSize(trader, baseToken);
        if (positionSize == 0) return;

        // 펀딩 지불액 계산
        int256 fundingPayment = (cumulativeFundingRates[baseToken] - userFundingPayments[trader][baseToken]) * positionSize / 1e18;
        userFundingPayments[trader][baseToken] = cumulativeFundingRates[baseToken];

        // 펀딩 지불 적용 (실제 자금 이동은 구현 필요)
        emit FundingPaymentSettled(trader, baseToken, fundingPayment);
    }

    // 포지션 크기 조회 함수
    function getPositionSize(address trader, address baseToken) public view returns (int256) {
        return positions[trader][baseToken];
    }

    // 오픈 노셔널 조회 함수 (추가)
    function getOpenNotional(address trader, address baseToken) public view returns (int256) {
        return openNotionals[trader][baseToken];
    }

    // 미실현 손익 계산 함수
    function calculateUnrealizedPnl(int256 positionSize, uint256 entryPrice, address baseToken) public view returns (int256) {
        uint256 currentPrice = getPrice(baseToken);
        return positionSize * (int256(currentPrice) - int256(entryPrice)) / 1e18;
    }

    // 실현 손익 계산 함수
    function calculateRealizedPnl(int256 closedSize, uint256 entryPrice, address baseToken) internal view returns (int256) {
        uint256 currentPrice = getPrice(baseToken);
        return closedSize * (int256(currentPrice) - int256(entryPrice)) / 1e18;
    }

    // 청산 가능성 체크 함수
    function checkLiquidation(address trader, address baseToken, int256 positionSize, int256 openNotional, int256 unrealizedPnl) internal view {
        int256 accountValue = openNotional + unrealizedPnl;
        uint256 positionNotional = uint256(positionSize * int256(getPrice(baseToken))) / 1e18;
        uint256 marginRatio = uint256(accountValue) * 1e18 / positionNotional;

        // 마진 비율이 2.5% 미만일 경우 청산 경고
        if (marginRatio < 25e15) {
            emit LiquidationWarning(trader, baseToken, positionSize, marginRatio);
        }
    }

    // 현재 가격 조회 함수
    function getPrice(address baseToken) public view returns (uint256) {
        AggregatorV3Interface oracle = priceOracles[baseToken];
        require(address(oracle) != address(0), "오라클이 설정되지 않았습니다");
        (,int256 price,,uint256 updatedAt,) = oracle.latestRoundData();
        require(updatedAt > block.timestamp - 1 hours, "가격 정보가 오래되었습니다");
        return uint256(price);
    }

    // 마크 가격 조회 함수 (Uniswap TWAP 사용)
    function getMarkPrice(address baseToken) internal view returns (uint256) {
        address pairAddress = uniswapPairs[baseToken];
        require(pairAddress != address(0), "Uniswap 페어가 설정되지 않았습니다");

        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint256 reserve0, uint256 reserve1,) = pair.getReserves();
        
        uint256 price0CumulativeLast = pair.price0CumulativeLast();
        uint256 price1CumulativeLast = pair.price1CumulativeLast();
        
        // TWAP 계산을 위한 시간 경과 계산 (최대 15분)
        uint32 timeElapsed = uint32(block.timestamp - pair.blockTimestampLast());
        timeElapsed = timeElapsed > 15 minutes ? 15 minutes : timeElapsed;
        
        // TWAP 계산
        uint256 price0Average = (price0CumulativeLast - price0CumulativeLast) / timeElapsed;
        uint256 price1Average = (price1CumulativeLast - price1CumulativeLast) / timeElapsed;
        
        // 기본 토큰의 위치에 따라 적절한 가격 반환
        return pair.token0() == baseToken ? price0Average * 1e18 / price1Average : price1Average * 1e18 / price0Average;
    }
}


/*
마진 계산:
function getMargin(address trader, address baseToken) public view returns (int256) {
    int256 positionValue = getPositionValue(trader, baseToken);
    int256 openNotional = openNotionals[trader][baseToken];
    return positionValue - openNotional;
}

function getPositionValue(address trader, address baseToken) public view returns (int256) {
    int256 positionSize = positions[trader][baseToken];
    uint256 price = getPrice(baseToken);
    return positionSize * int256(price) / 1e18;
}

레버리지 계산:
function getLeverage(address trader, address baseToken) public view returns (uint256) {
    int256 positionValue = getPositionValue(trader, baseToken);
    int256 margin = getMargin(trader, baseToken);
    if (margin <= 0) return 0;
    return uint256(positionValue * 1e18 / margin);
}

수수료 관리:
uint256 public tradingFeeRate;

function setTradingFeeRate(uint256 _feeRate) external onlyOwner {
    tradingFeeRate = _feeRate;
}

function calculateTradingFee(uint256 notionalValue) public view returns (uint256) {
    return notionalValue * tradingFeeRate / 1e18;
}

거래 제한:
mapping(address => uint256) public maxPositionSize;

function setMaxPositionSize(address baseToken, uint256 size) external onlyOwner {
    maxPositionSize[baseToken] = size;
}

function checkPositionLimit(address trader, address baseToken, int256 newSize) internal view {
    require(abs(newSize) <= maxPositionSize[baseToken], "Position size exceeds limit");
}

function abs(int256 x) internal pure returns (uint256) {
    return x >= 0 ? uint256(x) : uint256(-x);
}

긴급 중지:
bool public emergencyStop;

function setEmergencyStop(bool _stop) external onlyOwner {
    emergencyStop = _stop;
}

modifier whenNotStopped() {
    require(!emergencyStop, "Contract is stopped");
    _;
}

이벤트 추가:
event MarginRatioChanged(address indexed trader, address indexed baseToken, uint256 marginRatio);
event Liquidated(address indexed trader, address indexed baseToken, int256 positionSize, int256 positionNotional);

settleFundingPayment, getPrice, getMarkPrice 함수들이 나중에 외부 상호작용을 포함하게 될 경우, 이들 함수에도 nonReentrant 수정자를 추가하는 것이 좋습니다.
*/
