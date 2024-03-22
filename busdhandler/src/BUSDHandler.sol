// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/interfaces/IERC20.sol";

contract BUSDHANDLER {
    IERC20 public BUSD;

    error InvalidAmount();
    error TransferFailed();

    constructor(address _busd) {
        BUSD = IERC20(_busd);
    }

    function sendBUSD(uint256 amount, address receipient) external {
        if (amount == 0) {
            revert InvalidAmount();
        }

        bool success = BUSD.transferFrom(msg.sender, receipient, amount);

        if (!success) {
            revert TransferFailed();
        }
    }
}
