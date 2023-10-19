// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SendEther {
    // event Transfer storing data on bc
    uint256 public transactionCount; //now we made it public so no need to call getTransactionCount() function
    event Log(string func, uint gas);
    event Transfer(
        address from,
        address receiver,
        uint amount,
        string message,
        uint256 timestamp,
        string keyword
    );
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockChain(
        address payable receiver, //payable address can recive ether
        uint amount,
        string memory message,
        string memory keyword
    ) public {
        console.log("receiver = ", receiver);
        console.log("amount = ", amount);
        console.log("message = ", message);
        console.log("keyword = ", keyword);

        transactionCount += 1;
        transactions.push(
            TransferStruct( //user to maintain array of no of transactions
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );

        emit Transfer( //emit is used to retrieve data from bc and used to see logs
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );

        emit Log("fallback", gasleft());
    }

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount; //returns the current value of transactionCount, indicating the total number of transactions recorded on the blockchain using this contract.
    }
}
