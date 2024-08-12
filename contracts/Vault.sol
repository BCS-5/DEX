// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.26;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import { IVault } from "./interfaces/IVault.sol";
import { IERC20Metadata } from "./interfaces/IERC20Metadata.sol";
import { IERC20 } from "./v2-core-contracts/interfaces/IERC20.sol";
import { SafeOwnable } from "./base/SafeOwnable.sol";

contract Vault is IVault, Initializable, SafeOwnable, ReentrancyGuardUpgradeable {

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

    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
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
        _settlementToken = 0x2FFA65948795F91D2FcB6E10c3F8cc4440d416a6;  // 주소 넣기
        _clearingHouse = 0x2FFA65948795F91D2FcB6E10c3F8cc4440d416a6;    // 주소 넣기
        // _insuranceFund = insuranceFundArg;
        // _clearingHouseConfig = clearingHouseConfigArg;
        // _accountBalance = accountBalanceArg;
        // _exchange = exchangeArg;        
    }

    // ClearingHouse 주소 설정
    function setClearingHouse(address clearingHouseAddr) external onlyOwner {
        require(isContract(clearingHouseAddr), "V_CHNC");   // ClearingHouse is not contract

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
        _modifyBalance(to, amount, true);
        emit Deposited(token, to, amount);
    }

    function _transferTokenIn(
        address token,  // the collateral token needs to be transferred into vault
        address from,   // the address of account who owns the collateral token
        uint256 amount  // the amount of collateral token needs to be transferred
    ) internal {
        // 전송 전의 Vault의 토큰 잔고 확인
        uint256 balanceBefore = IERC20(token).balanceOf(address(this)); 

        // from 주소로부터 Vault로 토큰 전송
        bool success = IERC20(token).transferFrom(from, address(this), amount);
        require(success, "Transfer failed");

        // 전송 후의 토큰 잔고와 전송 전의 잔고의 차이가 전송한 양과 일치하는지 확인
        uint256 balanceAfter = IERC20(token).balanceOf(address(this));
        require(balanceAfter - balanceBefore == amount, "V_IBA");  // inconsistent balance amount
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
        uint256 amount = getFreeCollateral(to);
        _withdraw(to, token, amount);
    }

    function _withdraw(
        address to,
        address token,
        uint256 amount
    ) internal {
        _settleAndDecreaseBalance(to, amount);
        // 토큰 전송
        bool success = IERC20(token).transfer(to, amount);
        require(success, "Transfer failed");

        emit Withdrawn(token, to, amount);
    }


    function _settleAndDecreaseBalance(
        address to,
        uint256 amount
    ) internal {
        uint256 freeCollateral = collateral[to].totalCollateral - collateral[to].useCollateral;
        require(freeCollateral >= amount, "V_NEFC");    // not enough freeCollateral

        _modifyBalance(to, amount, false);
    }

    /// @param amount can be 0; do not require this
    function _modifyBalance(
        address trader,
        uint256 amount,
        bool isPlus
    ) internal {
        if (amount == 0) {
            return;
        }

        uint256 oldBalance = collateral[trader].totalCollateral;
        uint256 newBalance;
        if (isPlus) {
            newBalance = oldBalance + amount;
        } else {
            newBalance = oldBalance - amount;
        }

        collateral[trader].totalCollateral = newBalance;
    }

    // Clearing House에서 Position Open, Close할 때 호출
    function updateCollateral(address user, uint256 amount, bool isPlus) external onlyClearingHouse {
        if (isPlus) {
            collateral[user].totalCollateral += amount;
        } else {
            collateral[user].totalCollateral -= amount;
        }
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
    function updateUserLP(address user, address poolAddr, uint256 amount, bool isPlus) external onlyClearingHouse {
        if (isPlus) {
            liquidityProviders[user][poolAddr].userLP += amount;
        } else {
            liquidityProviders[user][poolAddr].userLP -= amount;
        }
    }

    // 보상 지급(Claim)
    function claimRewards(address user, address poolAddr) external {
        address token = _settlementToken;
        uint256 amount = (getCumulativeTransactionFee(poolAddr) - liquidityProviders[user][poolAddr].cumulativeTransactionFeeLast) * liquidityProviders[user][poolAddr].userLP;
        // 보증금 업데이트
        collateral[user].totalCollateral += amount;
        _deposit(address(this), user, token, amount);

        liquidityProviders[user][poolAddr].cumulativeTransactionFeeLast = getCumulativeTransactionFee(poolAddr);
    }

    // pool 거래 수수료 업데이트
    function setCumulativeTransactionFee(address poolAddr, uint256 fee) external onlyClearingHouse {
        cumulativeTransactionFee[poolAddr] = fee * 2**128 / IERC20(poolAddr).totalSupply(); 
    }
    
    // 1LP당 누적 거래 수수료 조회
    function getCumulativeTransactionFee(address poolAddr) public view returns(uint256) {
        return cumulativeTransactionFee[poolAddr];
    }

}