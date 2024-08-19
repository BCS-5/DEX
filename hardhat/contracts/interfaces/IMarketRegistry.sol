// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

interface IMarketRegistry {
    event CreatePool(address poolAddress, address baseToken, address quoteToken);
    
    function createPool(string memory _name, string memory _symbol, uint8 _decimals) external;

    function setClearingHouse(address _clearingHouse) external;
    function setFactory(address _factory) external;
    function setQuoteToken(address _quoteToken) external;

    function setFeeRatio(address _baseToken, uint24 _feeRatio) external;
    function setPriceImpactLimit(address _baseToken, uint24 _priceImpactLimit) external;

    function getAllPools() external view returns(address[] memory);
    function getAllBaseTokens() external view returns(address[] memory);
    function getAllPoolsLength() external view returns(uint);

    function getClearingHouse() external view returns(address);
    function getFactory() external view returns(address);
    function getQuoteToken() external view returns(address);

    function getFeeRatio(address baseToken) external view returns(uint24);
    function getPriceImpactLimit(address baseToken) external view returns(uint24);
    
    function getPool(address _baseToken) external view returns(address);
    function hasPool(address _baseToken) external view returns(bool);
}