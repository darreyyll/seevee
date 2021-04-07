<template>
<div>
    <hdrCan></hdrCan>
    <br>
  
    <form >
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

.scorecard {
        border-style: solid;
        border-width: 1px;
        padding: 10px;
        border-radius: 16px;
        border-color: grey
}
</style>



