pragma solidity ^0.5.0;

// Just a test to see if we can work with multiple deployed contracts in drizzle.

contract Dummy {
    uint public counter;

    constructor() public {
        counter = 0;
    }

    function show() public view returns(uint) {
        return counter;
    }

    function incr() public {
        counter += 1;
    }

    function decr() public {
        counter -= 1;
    }


}

