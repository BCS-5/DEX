// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.26;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import { ClearingHouse } from "./ClearingHouse.sol";
import { SafeOwnable } from "./base/SafeOwnable.sol";
import { IVault } from "./interfaces/IVault.sol";
// import { IERC20 } from "./v2-core-contracts/interfaces/IERC20.sol";

contract Vault {

/// state variables
    // --------- IMMUTABLE ---------
    uint8 internal _decimals;
    address internal _settlementToken;  // USDT
    // --------- ^^^^^^^^^ ---------

    address internal _clearingHouse;    // Clearing House Address

    // funding fee
    struct LiquidityProvider {
        uint256 cumulativeTransactionFeeLast;   // 진입 시점까지 쌓여있는 수수료
        uint256 userLP;     // 사용자 보유 LP 토큰 개수
    }

    // 보증금
    struct Collateral {
        uint256 totalCollateral;    // 얼마 가지고 있는지 = useAmount 포함
        uint256 useCollateral;      // 얼마 사용하고 있는지 = 전체 포지션 증거금 합
    }

    // 사용자 보증금 (userAddress => CollateralStruct)
    mapping(address => Collateral) collateral;
    // 사용자 펀딩비 (userAddress => poolAddress => LiquidityProviderStructArray)
    mapping(address => mapping(address => LiquidityProvider)) public liquidityProviders;
    // 1LP당 거래수수료 보상 (poolAddress => Uint)
    mapping(address => uint256) public cumulativeTransactionFee;


    /// @inheritdoc IVault
    // 소수점 자리수 조회
    function decimals() external view override returns (uint8) {
        return _decimals;
    }

// modifiers
    // 보증금으로 USDT를 넣는지 체크
    modifier onlyUSDTToken(address _addr) {
        require(_addr == _settlementToken, "V_IT");    // Invalid Token
        _;
    }

    // Clearing House에서만 실행 가능한 함수에 사용
    modifier onlyClearingHouse() {
        require(msg.sender == _clearingHouse, "V_CNAC");    // Caller is Not the Allowed Contract
        _;
    }

/// functions
// 초기 세팅
    function initialize() external initializer {
        _decimals = 18;
        _settlementToken = USDT_ADDRESS;            // 주소 넣기
        _clearingHouse = CLEARING_HOUSE_ADDRESS;    // 주소 넣기
        // _insuranceFund = insuranceFundArg;
        // _clearingHouseConfig = clearingHouseConfigArg;
        // _accountBalance = accountBalanceArg;
        // _exchange = exchangeArg;        
    }

    // ClearingHouse 주소 설정
    function setClearingHouse(address clearingHouseAddr) external onlyOwner {
        require(clearingHouseAddr.isContract(), "V_CHNC");   // ClearingHouse is not contract

        _clearingHouse = clearingHouseAddr;
        emit ClearingHouseChanged(clearingHouseAddr);
    }

// 보증금 관리
    // 예치 - from == to == msg.sender
    function deposit(uint256 amount) external override nonReentrant {
        address from = _msgSender();
        address token = _settlementToken;
        _deposit(from, from, token, amount);
    }

    // 송금 - msg.sender => to
    function depositFor(
        address to,
        uint256 amount
    ) external override nonReentrant {
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
        require(IERC20Metadata(token).balanceOf(address(this)) - balanceBefore == amount, "V_IBA");    // inconsistent balance amount
    }

    // 인출 - 일부 amount
    function withdraw(uint256 amount)
        external
        override
        nonReentrant
    {
        address to = _msgSender();
        address token = _settlementToken;
        _withdraw(to, token, amount);
    }

    // 인출 - free collateral 전체
    function withdrawAll() external override nonReentrant {
        address to = _msgSender();
        address token = _settlementToken;
        uint256 amount = getFreeCollateral(to, token);
        _withdraw(to, token, amount);
    }

    function _withdraw(
        address to,
        address token,
        uint256 amount
    ) internal {
        _settleAndDecreaseBalance(to, token, amount);
        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(token), to, amount);
        emit Withdrawn(token, to, amount);
    }

    function _settleAndDecreaseBalance(
        address to,
        address token,
        uint256 amount
    ) internal {
        uint256 freeCollateral = collateral[to].totalCollateral - collateral[to].useCollateral;
        require(freeCollateral >= amount, "V_NEFC");    // not enough freeCollateral

        int256 deltaBalance = amount.toInt256().neg256();   // 음수 표현

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

        int256 oldBalance = collateral[trader].totalCollateral;
        int256 newBalance = oldBalance + amount;
        collateral[trader].totalCollateral = newBalance;
    }

    // Clearing House에서 Position Open, Close할 때 호출
    function updateCollateral(address user, int256 amount) external onlyClearingHouse {
        collateral[user].totalCollateral += amount;
    } 

    // 총 보증금 조회
    function getTotalCollateral(address user) public view returns(uint256) {
        return collateral[user].totalCollateral;
    }

    // 사용중인 보증금 조회
    function getUseCollateral(address user) public view returns(uint256) {
        return collateral[user].useCollateral;
    }

    // 사용/출금 가능한 보증금 조회
    function getFreeCollateral(address user) public view returns(uint256) {
        return collateral[user].totalCollateral - collateral[user].useCollateral;
    }


// 수수료 관리

    // userLP 업데이트
    function updateUserLP(address user, address poolAddr, int256 amount) external onlyClearingHouse {
        liquidityProviders[user][poolAddr].userLP += amount;
    }

    // 보상 지급(Claim)
    function claimRewards(address user, address poolAddr) external {
        address token = _settlementToken;
        uint256 amount = (getCumulativeTransactionFee[poolAddr] - liquidityProviders[user][poolAddr].cumulativeTransactionFeeLast) * liquidityProviders[user][poolAddr].userLP;
        // 보증금 업데이트
        collateral[user].totalCollateral += amount;
        _deposit(address(this), user, token, amount);

        liquidityProviders[user][poolAddr].cumulativeTransactionFeeLast = getCumulativeTransactionFee(poolAddr);
    }

    // pool 거래 수수료 업데이트
    function setCumulativeTransactionFee(address poolAddr, uint256 fee) external onlyClearingHouse {
        cumulativeTransactionFee[poolAddr] = fee * 2**128 / IUniswapV2Pair(poolAddr).totalSupply(); 
    }
    
    // 1LP당 누적 거래 수수료 조회
    function getCumulativeTransactionFee(address poolAddr) public view returns(uint256) {
        return cumulativeTransactionFee[poolAddr];
    }

}
