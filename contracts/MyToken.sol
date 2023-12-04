// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 private _maxTotalSupply;
    mapping(address => bool) private _isMinted;

    constructor(address[] memory addresses) ERC20("MyToken", "MTK") {
        _maxTotalSupply = 1000000 * (10 ** uint256(decimals()));
        uint256 initialSupply = 100000 * (10 ** uint256(decimals()));

        for (uint256 i = 0; i < addresses.length; i++) {
            if (!_isMinted[addresses[i]]){
                mint(addresses[i], initialSupply);
                _isMinted[addresses[i]] = true;
            }
        }
    }


    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= _maxTotalSupply, "ERC20: mint amount exceeds max total supply");
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }
}