// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal CCIP adapter scaffold for Liquid Nation.
/// @dev This is a placeholder contract to align with Foundry workflows.
///      Wire in Chainlink CCIP router + receiver once addresses are known.
contract LiquidNationCcip {
    event CcipMessageSent(bytes32 indexed messageId, uint64 destSelector);
    event CcipMessageReceived(bytes32 indexed messageId, uint64 sourceSelector);

    // TODO: add router and LINK token addresses
    // TODO: map chain selectors to CCIP-supported chains
    // TODO: implement send/receive logic and validation hooks

    function version() external pure returns (string memory) {
        return "liquid-nation-ccip-v0";
    }
}
