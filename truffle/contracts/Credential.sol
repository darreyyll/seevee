pragma solidity ^0.5.0;

import "./TokenCounter.sol";

// Testing credential
contract Credential {
    address public owner;
    TokenCounter counter;

    struct Acad {
        address student;
        string code;
        string grade;
        uint tokenId;
    }

    uint public tokenId;
    mapping (address => Acad[]) acadDirectory;

    constructor(TokenCounter counterAddress) public {
        owner = msg.sender;
        tokenId = 0;
        counter = counterAddress;
    }

    modifier ownerOnly() {
        require(owner == msg.sender, "Only owner can perform this task.");
        _;
    }

    function mintAcad(address student, string memory code, string memory grade) public ownerOnly() {
        counter.mint(student);
        tokenId += 1;
        Acad memory entry = Acad(
            student,
            code,
            grade,
            tokenId
        );
        acadDirectory[student].push(entry);
    }

    function viewGrade(address student, string memory module) public view returns(string memory) {
        string memory res = "NA";
        bool flag = true;
        uint c = 0;
        Acad[] memory arr = acadDirectory[student];
        uint max = arr.length;
        while (flag && (max>c)) {
            if (keccak256(bytes(arr[c].code)) == keccak256(bytes(module))) {
                flag = false;
                res = arr[c].grade;
            } else {
                c += 1;
            }
        }
        return res;
    }

    function viewOwner() public view returns(address) {
        return owner;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function studentAcadCount(address student) public view returns(uint) {
        return counter.tokenCount(student);
    }

    function totalToken() public view returns(uint) {
        return tokenId;
    }
}

