var Credential = artifacts.require("./Credential.sol");
const truffleAssert = require('truffle-assertions');

contract('Credential', function(accounts) {
    let cInstance = null;
  
    before(async () => {
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
      //console.log("existsBefore", existsBefore); //false
      assert.strictEqual(existsBefore,false);

      let result = await cInstance.listCandidate(accounts[1]);
      truffleAssert.eventEmitted(result, 'candidateListed');
  
      const addSuccessful = await cInstance.candidate_pool.call(accounts[1]);   
      //console.log("addSuccessful", addSuccessful); //true
      assert.strictEqual(addSuccessful,true); 

      

    });

    it('Should check that account has been registered before', async () => {
       
      const inCandidatePool = await cInstance.candidate_pool.call(accounts[1]); 
      const inInstitutionPool = await cInstance.institution_pool.call(accounts[1]); 
      const existsBefore = await cInstance.recordExists(accounts[1]); 
      //console.log("existsBefore", existsBefore); //true
      if (existsBefore) {
        assert.strictEqual(inCandidatePool,!inInstitutionPool); 
        assert.strictEqual(inInstitutionPool,!inCandidatePool); 
      }
      
    });

    it('Should add an institution to the institution pool', async () => {
      
      const existsBefore = await cInstance.institution_pool.call(accounts[2]); 
      //console.log("existsBefore", existsBefore); //false
      assert.strictEqual(existsBefore,false);

      let result = await cInstance.listInstitution(accounts[2]);
      truffleAssert.eventEmitted(result, 'institutionListed');
  
      const addSuccessful = await cInstance.institution_pool.call(accounts[2]);   
      //console.log("addSuccessful", addSuccessful); //true
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

       
      let result = await cInstance.createClaim(verifier, content, { from: candidate});
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

});
