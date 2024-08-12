// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./IClearinghouse.sol";
import "./MarketRegistry.sol";

contract AccountBalance is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    IClearingHouse public iClearinghouse;
    MarketRegistry public marketRegistry;
    address private vault;
    address private keeper;

    // 기본 토큰 주소에 대한 마지막 펀딩 시간 매핑
    mapping(address => uint256) public lastFundingTimes;

    // 기본 토큰 주소에 대한 누적 롱 펀딩 비율
    mapping(address => int256) public cumulativeLongFundingRates;

    // 기본 토큰 주소에 대한 누적 숏 펀딩 비율
    mapping(address => int256) public cumulativeShortFundingRates;

    // 기본 토큰 주소에 대한 롱 포지션 사용자의 펀딩 지불 내역 매핑
    mapping(address => mapping(address => int256)) public userLongFundingPayments;

    // 기본 토큰 주소에 대한 숏 포지션 사용자의 펀딩 지불 내역 매핑
    mapping(address => mapping(address => int256)) public userShortFundingPayments;

    // 기본 토큰 주소에 대한 롱 포지션의 오픈 인터레스트
    mapping(address => uint256) private longOpenInterest;

    // 기본 토큰 주소에 대한 숏 포지션의 오픈 인터레스트
    mapping(address => uint256) private shortOpenInterest;

    // 기본 토큰 주소에 대한 롱 포지션 사이즈
    mapping(address => uint256) private longPositionSize;

    // 기본 토큰 주소에 대한 숏 포지션 사이즈
    mapping(address => uint256) private shortPositionSize;

    // 기본 토큰 주소에 대한 인덱스 가격
    mapping(address => uint256) private indexPrices;

    // 초기화 함수: Ownable 및 ReentrancyGuard 컨트랙트 초기화
    function initialize(address _clearingHouse, address _marketRegistry, address _vault) external initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        iClearinghouse = IClearingHouse(_clearingHouse);
        marketRegistry = MarketRegistry(_marketRegistry);
        vault = _vault;
        keeper = msg.sender;
    }

    // Keeper 권한을 가진 주소만 호출할 수 있는 모디파이어
    modifier onlyKeeper() {
        require(msg.sender == keeper, "Not allowed");
        _;
    }

    // Keeper 주소 설정 함수
    function setKeeper(address newKeeper) external onlyOwner {
        keeper = newKeeper;
    }

    // 마크 가격 조회 함수
    function getMarkPrice(address baseToken) public view returns (uint256) {
        address pairAddress = marketRegistry.getPool(baseToken);
        require(pairAddress != address(0), "Pool address is not set"); 
        
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint256 reserve0, uint256 reserve1,) = pair.getReserves();

        // 기본 토큰의 위치에 따라 적절한 가격 계산
        uint256 markPrice = pair.token0() == baseToken
            ? reserve1 * 1e18 / reserve0
            : reserve0 * 1e18 / reserve1;

        return markPrice;
    }

    // 인덱스 가격 설정 함수
    function setIndexPrice(address baseToken, uint256 price) public onlyKeeper {
        indexPrices[baseToken] = price;
        setFundingRate(baseToken);
    }

    // 저장된 인덱스 가격 조회 함수
    function getIndexPrice(address baseToken) public view returns (uint256) {
        return indexPrices[baseToken];
    }

    // 펀딩 비율 업데이트 함수
    function setFundingRate(address baseToken) private {
        uint256 currentTime = block.timestamp;
        uint256 timePassed = currentTime - lastFundingTimes[baseToken];
        if (timePassed == 0) return;

        uint256 currentPrice = getIndexPrice(baseToken) * 1e18;
        uint256 markPrice = getMarkPrice(baseToken);

        // 가격 차이에 기반한 펀딩 비율 계산
        int256 priceDelta = int256(currentPrice) - int256(markPrice);
        int256 fundingRate = (priceDelta * int256(timePassed)) / (int256(currentPrice) * int256(1 days) / 1e36);//1e36 => decimal 맞추는거 생각하기.

        // 펀딩 비율 제한 (-0.1% ~ 0.1%)
        fundingRate = fundingRate > 1e15 ? 1e15 : (fundingRate < -1e15 ? -1e15 : fundingRate);

        // 롱 포지션과 숏 포지션의 오픈 인터레스트 가져오기
        uint256 longOpenInterestValue = getLongOpenInterest(baseToken);
        uint256 shortOpenInterestValue = getShortOpenInterest(baseToken);

        // 펀딩 비율 조정
        int256 adjustedLongFundingRate;
        int256 adjustedShortFundingRate;
        
        if (longOpenInterestValue > shortOpenInterestValue) {
            adjustedLongFundingRate = (fundingRate * int256(shortOpenInterestValue)) / int256(longOpenInterestValue);
            adjustedShortFundingRate = fundingRate;
        } else {
            adjustedLongFundingRate = fundingRate;
            adjustedShortFundingRate = (fundingRate * int256(longOpenInterestValue)) / int256(shortOpenInterestValue);
        }

        // 누적 펀딩 비율 업데이트
        cumulativeLongFundingRates[baseToken] += adjustedLongFundingRate;
        cumulativeShortFundingRates[baseToken] += adjustedShortFundingRate;

        lastFundingTimes[baseToken] = currentTime;
    }

    // 오픈 인터레스트 업데이트 함수
    function setOpenInterest(address baseToken, int256 positionSize, bool isLong) public {
        require(msg.sender == address(iClearinghouse), "Only ClearingHouse can update"); // ClearingHouse만 업데이트 가능

        if (isLong) {
            if (positionSize > 0) {
                longOpenInterest[baseToken] += uint256(positionSize);
            } else {
                longOpenInterest[baseToken] = longOpenInterest[baseToken] > uint256(-positionSize) 
                    ? longOpenInterest[baseToken] - uint256(-positionSize) 
                    : 0;
            }
        } else {
            if (positionSize > 0) {
                shortOpenInterest[baseToken] += uint256(positionSize);
            } else {
                shortOpenInterest[baseToken] = shortOpenInterest[baseToken] > uint256(-positionSize) 
                    ? shortOpenInterest[baseToken] - uint256(-positionSize) 
                    : 0;
            }
        }
    }

    // 롱 포지션 오픈 인터레스트 조회 함수
    function getLongOpenInterest(address baseToken) public view returns (uint256) {
        return longOpenInterest[baseToken];
    }

    // 숏 포지션 오픈 인터레스트 조회 함수
    function getShortOpenInterest(address baseToken) public view returns (uint256) {
        return shortOpenInterest[baseToken];
    }

    // TWAP (Time-Weighted Average Price) 계산 함수
    function calculateTWAP(
        address poolAddress,
        address baseToken,
        uint32 openPositionTimestamp,
        uint256 priceCumulativeLast
    ) private view returns (uint256) {
        IUniswapV2Pair pair = IUniswapV2Pair(poolAddress);

        bool isToken0 = pair.token0() == baseToken;

        uint256 currentPriceCumulative = isToken0
            ? pair.price0CumulativeLast()
            : pair.price1CumulativeLast();

        uint256 timeElapsed = block.timestamp - openPositionTimestamp;

        if (timeElapsed == 0) return 0;

        uint256 priceDelta = currentPriceCumulative - priceCumulativeLast;

        return priceDelta / timeElapsed;
    }

    // 펀딩 지불 정산 함수
    function calculateFundingPayment(
        IClearingHouse.Position memory position,
        address baseToken,
        address poolAddress
    ) internal view returns (int256) {
        if (position.positionSize == 0) return 0;

        uint256 twap = calculateTWAP(
            poolAddress,
            baseToken,
            position.openPositionTimestamp,
            position.priceCumulativeLast
        );

        int256 fundingPayment;
        if (position.isLong) {
            // 롱 포지션 펀딩 지불액 계산
            fundingPayment = (
                (cumulativeLongFundingRates[baseToken] - position.fundingRateCumulativeLast)
                * int256(position.positionSize)
                * int256(twap)
            ) / int256(2**128);
        } else {
            // 숏 포지션 펀딩 지불액 계산
            fundingPayment = (
                (cumulativeShortFundingRates[baseToken] - position.fundingRateCumulativeLast)
                * int256(position.positionSize)
                * int256(twap)
            ) / int256(2**128);//이것도 decimal 체크.
        }

        return fundingPayment;
    }

    // 청산 가능성 체크 함수
    function checkLiquidation(
        IClearingHouse.Position memory position,
        address baseToken,
        address poolAddress
    ) public view returns (bool) {
        // PnL (손익) 계산
        int256 unrealizedPnl = calculateUnrealizedPnl(position, baseToken);
        uint256 positionNotional = position.positionSize * getIndexPrice(baseToken);
        // 펀딩 비용 계산
        int256 fundingPayment = calculateFundingPayment(position, baseToken, poolAddress);
        // accountValue 계산 시 펀딩 비용을 고려
        int256 accountValue = int256(position.openNotional) + unrealizedPnl + fundingPayment;

        // 마진 비율 계산 (accountValue가 음수일 경우 처리)
        uint256 marginRatio;
        if (accountValue > 0) {
            marginRatio = (uint256(accountValue) * 100) / positionNotional;
        } else {
            marginRatio = 0;//앞으로 받게될 펀딩비도 고려해서 마진비율을계산. calculateFundingPayment
        }

        // 마진 비율이 10% 미만일 경우 청산 대상
        return marginRatio < 10;
    }

    // PnL (손익) 계산 함수
    function calculateUnrealizedPnl(IClearingHouse.Position memory position, address baseToken) internal view returns (int256) {
        uint256 currentPrice = getIndexPrice(baseToken);
        uint256 openPrice = position.openNotional / position.positionSize;//decimal 고려

        int256 priceDelta;
        if (position.isLong) {
            priceDelta = int256(currentPrice) - int256(openPrice);//index도 데시멀 고려
        } else {
            priceDelta = int256(openPrice) - int256(currentPrice);
        }

        return int256(position.positionSize) * priceDelta;//decimal 고려. etc) 1btc를 사면 1*10**18개가 들어옴. usdt는 1*10**6
    }

    /* 토큰의 decimal을 반환하는 함수(이거활용?)
    function getTokenDecimals(address token) internal pure returns (uint8) {
        if (token == address(USDT_ADDRESS)) {
            return 6;
        } else if (token == address(BTC_ADDRESS)) {
            return 8;
        } else if (token == address(ETH_ADDRESS)) {
            return 18;
        } else {
            revert("Unsupported token");
        }
    }*/
}
// checkLiquidation, calculateUnrealizedPnl 함수 고치기!