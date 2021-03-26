pragma solidity ^0.5.0;

// This is just a test to see if embeddd contracts work with drizzle

contract TokenCounter {
    address public owner;
    mapping (address => uint) count;

    constructor() public {
        owner = msg.sender;
    }

    function mint(address student) public {
        count[student] = count[student] + 1;
    }

    function tokenCount(address student) public view returns(uint) {
        return count[student];
    }
}

