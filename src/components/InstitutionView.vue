<template>
<div>
    <hdrIns></hdrIns>
    <div class="contentInsView">
        <p style="font-size: 20px;"> <b> View Credential </b> </p>
        <form>

        <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
        label="Credential ID: " label-align-sm="left">
            <b-form-input type="number" v-model="claimId" placeholder="Credential ID"></b-form-input>
        </b-form-group>

         <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
         label="Candidate: " label-align-sm="left">
            <b-form-input type="text" v-model="user" placeholder="Candidate Address"></b-form-input>
         </b-form-group>

           <b-form-group label-cols-sm="1" label-cols-lg="1" label="Type: " label-align-sm="left">
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
        </form>
        <hr>
        <div v-if="this.success">
            <!-- Can add score here if status is valid -->
            <p> Credential status is <b><u> {{this.status}}.</u></b> </p>
            <p> The claim score is <b><u> {{this.claimScore}}. </u></b> </p>
            <!--p> The candidate score is <b><u> {{this.candidateScore}}. </u></b> </p-->
            <div class="scorecard">
                <p> <b> <i> Details: </i> </b> </p>
                <p v-for="field in arr" v-bind:key="field"> {{field}} </p>
            </div>
        </div>
    </div>
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
      async retrieveClaim() {
          this.success = true; //reset
          this.status = ''; //reset
          var s = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .getStatus(this.claimId)
            .call().catch((err) => { //call has no "then"!?
                this.success = false;
                console.log(err);
            });
          if (s=="0") {
              this.status = "rejected";
          } else if (s=="1") {
              this.status = "verified";
          } else if (s=="2") {
              this.status = "pending";
          } else if (s=="3") {
              this.status = "revoked";
          } else {
              this.status = "error";
          }
          var clmScore = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .getScore(this.claimId)
            .call().catch((err) => { //call has no "then"!?
                this.success = false;
                console.log(err);
            });
          if (clmScore == -1) {
              this.claimScore = "Score Not Avaliable Yet"
          } else {
              this.claimScore = clmScore
          }
          /*
          var canScore = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .getCandidateScore(this.claimId)
            .call().catch((err) => { //call has no "then"!?
                this.success = false;
                console.log(err);
            });
          if (canScore == -1) {
              this.candidateScore = "Score Not Avaliable Yet"
          } else {
              this.candidateScore = canScore
          }*/
          var dat;
          var hsh;
          var obj;
          if (this.success && this.exp) { //implies document exist to query our db
              hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.claimId).call();
              dat = await database.collection("students").doc(this.user).collection("exp").doc(hsh).get();
              obj = dat.data();
              if (obj == undefined) {
                  this.success=false;
              }
          } else if (this.success && !this.exp) {
              hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.claimId).call();
              dat = await database.collection("students").doc(this.user).collection("acads").doc(hsh).get();
              obj = dat.data();
              if (obj == undefined) {
                  this.success=false;
              }
          }
          this.arr = [];
          try {
            //   await Object.keys(obj).forEach(field => {
            //       return this.arr.push(field.toString() + ": " + obj[field]);
            //   });
            //   await this.arr.sort();
            for(var key in obj) {
                console.log("Value = ", obj[key]);
                console.log("Key", key);
                var content = key.concat(" : ", obj[key])
                this.arr.push(content);
            }

          } catch(err) {
              this.success = false;
              console.log(err);
          }
      },
  },
  data() {
      return {
          // all these data will serve as arguments to our contract calls
          claimId: '',
          success: false,
          status: '',
          exp: false,
          arr: [],
          user: '',
          claimScore: '',
          candidateScore: '',
      }
  },
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
.contentInsView {
    padding: 0px 20px 20px 20px;
}

</style>




