<template>
<div>
    <hdrCan></hdrCan>
    <br><hr>
    <p> <b> View Claim </b> </p>
    <form>
        <label> Claim ID: </label>
        <input type="number" v-model="claimId" placeholder="ClaimID"/> <br>
        <label for="ins"> Experience </label>
        <input type="radio" name="type" v-model="exp" v-bind:value="true"> <br> 
        <label for="can"> Academic </label>
        <input type="radio" name="type" v-model="exp" v-bind:value="false"> <br>
        <br>
        <button v-on:click.prevent="retrieveClaim"> Retrieve Claim </button>
    </form>
    <hr>
    <div v-if="this.success">
        <p> Credential status is <b><u> {{this.status}}.</u></b> </p>
        <div class="scorecard">
            <p> <b> <i> Claim Details: </i> </b> </p>
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
      async dummy() {
          console.log(database);

      },
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
              this.status = "false";
          } else if (s=="1") {
              this.status = "true";
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
          }
      },
  },
  data() {
      return {
          claimId: '',
          success: false,
          status: '',
          exp: false,
          arr: [],
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

label {
    display: inline-block;
    width: 140px;
    text-align: right;
}
.scorecard {
        border-style: solid;
        border-width: 1px;
        padding: 10px;
        border-radius: 16px;
        border-color: grey
}
</style>



