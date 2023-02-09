pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapBridgeBase {
    IERC20 token;
    mapping(address => mapping(bytes => bool)) processedUserSignatures;

    constructor(address _token) {
        token = IERC20(_token);
    }

    event DepositSuccess(
        address user,
        uint amount,
        uint nonce,
        bytes signature
    );
    event WithdrawSuccess(
        address user,
        uint amount,
        uint nonce,
        bytes signature
    );

    function swap(
        address user,
        uint amount,
        uint nonce,
        bytes memory signature
    ) public {
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(user, amount, nonce))
        );
        require(
            recoverSigner(message, signature) == user,
            "Signature Error: Not Signed by the Proposer"
        );

        require(
            token.allowance(user, address(this)) >= amount,
            "Insufficient Allowance to contract"
        );
        // take tokens in from user
        token.transferFrom(user, address(this), amount);

        emit DepositSuccess(user, amount, nonce, signature);
    }

    function withdraw(
        address user,
        uint amount,
        uint nonce,
        bytes memory signature
    ) public {
        // if the signature is valid
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(user, amount, nonce))
        );
        require(
            recoverSigner(message, signature) == user,
            "Signature Error: Not Signed by the Proposer"
        );
        require(
            !processedUserSignatures[user][signature],
            "Transaction has already been processed!"
        );

        token.transfer(user, amount);
        processedUserSignatures[user][signature] = true;

        emit WithdrawSuccess(user, amount, nonce, signature);
    }

    /** Signature Verification Utilities */

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function recoverSigner(
        bytes32 message,
        bytes memory sig
    ) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
