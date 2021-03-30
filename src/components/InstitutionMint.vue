<template>
<div>
    <hdrIns></hdrIns>
    <br><hr>
    <p> <b> Verify Credential </b> </p>
    <button class="switch" v-on:click="showAcad"> Academic </button>
    <button class="switch" v-on:click="showExp"> Experience </button>
    <div v-if="this.switch.acad">
    <br>
    <form>
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
    </form>
    <br>
    </div>
    <div v-if="this.switch.exp">
    <br>
    <form>
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
    </form>
    <br>
    </div>
    <br><hr>
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
          var hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.acad.id).call();
          var score = 100; //INSERT SOCRING ALGO HERE
          var status = 1; //INSERT STATUS FROM SCORE ABOVE
          //Update database accoridng to institution's entry
          await database.collection("students").doc(this.acad.user).collection("acads").doc(hsh).update({
              moduleCode: this.acad.modCode,
              gradeAttained: this.acad.grade,
          });
          await this.drizzleInstance.contracts.Credential.methods.do_score(this.acad.id, score, status).send();
      },
      async verifyExp() {
          var hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.exp.id).call();
          var score = 100; //INSERT SOCRING ALGO HERE
          var status = 1; //INSERT STATUS FROM SCORE ABOVE
          //Update database accoridng to institution's entry
          await database.collection("students").doc(this.exp.user).collection("exp").doc(hsh).update({
              startDate: this.exp.startDate,
              endDate: this.exp.endDate,
              performanceRating: this.exp.performanceRating,
              comments: this.exp.comments,
          });
          await this.drizzleInstance.contracts.Credential.methods.do_score(this.exp.id, score, status).send();
      },
      async revokeCred() {
          await this.drizzleInstance.contracts.Credential.methods.revoke(this.revoke.id).send();
      },
  },
  data() {
      return {
          // all these data will serve as arguments to our contract calls
          switch: {
              acad: true,
              exp: false,
          },
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
