// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import './libraries/UQ112x112.sol';
import "./interfaces/IClearingHouse.sol";
import "./interfaces/IERC20.sol";
import "./MarketRegistry.sol";
import "./console.sol";

contract AccountBalance is Ownable {
    using UQ112x112 for uint224;

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

    // 생성자 함수
    constructor(address _clearingHouse, address _marketRegistry, address _vault) Ownable(msg.sender) {
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

        // 롱 포지션과 숏 포지션의 오픈 인터레스트 가져오기
        uint256 longOpenInterestValue = getLongOpenInterest(baseToken);
        uint256 shortOpenInterestValue = getShortOpenInterest(baseToken);

        if(longOpenInterestValue != 0 && shortOpenInterestValue != 0) {
            uint256 currentPrice = getIndexPrice(baseToken);
            uint256 markPrice = getMarkPrice(baseToken);
            (currentPrice, markPrice) = matchDecimals(currentPrice, markPrice, 18, 24 - IERC20(baseToken).decimals());

            // 가격 차이에 기반한 펀딩 비율 계산
            int256 priceDelta = int256(markPrice) - int256(currentPrice);
            int256 fundingRate = (priceDelta * int256(timePassed) * 1e18) / (int256(currentPrice) * int256(1 days));//1e36 => decimal 맞추는거 생각하기.
            
            // 펀딩 비율 제한 (-0.1% ~ 0.1%)
            fundingRate = fundingRate > int256(1e15) ? int256(1e15) : (fundingRate < int256(-1e15) ? int256(-1e15) : fundingRate);
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

            // 누적 펀딩 비율 업데이트 (fundingRate > 0: Long => Short, else: Short => Long)
            
            cumulativeLongFundingRates[baseToken] -= adjustedLongFundingRate;
            cumulativeShortFundingRates[baseToken] += adjustedShortFundingRate;
            
        }        
        lastFundingTimes[baseToken] = currentTime;
    }

    // 오픈 인터레스트 업데이트 함수
    function setOpenInterest(address baseToken, int256 positionSize, bool isLong) public {
        require(msg.sender == address(iClearinghouse), "Only ClearingHouse can update"); // ClearingHouse만 업데이트 가능

        if (isLong) {
            if (positionSize > 0) {
                longOpenInterest[baseToken] += uint256(positionSize);
            } else {
                longOpenInterest[baseToken] -= uint256(-positionSize);
            }
        } else {
            if (positionSize > 0) {
                shortOpenInterest[baseToken] += uint256(positionSize);
            } else {
                shortOpenInterest[baseToken] -= uint256(-positionSize);
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
        uint256 currentPriceCumulative = _getPriceCumulativeLast(baseToken, poolAddress);
        uint256 timeElapsed = block.timestamp - openPositionTimestamp;

        if (timeElapsed == 0) return 0;

        uint256 priceDelta = currentPriceCumulative - priceCumulativeLast;

        return priceDelta / timeElapsed;
    }

    // TWAP 계산 시 timeElapsed가 0보다 클 시  pair의 최신 가격 정보를 반영하여 누적 가격 반환   
    function _getPriceCumulativeLast(address baseToken, address poolAddress) private view returns(uint) {
        IUniswapV2Pair pair = IUniswapV2Pair(poolAddress);
        (uint112 _reserve0, uint112 _reserve1, uint32 blockTimestampLast) = pair.getReserves();
        (uint price0CumulativeLast, uint price1CumulativeLast) = (pair.price0CumulativeLast(), pair.price1CumulativeLast());
        
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        return baseToken == pair.token0() ? price0CumulativeLast : price1CumulativeLast;
    }

    // 펀딩 지불 정산 함수
    function calculateFundingPayment(
        IClearingHouse.Position memory position,
        address baseToken,
        address poolAddress
    ) public view returns (int256) {
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
            ) / (int256(2**112) * int256(1e18));
        } else {
            // 숏 포지션 펀딩 지불액 계산
            fundingPayment = (
                (cumulativeShortFundingRates[baseToken] - position.fundingRateCumulativeLast)
                * int256(position.positionSize)
                * int256(twap)
            ) / int256(2**112 * int256(1e18));//이것도 decimal 체크.
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
        // 펀딩 비용 계산
        int256 fundingPayment = calculateFundingPayment(position, baseToken, poolAddress);
        // accountValue 계산 시 펀딩 비용을 고려
        int256 accountValue = int256(position.margin) + unrealizedPnl + fundingPayment;
        
        // 마진 비율 계산 (accountValue가 음수일 경우 처리)
        uint256 marginRatio;
        if (accountValue > 0) {
            marginRatio = (uint256(accountValue) * 100) / position.margin;
        } else {
            marginRatio = 0;
        }

        // 마진 비율이 10% 이하일 경우 청산 대상
        return marginRatio <= 10;
    }

    // PnL (손익) 계산 함수
    function calculateUnrealizedPnl(IClearingHouse.Position memory position, address baseToken) internal view returns (int256) {
        uint256 currentPrice = getIndexPrice(baseToken);
        uint256 openPrice = position.openNotional * 1e18 / position.positionSize;//decimal 고려
        uint8 decimals = IERC20(baseToken).decimals();
        (currentPrice, openPrice) = matchDecimals(currentPrice, openPrice, 18, 24 - decimals);    

        int256 priceDelta;
        if (position.isLong) {
            priceDelta = int256(currentPrice) - int256(openPrice);//index도 데시멀 고려
        } else {
            priceDelta = int256(openPrice) - int256(currentPrice);
        }
        return int256(position.positionSize) * priceDelta / int256(10**(12+decimals)); // decimals 18 => decimals 6
    }

    
    function matchDecimals(uint amountA, uint amountB, uint decimalsA, uint decimalsB) internal pure returns (uint , uint) {
        if(decimalsA > decimalsB) {
            return (amountA, amountB * 10 ** (decimalsA - decimalsB));
        } else {
            return (amountA * 10 ** (decimalsB - decimalsA), amountB);
        }
    }
}
// checkLiquidation, calculateUnrealizedPnl 함수 고치기!