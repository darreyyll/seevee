<template>
<div>
    <hdrIns></hdrIns>
    <br><hr>
    <p> <b> Verify Credential </b> </p>
    <button class="switch" v-on:click="showAcad"> Academic </button>
    <button class="switch" v-on:click="showExp"> Experience </button>
    <div v-if="this.switch.acad">
    <br>
    <div class="holdinstdetails">
    <h3 > Academic Claim </h3>
    <label > Enter Claim ID </label><br>
    <input v-model="claimId" @change="checkClaimId"><br>
    <i>{{claimId}}</i> <br><br>
    <label > Enter Candidate's Address </label><br>
    <input v-model="candidateAddress"><br>
    <i>{{candidateAddress}}</i>
    </div>
    <div v-if="valid_claimid">
    <upload-claim v-on:submitted="submit_claim"> </upload-claim>
    </div>
    <!-- <form>
        <label> Claim ID: </label>
        <input type="number" v-model="acad.id" placeholder="ClaimID"/> <br>
        <label> Candidate: </label>
        <input type="text" v-model="acad.user" placeholder="Candidate Address"/> <br>
        <label> Module Code: </label>
        <input type="text" v-model="acad.modCode" placeholder="Module Code"/> <br>
        <label> Grade: </label>
        <input type="text" v-model="acad.grade" placeholder="Attained Grade"/> <br>
        <br>
        <button v-on:click.prevent="verifyAcad"> Verify Academic Credential </button>
    </form> -->

    <br>
    </div>
    <div v-if="this.switch.exp">
    <br>
    <div class="holdinstdetails">
    <h3 > Experience Claim </h3>
    <label > Enter Claim ID </label><br>
    <input v-model="claimId"><br>
    <i>{{claimId}}</i>
    </div>
    <upload-claim v-on:submitted="submit_claim"> </upload-claim>
    <!-- <form>
        <label> Claim ID: </label>
        <input type="number" v-model="exp.id" placeholder="ClaimID"/> <br>
        <label> Candidate: </label>
        <input type="text" v-model="exp.user" placeholder="Candidate Address"/> <br>
        <label> Start Date: </label>
        <input type="text" v-model="exp.startDate" placeholder="Start Dates"/> <br>
        <label> End Date: </label>
        <input type="text" v-model="exp.endDate" placeholder="End Date"/> <br>
        <label> Performance: </label>
        <input type="text" v-model="exp.performanceRating" placeholder="Performance Rating"/> <br>
        <label> Comments: </label>
        <input type="text" v-model="exp.comments" placeholder="Comments"/> <br>
        <br>
        <button v-on:click.prevent="verifyExp"> Verify Experience Credential </button>
    </form> -->
    <br>
    </div>
    <b v-if="computingscore"> Computing Score. Please do not close this browser </b>
    <br><hr>
    <h3> Candidate's Credential Has Been Scored: </h3>
    {{final_score}} %<hr>
    <p> <b> Revoke Credential </b> </p>
    <form>
        <label> Credential ID: </label>
        <input type="number" v-model="revoke.id" placeholder="Credential ID"/> <br> 
        <br>
        <button v-on:click.prevent="revokeCred"> Revoke Credential </button>
    </form>
    <br>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import database from '../firebase.js' //to log our data
import UploadClaim from './UploadClaim2.vue';

export default {
  name: "app",
  computed: {
      ...mapGetters("accounts",["activeAccount","activeBalance"]),
      ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
  },
  methods: {
      async dummy() {
          console.log(database);
      },
      showAcad() {
          this.switch.acad = true;
          this.switch.exp = false;
      },
      showExp() {
          this.switch.acad = false;
          this.switch.exp = true;
      },
      async verifyAcad() {
        //   var hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.acad.id).call();
        //   var score = 100; //INSERT SOCRING ALGO HERE
          var status = 1; //INSERT STATUS FROM SCORE ABOVE
        //   //Update database accoridng to institution's entry
          await database.collection("students").doc(this.candidateAddress).collection("acads").doc(this.hsh).update({
            //   moduleCode: this.acad.modCode,
            //   gradeAttained: this.acad.grade,
            claim_contents : this.counterclaim
          });
          await this.drizzleInstance.contracts.Credential.methods.do_score(this.claimId, this.final_score, status).send();
      },
      async verifyExp() {
        //   var hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.exp.id).call();
        //   var score = 100; //INSERT SOCRING ALGO HERE
          var status = 1; //INSERT STATUS FROM SCORE ABOVE
          //Update database accoridng to institution's entry
          await database.collection("students").doc(this.candidateAddress).collection("exp").doc(this.hsh).update({
            //   startDate: this.exp.startDate,
            //   endDate: this.exp.endDate,
            //   performanceRating: this.exp.performanceRating,
            //   comments: this.exp.comments,
            claim_contents : this.counterclaim
          });
          await this.drizzleInstance.contracts.Credential.methods.do_score(this.claimId, this.final_score, status).send();
      },
      async revokeCred() {
          await this.drizzleInstance.contracts.Credential.methods.revoke(this.revoke.id).send();
      },
      async checkClaimId() {
          try {
            var check = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.claimId).call();
            // console.log("CHECK = ", check);
            this.hsh = check;
            this.valid_claimid = true;
          } catch(err) {
              console.log("err")
              this.claimId = "INVALID"
          }

      },

      submit_claim(json_file) {
          
          this.counterclaim = json_file;
          console.log(this.counterclaim);
          console.log(JSON.stringify(this.counterclaim))
          this.computeScore()
          this.computingscore = true;
          if(this.switch.acad) {
              this.verifyAcad();
          } else {
              this.verifyExp();
          }
      },

     async computeScore() {
         
         if(this.switch.acad) {
            
             await database.collection('students').doc(this.candidateAddress).collection("acads").doc(this.hsh).get().then((doc) => {
                 if(doc.exists) {
                    this.claim = doc.data()
                    this.claim = this.claim["claim_contents"]
                 }
             }).catch((error) => {
                    console.log("Error getting document:", error);
                });


         } else {
            await database.collection('students').doc(this.candidateAddress).collection("exp").doc(this.hsh).get().then((doc) => {
                 if(doc.exists) {
                     console.log("DOC = ", doc.data())
                    this.claim = doc.data()["claim_contents"];
                 }
             }).catch((error) => {
                    console.log("Error getting document:", error);
                });

         }
        console.log("CLAIM = ", this.claim)
        // data = claim
        //this.counterclaim = counterclaim

    

        for(var key in this.counterclaim) {
            // console.log("KEY " , key)
            // console.log("VALUE", this.counterclaim[key])
            try {
                let field = this.claim[key]
                // console.log("FIELD", field)
                let score = this.scoreAlgo(this.counterclaim[key], field, this.counterclaim[key].length, field.length);
                console.log(key, " SCORE = ", score);
                this.total_score += score;
                this.total_potential += this.counterclaim[key].length;
            } catch(e) {
                console.log("No such field")
                this.total_score -= 50; //punitive measure
            }
        }

        console.log("Total Score", this.total_potential - this.total_score, " Total Potential", this.total_potential)
        this.final_score = (this.total_potential - this.total_score)/this.total_potential;
        this.final_score = this.final_score * 100;
        console.log("Final Score = ", this.final_score)
        this.computingscore = false;



    },

    scoreAlgo(field1, field2, m, n) {

        if (m == 0)
            return n;

        if (n == 0)
            return m;
 
        if (field1.charAt(m - 1) == field2.charAt(n - 1))
            return this.scoreAlgo(field1, field2, m - 1, n - 1);
 
        return 1
            + Math.min(this.scoreAlgo(field1, field2, m, n - 1), // Insert
                  this.scoreAlgo(field1, field2, m - 1, n), // Remove
                  this.scoreAlgo(field1, field2, m - 1,
                           n - 1) // Replace
              );
    }
    
  },
  data() {
      return {
          // all these data will serve as arguments to our contract calls
          switch: {
              acad: true,
              exp: false,
          },
          claimId: "",
          acad: {
              id: '',
              user: '',
              addr: '',
              modCode: '',
              grade: '',
          },
          exp: {
              id: '',
              user: '',
              addr: '',
              startDate: '',
              endDate: '',
              performanceRating: '',
              comments: '',
          },
          revoke: {
              id: '',
              exp: false,
          },
          counterclaim: {},
          claim: {},
          computingscore : false,
          valid_claimid : false,
          candidateAddress : "",
          hsh : "",
          total_score : 0,
          total_potential: 0,
          final_score: 0
      }
  },
  components : {
      UploadClaim
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
