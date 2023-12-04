// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@layerzerolabs/solidity-examples/contracts/token/oft/extension/ProxyOFT.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyProxyOFT is ProxyOFT {
    constructor(address _lzEndpoint, address _token) ProxyOFT(_lzEndpoint, _token) {}
}