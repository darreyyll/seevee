pragma solidity ^0.5.0;

contract Credential {
    
    mapping(address => claim[]) public candidate_claim_records;
    mapping(uint256 => claim) public claim_records;
    mapping(uint256 => mapping(address => bool)) public permission_records; // Claim Id ==> Third Party's Address => Bool of permission given
    mapping(address => int256) public candidate_total_scores;
    mapping(address => int256) public candidate_verified_claim_count;
    mapping(address => bool) public candidate_pool;
    mapping(address => bool) public institution_pool;

    uint256 claim_counter = 0;

    struct claim {
        address candidate;
        address verifier;
        int256 score;
        uint256 id;
        string content; // points to firebase database
        uint8 status; // 0 is false, 1 is true, 2 is pending, 3 for revoke status?
    }
    
    event claimCreated(uint256 claimId, address verifier);
    event candidateListed (address candidate);
    event institutionListed (address institution);

    function recordExists(address _check) view public returns(bool) {
        bool result = false;
        if(candidate_pool[_check] || institution_pool[_check]) {
            result = true;
        } 
        return result;
    }

    function listCandidate(address candidate) public {
        if (recordExists(candidate)){
            revert("Account has previously been registered");
        } else {
        candidate_pool[candidate] = true;
        emit candidateListed(candidate);
        }
    }
    
    function listInstitution(address institution) public {
        if (recordExists(institution)){
            revert("Account has previously been registered");
        } else {
        institution_pool[institution] = true;
        emit institutionListed(institution);
        }
    }

    function createClaim(address verifying_institution, string memory details) public {
        require(candidate_pool[msg.sender], "Sender is not a listed candidate");
        require(institution_pool[verifying_institution], "Verifying institution is not a listed institution");

        // Create a claim instance
        claim memory newClaim = claim(
            msg.sender,
            verifying_institution,
            -1, // no score assigned yet
            claim_counter,
            details, // populate claims with details (string)
            2 // pending
        );

        // when they call this, then it sends to a verifier
        emit claimCreated(claim_counter, verifying_institution);
        
        // Add to candidate_claim_records
        candidate_claim_records[msg.sender].push(newClaim);

        // update claim_records
        claim_records[claim_counter] = newClaim;
        claim_counter++;
    }

    function do_score(uint256 claimId, int256 score, uint8 status) public {
        require(institution_pool[msg.sender], "Sender is not a listed institution");
        require(claim_records[claimId].score == -1, "Claim already assigned a score");
        require(claim_records[claimId].status == 2, "Only pending claims can be assigned a new score");
        require(claim_records[claimId].verifier == msg.sender, "Sender does not have verifying rights");

         // update claim score
        claim_records[claimId].score = score; 

        // update candidate total score
        address candidate = claim_records[claimId].candidate;
        int256 prev_score = candidate_total_scores[candidate];
        int256 claim_count = candidate_verified_claim_count[candidate];
        int256 updated_score;
        if(claim_count == 0) {
            updated_score = score;
            claim_count = 1;
        } else {
            updated_score = (prev_score * claim_count) + score;
            claim_count += 1;
            updated_score = updated_score / claim_count; 
        }
        candidate_total_scores[candidate] = updated_score;
        candidate_verified_claim_count[candidate] = claim_count;

        // update status
        claim_records[claimId].status = status;
    }

    function revoke(uint256 claim_id) public {
        require(institution_pool[msg.sender], "Sender is not a listed institution");
        require(claim_records[claim_id].verifier == msg.sender, "Sender does not have verifying rights");
        
        //change status to revoke claim validity
        claim_records[claim_id].status = 3; // 3 for revoke status

        // update candidate total score
        address candidate = claim_records[claim_id].candidate;
        int256 prev_score = candidate_total_scores[candidate];
        int256 revoked_score = claim_records[claim_id].score;
        int256 claim_count = candidate_verified_claim_count[candidate];
        int256 updated_score;

        if (claim_count == 1) {
            updated_score = 0;
            claim_count = 0;
        } else {
            updated_score = ((prev_score * claim_count) - revoked_score) / (claim_count - 1);
            claim_count -= 1;
        }
        
        candidate_total_scores[candidate] = updated_score;
        candidate_verified_claim_count[candidate] = claim_count;
        
    }

    function givePermission(address thirdParty, uint256 claim_id) public {
        require(candidate_pool[msg.sender], "Sender is not in candidate pool");
        require(claim_records[claim_id].candidate == msg.sender, "Sender is not the candidate of specified claim");
        require(institution_pool[thirdParty], "Third party is not a listed institution");

        permission_records[claim_id][thirdParty] = true;
    }

    function viewClaim(uint256 claim_id) public view returns(string memory){
        require(claim_records[claim_id].candidate == msg.sender || claim_records[claim_id].verifier == msg.sender || permission_records[claim_id][msg.sender],
        "Sender does not have viewing rights"); //Only the owner/verifier/allowed third-party can view the claim
        return(claim_records[claim_id].content);
    }


    //ADDITIONAL GETTERS TO SUPPORT VUE APP
    function getClaimId() view public returns (uint256) {
        // returns current claim counter
        return claim_counter-1;
    }
    function getStatus(uint256 claim_id) view public returns (uint8) {
        require(claim_records[claim_id].candidate == msg.sender || claim_records[claim_id].verifier == msg.sender || permission_records[claim_id][msg.sender],
        "Sender does not have viewing rights"); //Only the owner/verifier/allowed third-party can view the claim
        return claim_records[claim_id].status;
    }
    function getScore(uint256 claim_id) view public returns (int256) {
        require(claim_records[claim_id].candidate == msg.sender || claim_records[claim_id].verifier == msg.sender || permission_records[claim_id][msg.sender],
        "Sender does not have viewing rights"); //Only the owner/verifier/allowed third-party can view the claim
        return claim_records[claim_id].score;
    }
    function getCandidateScore(address candidate) view public returns (int256) {
        return candidate_total_scores[candidate];
    }
}