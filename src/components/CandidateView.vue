<template>
<div>
    <hdrCan></hdrCan>
    <div class="contentCanVw">
        <p style="font-size: 20px;"> <b> View: </b> </p>
        <p> Your candidate score is <b><u> {{this.candidateScore}} </u></b>. </p>
        <p> Your Claims: </p>
        <ul>
        <li v-for="claim in claimsarr" :key="claim">
            <ul class="scorecard">
            <li v-for="field in claim" :key="field">
                {{field}}
            </li>
            </ul>
        </li>
        </ul>
    <hr>
    </div>
    <!--form >
      <p> <b> View Claim </b> </p>    
      
    <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
    label="Claim ID: " label-align-sm="left">
        <b-form-input  type="number" v-model="claimId" placeholder="ClaimID"></b-form-input>
    </b-form-group>

    <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
    label="Claim Type: " label-align-sm="left">
    <div class="ml-2 mt-2">
        <input type="radio" name="type" v-model="exp" v-bind:value="false">
        <label for="can" class="ml-2" style="text-align:left"> Academic </label>
 
        <br/>
        <input type="radio" name="type" v-model="exp" v-bind:value="true">
        <label for="ins" class="ml-2" style="text-align:left"> Experience </label>
    </div>
    </b-form-group>
        
    <br>
    <button class="btn btn-secondary" v-on:click.prevent="retrieveClaim"> Retrieve Claim </button>
    </form-->
    <!--div v-if="this.success">
        <p> Credential status is <b><u> {{this.status}}.</u></b> </p>
        <p> The claim score is <b><u> {{this.claimScore}}. </u></b> </p>
        <p> The candidate score is <b><u> {{this.candidateScore}}. </u></b> </p>
        <div class="scorecard">
            <p> <b> <i> Details: </i> </b> </p>
            <p v-for="field in arr" v-bind:key="field"> {{field}} </p>
        </div>
    </div-->
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import database from '../firebase.js' //to log our data

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
      async retrieveClaim(claimId) {
          this.success = true; //reset
          var status; //reset
          var s = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .getStatus(claimId)
            .call().catch((err) => { //call has no "then"!?
                this.success = false;
                console.log(err);
            });
          if (s=="0") {
              status = "rejected";
          } else if (s=="1") {
              status = "verified";
          } else if (s=="2") {
              status = "pending";
          } else if (s=="3") {
              status = "revoked";
          } else {
              status = "error";
          }
          var claimScore;
          var clmScore = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .getScore(claimId)
            .call().catch((err) => { //call has no "then"!?
                this.success = false;
                console.log(err);
            });
          if (clmScore == -1) {
              claimScore = "Score Not Avaliable Yet"
          } else {
              claimScore = clmScore
          }
          //var candidateScore;
          var canScore = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .getCandidateScore(this.activeAccount)
            .call().catch((err) => { //call has no "then"!?
                this.success = false;
                console.log(err);
            });
          if (canScore == -1) {
              this.candidateScore = "Score Not Avaliable Yet"
              //console.log(canScore);
              //console.log(candidateScore);
          } else {
              this.candidateScore = canScore;
              //console.log(canScore);
              //console.log(candidateScore);
          }
          var dat;
          var hsh;
          var obj;
          if (this.success) {
              hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(claimId).call();
              await database.collection("students").doc(this.activeAccount).collection("acads").doc(hsh).get().then(async doc => {
                  if (doc.exists) {
                      dat = await database.collection("students").doc(this.activeAccount).collection("acads").doc(hsh).get();
                      obj = dat.data();
                  } else {
                      dat = await database.collection("students").doc(this.activeAccount).collection("exp").doc(hsh).get();
                      obj = dat.data();
                  }
              })
          }
          var arr = [];
          arr.push("Claim ID: " + claimId);
          arr.push("Claim Score: " + claimScore);
          //arr.push("Candidate Score: " + candidateScore);
          arr.push("Status: " + status);
          try {
              await Object.keys(obj).forEach(field => {
                  return arr.push(field.toString() + ": " + obj[field]);
              });
              await arr.sort();
          } catch(err) {
              this.success = false;
              console.log(err);
          }
          return arr;
          /*if (this.success && this.exp) { //implies document exist to query our db
              hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.claimId).call();
              dat = await database.collection("students").doc(this.activeAccount).collection("exp").doc(hsh).get();
              obj = dat.data();
          } else if (this.success && !this.exp) {
              hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.claimId).call();
              dat = await database.collection("students").doc(this.activeAccount).collection("acads").doc(hsh).get();
              obj = dat.data();
          }
          this.arr = [];
          try {
              await Object.keys(obj).forEach(field => {
                  return this.arr.push(field.toString() + ": " + obj[field]);
              });
              await this.arr.sort();
          } catch(err) {
              this.success = false;
              console.log(err);
          }*/
      },
  },
  data() {
      return {
          claimId: '',
          success: false,
          //status: '',
          //exp: false,
          //arr: [],
          //claimScore: '',
          candidateScore: '',
          claimsarr: []
      }
  },
  beforeMount() {
        var dbinst = database.collection("students").doc(this.activeAccount).collection("claimlog");
        dbinst.get().then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                //console.log("CLAIM", doc.data()["claimID"]);
                var id = doc.data()["claimID"];
                var curr;
                curr = await this.retrieveClaim(id);
                this.claimsarr.push(curr);
            });
        }).catch((err) => {
            console.log(err);
        });

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

.scorecard {
        border-style: solid;
        border-width: 1px;
        padding: 10px;
        border-radius: 16px;
        border-color: grey;
        margin: 20px;
}

.contentCanVw {
    padding: 0px 20px 20px 20px;
}
</style>



