// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 < 0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "./VirtualToken.sol";
import "./interfaces/IMarketRegistry.sol";

/*
- 유동성 풀 생성
- 유동성 풀 데이터 관리
- vBTC 주소 입력하면 풀 주소 반환
*/

contract MarketRegistry is IMarketRegistry, Ownable{
    address clearingHouse;
    address factory;
    address quoteToken;

    mapping(address => address) public pool;
    address[] public allPools;
    address[] public allBaseTokens;

    mapping(address => uint24) feeRatio;
    mapping(address => uint24) priceImpactLimit;

    constructor(address _factory) Ownable(msg.sender) {
        factory = _factory;
    }

    function createPool(string memory _name, string memory _symbol, uint8 _decimals) public onlyOwner{    
        if(quoteToken == address(0)) {
            VirtualToken vt = new VirtualToken("vUSDT", "USDT", 6);
            quoteToken = address(vt);
            vt.transfer(clearingHouse, vt.balanceOf(address(this)));
        }
        VirtualToken vt = new VirtualToken(_name, _symbol, _decimals);
        vt.transfer(clearingHouse, vt.balanceOf(address(this)));

        address baseToken = address(vt);

        address poolAddress = IUniswapV2Factory(factory).createPair(baseToken, quoteToken);

        pool[baseToken] = poolAddress;
        allPools.push(poolAddress);
        allBaseTokens.push(baseToken);

        setFeeRatio(baseToken, 3e2);
        setPriceImpactLimit(baseToken, 1e4);
       
        emit CreatePool(poolAddress, baseToken, quoteToken);
    }

    function setClearingHouse(address _clearingHouse) public onlyOwner {
        clearingHouse = _clearingHouse;
    }

    function setFactory(address _factory) public onlyOwner {
        factory = _factory;
    }

    function setQuoteToken(address _quoteToken) public onlyOwner {
        quoteToken = _quoteToken;
    }

    // 1% = 1e4, 100% = 1e6
    function setFeeRatio(address _baseToken, uint24 _feeRatio) public onlyOwner{
        require(_feeRatio >= 1e2 && _feeRatio <= 1e3, "");  // 0.01% <= feeRatio <= 0.1%
        feeRatio[_baseToken] = _feeRatio;
    }

    function setPriceImpactLimit(address _baseToken, uint24 _priceImpactLimit) public onlyOwner{
        require(_priceImpactLimit >= 5e3 && _priceImpactLimit <= 5e4, "");  // 0.5% <= feeRatio <= 5.0%
        priceImpactLimit[_baseToken] = _priceImpactLimit;
    }

    function hasPool(address _baseToken) public view returns(bool) {
        return getPool(_baseToken) != address(0);
    }   

    function getPool(address _baseToken) public view returns(address) {
        return pool[_baseToken];
    }     

    function getAllPools() public view returns(address[] memory) {
        return allPools;
    }

    function getAllBaseTokens() public view returns(address[] memory) {
        return allBaseTokens;
    }

    function getAllPoolsLength() public view returns(uint) {
        return allPools.length;
    }

    function getClearingHouse() public view returns(address) {
        return clearingHouse;
    }

    function getFactory() public view returns(address) {
        return factory;
    }

    function getQuoteToken() public view returns(address) {
        return quoteToken;
    }

    function getFeeRatio(address _baseToken) public view returns(uint24) {
        return feeRatio[_baseToken];
    }

    function getPriceImpactLimit(address _baseToken) public view returns(uint24) {
        return priceImpactLimit[_baseToken];
    }
}