//SPDX-License-Identifier: UNLICENCE
pragma solidity >=0.8.2 < 0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

/*
- 유동성 풀 생성
- 유동성 풀 데이터 관리
- vBTC 주소 입력하면 풀 주소 반환
*/

contract MarketRegistry is Ownable{
    address factory;
    address QUOTE_TOKEN;

    mapping(address => address) private _pool;

    constructor(address _factory) Ownable(msg.sender) {
        factory = _factory;
    }

    function createPool(address _baseToken) public onlyOwner {        
        _pool[_baseToken] = IUniswapV2Factory(factory).createPair(_baseToken, QUOTE_TOKEN);
    }

    function setFactory(address _factory) public onlyOwner {
        factory = _factory;
    }

    function setQuoteToken(address _quote) public onlyOwner {
        QUOTE_TOKEN = _quote;
    }

    function getPool(address _baseToken) public view returns(address) {
        return _pool[_baseToken];
    }

    function hasPool(address _baseToken) public view returns(bool) {
        return _pool[_baseToken] != address(0);
    }

    function getFactory() public view returns(address) {
        return factory;
    }
}