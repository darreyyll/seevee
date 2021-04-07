<template>
<div>
    <hdrIns></hdrIns>
    <p> <b> Verify Credential </b> </p>

    <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
    label="Claim Type: " label-align-sm="left">
        <button class="switch btn btn-info"  v-on:click="showAcad"> Academic </button>
        <button class="switch btn btn-success" v-on:click="showExp"> Experience </button>
    </b-form-group>

   
    <div v-if="this.switch.acad">
    <br>
    <form>
         <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Claim ID:" label-align-sm="left">
                <b-form-input type="number" v-model="acad.id" placeholder="ClaimID"></b-form-input>
         </b-form-group>

          <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Candidate:" label-align-sm="left">
                <b-form-input type="text" v-model="acad.user" placeholder="Candidate Address"></b-form-input>
          </b-form-group>

          <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Module Code: " label-align-sm="left">
                <b-form-input type="text" class="mt-3" v-model="acad.modCode" placeholder="Module Code"></b-form-input>
          </b-form-group>

          <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label=" Grade: " label-align-sm="left">
                <b-form-input type="text" v-model="acad.grade" placeholder="Attained Grade"></b-form-input>
          </b-form-group>

        <br>
        <button class="btn btn-secondary" v-on:click.prevent="verifyAcad"> Verify Academic Credential </button>
    </form>
    <br>
    </div>
    <div v-if="this.switch.exp">
    <br>
    <form>
        <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Claim ID:" label-align-sm="left">
                <b-form-input type="number" v-model="exp.id" placeholder="ClaimID"></b-form-input>
         </b-form-group>

          <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Candidate: " label-align-sm="left">
                <b-form-input type="text" v-model="exp.user" placeholder="Candidate Address"></b-form-input>
          </b-form-group>

           <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Start Date: " label-align-sm="left">
                <b-form-input type="text" v-model="exp.startDate" placeholder="Start Dates"></b-form-input>
           </b-form-group>

           <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="End Date: " label-align-sm="left">
                <b-form-input  type="text" v-model="exp.endDate" placeholder="End Date"></b-form-input>
           </b-form-group>

           <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Performance: " label-align-sm="left">
                <b-form-input  type="text" v-model="exp.performanceRating" placeholder="Performance Rating"></b-form-input>
           </b-form-group>

           <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Comments: " label-align-sm="left">
                <b-form-input type="text" v-model="exp.comments" placeholder="Comments"></b-form-input>
           </b-form-group>
        <br>
        <button class="btn btn-secondary" v-on:click.prevent="verifyExp"> Verify Experience Credential </button>
    </form>
    <br>
    </div>
    <br><hr>
    <p> <b> Revoke Credential </b> </p>
    <form>
         <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Credential ID: " label-align-sm="left">
                <b-form-input type="number" v-model="revoke.id" placeholder="Credential ID"></b-form-input>
         </b-form-group>
       
        <br>
        <button class="btn btn-danger" v-on:click.prevent="revokeCred"> Revoke Credential </button>
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
