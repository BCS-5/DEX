 // SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import "./USDT.sol";

contract Faucet is Ownable{
    address public token;
    uint public claimAmount;

    constructor() {
        claimAmount = 100 * 10**6;
    }

    mapping(address => bool) claimed;

    function setUSDTAddress(address _token) public onlyOwner() {
        token = _token;
    }

    function setClaimAmount(uint _amount) public onlyOwner() {
        claimAmount = _amount;
    }

    function claimTestnetTokens() external {        
        address recipient = msg.sender;
        require(claimed[recipient] == false, "already claimed");
        claimed[recipient] = true;

        (bool success, ) = token.call(abi.encodeWithSignature("transfer(address,uint256)", recipient, claimAmount));
        require(success);        
    }
}