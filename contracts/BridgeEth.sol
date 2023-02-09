pragma solidity ^0.8.0;

import "./BridgeBase.sol";

contract BridgeEth is SwapBridgeBase {
    constructor(address token) SwapBridgeBase(token) {}
}
