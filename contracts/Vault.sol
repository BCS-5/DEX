// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.26;

import { OwnerPausable } from "./base/OwnerPausable.sol";
import { ClearingHouse } from "./ClearingHouse.sol";

import { IVault } from "./interface/IVault.sol";

contract Vault {
/*
    조건
    1. 격리만 (크로스 없음)
    2. 보증금은 USDT만 넣을 수 있음
    3. 한 사람이 여러 개의 포지션을 잡을 수 있음

    4. 1LP당 받을 수 있는 수수료는 ClearingHouse에서 받아오기

    참고
    settlement token = USDT
*/

/// state variables
    // --------- IMMUTABLE ---------
    uint8 internal _decimals;
    address internal _settlementToken;  // USDT
    // --------- ^^^^^^^^^ ---------

    // 포지션
    struct Position {
        uint112 margin;         // 이 포지션에 사용된 보증금 (useCollateral)
        uint112 leverage;       // 빌린 돈 (leverage)
        bool isLong;            // 포지션 / true: long, false: short
        uint224 fundingRate;    // 진입 시점의 펀딩비
    }

    // funding fee
    struct LiquidityProvider {
        uint112 totalFee;   // 진입 시점까지 쌓여있는 수수료
        uint112 totalLP;    // 진입 시점에서의 LP토큰 총 개수
        uint112 userLP;     // 사용자 보유 LP
    }

    // 보증금
    struct Collateral {
        uint112 totalCollateral;    // 얼마 가지고 있는지 = useAmount 포함
        uint112 useCollateral;      // 얼마 사용하고 있는지 = 전체 포지션 증거금 합
    }

    // 사용자 보증금 (userAddress => CollateralStruct)
    mapping(address => Collateral) collateral;

    // 사용자 포지션 (userAddress => poolAddress => PositionStructArray)
    mapping(address => mapping(address => Position[])) public positions;

    // 사용자 펀딩비 (userAddress => poolAddress => LiquidityProviderStructArray)
    mapping(address => mapping(address => LiquidityProvider)) public liquidityProviders;



    /// @inheritdoc IVault
    function decimals() external view override returns (uint8) {
        return _decimals;
    }

// modifiers
    // 보증금으로 USDT를 넣는지 체크
    // ** _USDTaddr
    modifier onlyUSDTToken(address _addr) {
        require(_addr == _settlementToken, "Invalid Token");
        _;
    }

/// functions
// 초기 세팅
    function initialize() external initializer {
        // update states
        // _decimals = decimalsArg;
        _settlementToken = settlementTokenArg;  // USDT
        // _insuranceFund = insuranceFundArg;
        // _clearingHouseConfig = clearingHouseConfigArg;
        // _accountBalance = accountBalanceArg;
        // _exchange = exchangeArg;        
    }

    // ClearingHouse 주소 설정
    function setClearingHouse(address clearingHouseArg) external onlyOwner {
        require(clearingHouseArg.isContract(), "V_CHNC");   // ClearingHouse is not contract

        _clearingHouse = clearingHouseArg;
        emit ClearingHouseChanged(clearingHouseArg);
    }

// 보증금 관리
    // 예치
    /// @inheritdoc IVault
    function deposit(uint256 amount) external override nonReentrant onlyUSDTToken {
        address from = _msgSender();
        address token = _settlementToken;
        _deposit(from, from, token, amount);
    }

    /// @inheritdoc IVault
    function depositFor(
        address to,
        uint256 amount
    ) external override nonReentrant onlyUSDTToken(token) {
        require(to != address(0), "V_DFZA");    // Deposit for zero address

        address from = _msgSender();
        address token = _settlementToken;
        _deposit(from, to, token, amount);
    }

    function _deposit(
        address from,   // deposit token from this address
        address to,     // deposit token to this address
        address token,  // the collateral token wish to deposit
        uint256 amount  // the amount of token to deposit
    ) internal {
        require(amount > 0, "V_ZA");    // Zero Amount
        _transferTokenIn(token, from, amount);  // 전송하고, 정확한 amount의 token이 이 컨트랙트로 전송되었는지 확인
        _modifyBalance(to, token, amount.toInt256());
        emit Deposited(token, to, amount);
    }

    function _transferTokenIn(
        address token,  // the collateral token needs to be transferred into vault
        address from,   // the address of account who owns the collateral token
        uint256 amount  // the amount of collateral token needs to be transferred
    ) internal {
        // check for deflationary tokens by assuring balances before and after transferring to be the same
        uint256 balanceBefore = IERC20Metadata(token).balanceOf(address(this)); // 이 컨트랙트에 존재하는 USDT 잔고
        SafeERC20Upgradeable.safeTransferFrom(IERC20Upgradeable(token), from, address(this), amount);
        require((IERC20Metadata(token).balanceOf(address(this)).sub(balanceBefore)) == amount, "V_IBA");    // inconsistent balance amount
    }

    // 인출
    /// @inheritdoc IVault
    // the full process of withdrawal:
    // 1. settle funding payment to owedRealizedPnl
    // 2. collect fee to owedRealizedPnl
    // 3. call Vault.withdraw(token, amount)
    // 4. settle pnl to trader balance in Vault
    // 5. transfer the amount to trader
    function withdraw(address token, uint256 amount)
        external
        override
        nonReentrant
        onlyUSDTToken(token)
    {
        address to = _msgSender();
        _withdraw(to, token, amount);
    }

    function _withdraw(
        address to,
        address token,
        uint256 amount,
        bool isClaim
    ) internal {
        if (isClaim) {
            Claim();
        }
        _settleAndDecreaseBalance(to, token, amount);
        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(token), to, amount);
        emit Withdrawn(token, to, amount);
    }

    function _settleAndDecreaseBalance(
        address to,
        address token,
        uint256 amount
    ) internal {
        // settle all funding payments owedRealizedPnl
        // pending fee can be withdraw but won't be settled
        IClearingHouse(_clearingHouse).settleAllFunding(to);

        // incl. owedRealizedPnl
        uint256 freeCollateral = collateral[to][token].totalCollateral - collateral[to][token].useCollateral;
        require(freeCollateral >= amount, "V_NEFC");    // not enough freeCollateral

        int256 deltaBalance = amount.toInt256().neg256();   // 음수 표현
        if (token == _settlementToken) {
            // settle both the withdrawn amount and owedRealizedPnl to collateral
            int256 owedRealizedPnlX10_18 = IAccountBalance(_accountBalance).settleOwedRealizedPnl(to);
            deltaBalance = deltaBalance.add(owedRealizedPnlX10_18.formatSettlementToken(_decimals));
        }

        _modifyBalance(to, token, deltaBalance);
    }

    /// @param amount can be 0; do not require this
    function _modifyBalance(
        address trader,
        address token,
        int256 amount
    ) internal {
        if (amount == 0) {
            return;
        }

        int112 oldBalance = collateral[trader][token].totalCollateral;
        int112 newBalance = oldBalance.add(amount);
        collateral[trader][token].totalCollateral = newBalance;

        if (token == _settlementToken) {
            return;
        }
    }

    // 잔고 조회
    function getBalance(address token) external view returns(uint256) {
        return collateral[_msgSender()][token].totalCollateral.toUint256();
    }


// 수수료 관리
    // 보상 지급(Claim)
    function claimRewards(address poolAddr) external {
        // Clearing House에서 1LP당 수수료 금액 받아오기
        address token = _settlementToken;
        uint112 amount = 1LP당 수수료 금액 * liquidityProviders[_msgSender()][poolAddr].userLP;
        collateral[trader][token].totalCollateral += amount;
        _deposit(from, from, token, amount);
    }

    // 수수료 관리
    function collectFees() external {
        // Clearing House에서 계산된 수수료 받아서 더해주기
        
    }



}