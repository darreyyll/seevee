<template>
<div>
    <hdrIns></hdrIns>
    <br><hr>
    <p> <b> View Credential </b> </p>
    <form>
        <label> Credential ID: </label>
        <input type="number" v-model="claimId" placeholder="Credential ID"/> <br>
        <label> Candidate: </label>
        <input type="text" v-model="user" placeholder="Candidate Address"/> <br>
        <label for="can"> Academic </label>
        <input type="radio" name="type" v-model="exp" v-bind:value="false"> <br>
        <label for="ins"> Experience </label>
        <input type="radio" name="type" v-model="exp" v-bind:value="true"> <br> 
        <br>
        <button v-on:click.prevent="retrieveClaim"> Retrieve Claim </button>
    </form>
    <hr>
    <div v-if="this.success">
        <!-- Can add score here if status is valid -->
        <p> Credential status is <b><u> {{this.status}}.</u></b> </p>
        <div class="scorecard">
            <p> <b> <i> Details: </i> </b> </p>
            <p v-for="field in arr" v-bind:key="field"> {{field}} </p>
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
          var dat;
          var hsh;
          var obj;
          if (this.success && this.exp) { //implies document exist to query our db
              hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.claimId).call();
              dat = await database.collection("students").doc(this.user).collection("exp").doc(hsh).get();
              obj = dat.data();
              
          } else if (this.success && !this.exp) {
              hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.claimId).call();
              dat = await database.collection("students").doc(this.user).collection("acads").doc(hsh).get();
              obj = dat.data();
              obj = obj["claim_contents"]
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
</style>




