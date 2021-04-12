var Credential = artifacts.require('./Credential.sol');
const truffleAssert = require('truffle-assertions');

contract('Credential', function(accounts) {

  var cInstance = null;

  beforeEach(async () => {
    cInstance = await Credential.deployed();
  });

  it('Should check for new account registration', async () => {
      
    const inCandidatePool = await cInstance.candidate_pool.call(accounts[1]); 
    const inInstitutionPool = await cInstance.institution_pool.call(accounts[1]); 
    const existsBefore = await cInstance.recordExists(accounts[1]); 
    if (!existsBefore) {
      assert.strictEqual(inCandidatePool,false); //assert not in candidate pool
      assert.strictEqual(inInstitutionPool,false); //assert not in institution pool
    }

  });

  it('Should add a candidate to the candidate pool', async () => {
      
    const existsBefore = await cInstance.candidate_pool.call(accounts[1]); 
    assert.strictEqual(existsBefore,false);

    let result = await cInstance.listCandidate(accounts[1]);
    truffleAssert.eventEmitted(result, 'candidateListed');
  
    const addSuccessful = await cInstance.candidate_pool.call(accounts[1]);   
    assert.strictEqual(addSuccessful,true); 

  });

  it('Should check that account has been registered before', async () => {
      
    await cInstance.candidate_pool.call(accounts[1]);
    const inCandidatePool = await cInstance.candidate_pool.call(accounts[1]); 
    const inInstitutionPool = await cInstance.institution_pool.call(accounts[1]); 
    const existsBefore = await cInstance.recordExists(accounts[1]); 

    if (existsBefore) {
      assert.strictEqual(inCandidatePool,!inInstitutionPool); 
      assert.strictEqual(inInstitutionPool,!inCandidatePool); 
    }
      
  });

  it('Should add an institution to the institution pool', async () => {
      
    const existsBefore = await cInstance.institution_pool.call(accounts[2]); 
    assert.strictEqual(existsBefore,false);

    let result = await cInstance.listInstitution(accounts[2]);
    truffleAssert.eventEmitted(result, 'institutionListed');
  
    const addSuccessful = await cInstance.institution_pool.call(accounts[2]);   
    assert.strictEqual(addSuccessful,true); 

  });

  it('Should FAIL to add a candidate to the candidate pool - account exists', async () => {
      
    let result = cInstance.listCandidate(accounts[2]);
    await truffleAssert.reverts(result, "Account has previously been registered");

  });

  it('Should FAIL to add an institution to the institution pool - account exists', async () => {
      
    let result = cInstance.listInstitution(accounts[1]);
    await truffleAssert.reverts(result, "Account has previously been registered");

  });

  it('Should successfully create a claim', async () => {

    let candidate = accounts[1];
    let verifier = accounts[2];
    let content = "Graduated from NUS";

       
    let result = await cInstance.createClaim(verifier, content, { from: candidate });
    truffleAssert.eventEmitted(result, 'claimCreated');

    let claim = await cInstance.claim_records.call(0); 
    assert.strictEqual(claim.candidate, candidate);
    assert.strictEqual(claim.verifier, verifier);
    assert.strictEqual(claim.content, content);
  });

  it('Should FAIL to create a claim - Sender not a listed candidate', async () => {

    let candidate = accounts[3];
    let verifier = accounts[2];
    let content = "Graduated from NUS";

    await truffleAssert.reverts(cInstance.createClaim(verifier, content, { from: candidate}), "Sender is not a listed candidate"); 
        
  });

  it('Should FAIL create a valid claim - Verifying institution is not a listed institution', async () => {
      
    let candidate = accounts[1];
    let verifier = accounts[3];
    let content = "Graduated from NUS";

    await truffleAssert.reverts(cInstance.createClaim(verifier, content, { from: candidate}), "Verifying institution is not a listed institution");         
  });

  it('Should successfully update score for a claim', async () => {
      
    let verifier = accounts[2];
    let claim = await cInstance.claim_records.call(0); 
    let score = 100;
    let status = 1;
      
    await cInstance.do_score(claim.id, score, status, {from: verifier});
    let updatedClaim = await cInstance.claim_records.call(0); 

    assert.strictEqual(String(updatedClaim.score), String(score));
    assert.strictEqual(String(updatedClaim.status), String(status));
  });

  it('Should FAIL to update score for a claim - Sender is not a listed institution', async () => {
      
    let verifier = accounts[3];
    let claim = await cInstance.claim_records.call(0); 
    let score = 100;
    let status = 1;
      
    await truffleAssert.reverts(cInstance.do_score(claim.id, score, status, {from: verifier}), "Sender is not a listed institution");
  });

  it('Should FAIL to update score for a claim - Claim already assigned a score', async () => {
      
    let verifier = accounts[2];
    let claim = await cInstance.claim_records.call(0); 
    let score = 100;
    let status = 1;
      
    await truffleAssert.reverts(cInstance.do_score(claim.id, score, status, {from: verifier}), "Claim already assigned a score");
  });

  it('Should FAIL to update score for a claim - Sender does not have verifying rights', async () => {
      
    let candidate = accounts[1];
    let actual_verifier = accounts[2];
    let content = "Graduated from NUS";
    let test_verifier = accounts[4];

    await cInstance.createClaim(actual_verifier, content, { from: candidate});
    await cInstance.listInstitution(test_verifier); 

    let claim = await cInstance.claim_records.call(1); 
    let score = 100;
    let status = 1;
      
    await truffleAssert.reverts(cInstance.do_score(claim.id, score, status, {from: test_verifier}), "Sender does not have verifying rights");
  });

  it('Should successfully revoke a claim', async () => {
      
    let verifier = accounts[2];
    let claim = await cInstance.claim_records.call(0);
    let expectedStatus = 3;
      
    await cInstance.revoke(claim.id, {from: verifier});
    let updatedClaim = await cInstance.claim_records.call(0); 

    assert.strictEqual(String(updatedClaim.status), String(expectedStatus));
  });

  it('Should FAIL to revoke a claim - Sender is not a listed institution', async () => {
      
    let verifier = accounts[3];
    let claim = await cInstance.claim_records.call(0);

    await truffleAssert.reverts(cInstance.revoke(claim.id, {from: verifier}), "Sender is not a listed institution");
  });

  it('Should FAIL to revoke a claim - Sender does not have verifying rights', async () => {
      
    let verifier = accounts[4];
    let claim = await cInstance.claim_records.call(0);

    await truffleAssert.reverts(cInstance.revoke(claim.id, {from: verifier}), "Sender does not have verifying rights");
  });

  it('Should successfully give permission to view', async () => {
      
    let candidate = accounts[1];
    let thirdParty = accounts[4];
    let claim = await cInstance.claim_records.call(0);
  
    await cInstance.givePermission(thirdParty, claim.id, {from: candidate});
    let result = await cInstance.permission_records.call(claim.id, thirdParty);
    assert(result);
  });

  it('Should FAIL to give permission to view - Sender is not the candidate of specified claim', async () => {
      
    let candidate = accounts[3];
    let thirdParty = accounts[4];
    await cInstance.listCandidate(candidate);
    let claim = await cInstance.claim_records.call(0);

    await truffleAssert.reverts(cInstance.givePermission(thirdParty, claim.id, {from: candidate}), "Sender is not the candidate of specified claim");
  });

  it('Should FAIL to give permission to view - Third party is not a listed institution', async () => {
      
    let candidate = accounts[1];
    let thirdParty = accounts[3];
    let claim = await cInstance.claim_records.call(0);

    await truffleAssert.reverts(cInstance.givePermission(thirdParty, claim.id, {from: candidate}), "Third party is not a listed institution");
  });

  it('Should successfully update total score of candidate (first claim)', async () => {

    let candidate = accounts[5];
    let verifier = accounts[6];
    let content = "Test";

    await cInstance.listCandidate(candidate);
    await cInstance.listInstitution(verifier);
    
    let result = await cInstance.createClaim(verifier, content, { from: candidate });
    truffleAssert.eventEmitted(result, 'claimCreated');

    let claim = await cInstance.claim_records.call(2); 
    let score = 100;
    let status = 1;
      
    await cInstance.do_score(claim.id, score, status, {from: verifier});
    let claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    let total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(1));
    assert.strictEqual(String(total_score), String(100));

  });

  it('Should successfully update total score of candidate (subsequent claim)', async () => {

    let candidate = accounts[5];
    let verifier = accounts[6];
    let content = "Test";
    
    let result = await cInstance.createClaim(verifier, content, { from: candidate });
    truffleAssert.eventEmitted(result, 'claimCreated');

    let claim = await cInstance.claim_records.call(3); 
    let score = 80;
    let status = 1;
      
    await cInstance.do_score(claim.id, score, status, {from: verifier});
    let claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    let total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(2));
    assert.strictEqual(String(total_score), String(90));

  });

  it('Should successfully update total score of candidate (subsequent claims) - int division', async () => {

    let candidate = accounts[5];
    let verifier = accounts[6];
    let content = "Test";
    
    let result = await cInstance.createClaim(verifier, content, { from: candidate });
    truffleAssert.eventEmitted(result, 'claimCreated');

    let claim = await cInstance.claim_records.call(4); 
    let score = 70;
    let status = 1;
      
    await cInstance.do_score(claim.id, score, status, {from: verifier});
    let claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    let total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(3));
    assert.strictEqual(String(total_score), String(83)); // (90 * 2 + 70) / 3 = 83

    result = await cInstance.createClaim(verifier, content, { from: candidate });
    truffleAssert.eventEmitted(result, 'claimCreated');
    claim = await cInstance.claim_records.call(5);

    await cInstance.do_score(claim.id, score, status, {from: verifier});
    claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(4));
    assert.strictEqual(String(total_score), String(79)); // (83 * 3 + 70) / 4 = 79

  });

  it('Should successfully update total score of candidate after revoked claim', async () => {
      
    let candidate = accounts[5];
    let verifier = accounts[6];
    let claim = await cInstance.claim_records.call(2);
    let expectedStatus = 3;
      
    await cInstance.revoke(claim.id, {from: verifier});
    let updatedClaim = await cInstance.claim_records.call(2); 

    assert.strictEqual(String(updatedClaim.status), String(expectedStatus));

    let claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    let total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(3));
    assert.strictEqual(String(total_score), String(72)); // (79 * 4 - 100) / 3 = 72
  });  

  it('Should successfully update total score of candidate after revoking all claims', async () => {
      
    let candidate = accounts[5];
    let verifier = accounts[6];
    let expectedStatus = 3;

    let claim = await cInstance.claim_records.call(3);
    await cInstance.revoke(claim.id, {from: verifier});
    let updatedClaim = await cInstance.claim_records.call(3); 
    assert.strictEqual(String(updatedClaim.status), String(expectedStatus));

    let claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    let total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(2));
    assert.strictEqual(String(total_score), String(68)); // (72 * 3 - 80) / 2 = 68

    claim = await cInstance.claim_records.call(4);
    await cInstance.revoke(claim.id, {from: verifier});
    updatedClaim = await cInstance.claim_records.call(4); 
    assert.strictEqual(String(updatedClaim.status), String(expectedStatus));

    claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(1));
    assert.strictEqual(String(total_score), String(66)); // (68 * 2 - 70) / 1 = 66

    claim = await cInstance.claim_records.call(5);
    await cInstance.revoke(claim.id, {from: verifier});
    updatedClaim = await cInstance.claim_records.call(5); 
    assert.strictEqual(String(updatedClaim.status), String(expectedStatus));

    claim_count = await cInstance.candidate_verified_claim_count.call(candidate); 
    total_score = await cInstance.candidate_total_scores.call(candidate);

    assert.strictEqual(String(claim_count), String(0));
    assert.strictEqual(String(total_score), String(0)); // last claim revoked
  });  

});
