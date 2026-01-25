// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LiquidNationCcip.sol";

contract LiquidNationCcipTest is Test {
    function testVersion() public {
        LiquidNationCcip ccip = new LiquidNationCcip();
        assertEq(ccip.version(), "liquid-nation-ccip-v0");
    }
}
