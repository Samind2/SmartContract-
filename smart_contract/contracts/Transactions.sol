// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Transactions {
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
  
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;
    mapping(uint256 => bool) public refundStatus;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public payable {
    require(msg.value >= amount, "Insufficient funds sent to add to blockchain.");
    require(amount > 0, "Amount must be greater than zero.");

    // Update the transaction count and store the transaction
    transactionCount += 1;
    transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

    emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
}

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    function requestRefund(uint256 transactionId) public {
    require(transactionId < transactionCount, "Transaction does not exist.");
    require(msg.sender == transactions[transactionId].sender, "Only the sender can request a refund.");
    require(!refundStatus[transactionId], "Refund already processed.");

    uint amount = transactions[transactionId].amount;
    
    // Check if the contract has enough balance to refund
    require(address(this).balance >= amount, "Insufficient contract balance for refund.");

    payable(msg.sender).transfer(amount); // Sending the amount back to the sender
    refundStatus[transactionId] = true;

    emit Transfer(msg.sender, transactions[transactionId].receiver, amount, "Refund", block.timestamp, "Refund");
}
}
