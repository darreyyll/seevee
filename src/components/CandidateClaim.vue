<template>
<div>
    <hdrCan></hdrCan>
    <br>
    <p> <b> Claim </b> </p>

      <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
       label="Claim Type: " label-align-sm="left">
         <button class="switch btn btn-info" v-on:click="showAcad"> Academic </button>
         <button class="switch btn btn-success" v-on:click="showExp"> Experience </button>
       </b-form-group>
  
    <div v-if="this.switch.acad">
    <form>
          <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
           label="Institution:" label-align-sm="left">
              <b-form-input  type="text" v-model="acad.inst" placeholder="Institution Address"></b-form-input>
          </b-form-group>

            <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
            label="Module Code:  " label-align-sm="left">
                <b-form-input  type="text" class="mt-3" v-model="acad.modCode" placeholder="Module Code"></b-form-input>
            </b-form-group>
      
            <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
            label="Grade: " label-align-sm="left">
                <b-form-input   type="text" v-model="acad.grade" placeholder="Attained Grade"></b-form-input>
            </b-form-group>

        <br>
        <button class="btn btn-secondary" v-on:click.prevent="claimAcad"> Submit Academic Claim </button>
    </form>
    <br>
    </div>
    <div v-if="this.switch.exp">

    <form>
   <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
       label=" Institution: " label-align-sm="left">
         <b-form-input   type="text" v-model="exp.inst" placeholder="Institution Address"></b-form-input>
   </b-form-group>

      <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
       label="Start Date: " label-align-sm="left">
        <b-form-input type="text" v-model="exp.startDate" placeholder="Start Dates"></b-form-input>
      </b-form-group>

        <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
       label="End Date: " label-align-sm="left">
         <b-form-input  type="text" v-model="exp.endDate" placeholder="End Date"></b-form-input>
        </b-form-group>
        <!-- COMPANY WILL KEY IN THIS INFO???... DOESNT RLLY MAKE SENSE FOR CANDIDATE TO KEY THIS IN....-->
        <!--label> Performance: </label>
        <input type="text" v-model="this.acad.grade" placeholder="Attained Grade"/> <br>
        <label> Comments: </label>
        <input type="text" v-model="this.acad.grade" placeholder="Attained Grade"/> <br-->
        <br>
        <button class="btn btn-secondary" v-on:click.prevent="claimExp"> Submit Experience Claim </button>
    </form>
    <br>
    </div>
    <hr>
    <div v-if="this.res.success">
    <p> Credential claim submitted successfully. <b> Your claim id is: <u> {{this.res.id}} </u> </b> </p>
    </div>
    <!--br><hr><br>
    <button v-on:click.prevent="checkHash"> Check Doc </button-->
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
      async claimAcad() {
          await database.collection("students").doc(this.activeAccount).get().then(doc => {
               if (!doc.exists) {
                   database.collection("students").doc(this.activeAccount).set({});
                   database.collection("students").doc(this.activeAccount).collection("acads").add({
                       candidateAddress: this.activeAccount,
                       institutionAddress: this.acad.inst,
                       moduleCode: this.acad.modCode,
                       gradeAttained: this.acad.grade,
                   }).then(async (docRef) => {
                       this.res.docRef = docRef.id;
                       await this.drizzleInstance
                            .contracts
                            .Credential
                            .methods
                            .createClaim(this.acad.inst, this.res.docRef)
                            .send().then(async () => {
                                this.res.success = true;
                                this.res.id = await this.drizzleInstance.contracts.Credential.methods.getClaimId().call();
                            }).catch(async (err) => {
                                this.res.success = false;
                                this.res.id = 0;
                                console.log(err);
                            });
                   });
               } else {
                   database.collection("students").doc(this.activeAccount).collection("acads").add({
                       candidateAddress: this.activeAccount,
                       institutionAddress: this.acad.inst,
                       moduleCode: this.acad.modCode,
                       gradeAttained: this.acad.grade,
                   }).then(async (docRef) => {
                       this.res.docRef = docRef.id;
                       await this.drizzleInstance
                            .contracts
                            .Credential
                            .methods
                            .createClaim(this.acad.inst, this.res.docRef)
                            .send().then(async () => {
                                this.res.success = true;
                                this.res.id = await this.drizzleInstance.contracts.Credential.methods.getClaimId().call();
                            }).catch(async (err) => {
                                this.res.success = false;
                                this.res.id = 0;
                                console.log(err);
                            });
                   });
               }
           });
      },
      async claimExp() {
          await database.collection("students").doc(this.activeAccount).get().then(doc => {
               if (!doc.exists) {
                   database.collection("students").doc(this.activeAccount).set({});
                   database.collection("students").doc(this.activeAccount).collection("exp").add({
                       candidateAddress: this.activeAccount,
                       institutionAddress: this.exp.inst,
                       startDate: this.exp.startDate,
                       endDate: this.exp.endDate,
                       performanceRating: this.exp.performanceRating,
                       comments: this.exp.comments,
                   }).then(async (docRef) => {
                       this.res.docRef = docRef.id;
                       await this.drizzleInstance
                            .contracts
                            .Credential
                            .methods
                            .createClaim(this.exp.inst, this.res.docRef)
                            .send().then(async () => {
                                this.res.success = true;
                                this.res.id = await this.drizzleInstance.contracts.Credential.methods.getClaimId().call();
                            }).catch(async (err) => {
                                this.res.success = false;
                                this.res.id = 0;
                                console.log(err);
                            });
                   });
               } else {
                   database.collection("students").doc(this.activeAccount).collection("exp").add({
                       candidateAddress: this.activeAccount,
                       institutionAddress: this.exp.inst,
                       startDate: this.exp.startDate,
                       endDate: this.exp.endDate,
                       performanceRating: this.exp.performanceRating,
                       comments: this.exp.comments,
                   }).then(async (docRef) => {
                       this.res.docRef = docRef.id;
                       await this.drizzleInstance
                            .contracts
                            .Credential
                            .methods
                            .createClaim(this.exp.inst, this.res.docRef)
                            .send().then(async () => {
                                this.res.success = true;
                                this.res.id = await this.drizzleInstance.contracts.Credential.methods.getClaimId().call();
                            }).catch(async (err) => {
                                this.res.success = false;
                                this.res.id = 0;
                                console.log(err);
                            });
                   });
               }
           });
      },
      /*
      async checkHash() {
          var s = await this.drizzleInstance.contracts.Credential.methods.getStatus(this.res.id).call();
          var hsh = await this.drizzleInstance.contracts.Credential.methods.viewClaim(this.res.id).call();
          console.log(s);
          console.log(hsh);
      },*/
  },
  data() {
      return {
          // all these data will serve as arguments to our contract calls
          switch: {
              acad: true,
              exp: false,
          },
          acad: {
              inst: '',
              addr: '',
              modCode: '',
              grade: '',
          },
          exp: {
              inst: '',
              addr: '',
              startDate: '',
              endDate: '',
              performanceRating: '',
              comments: '',
          },
          res: {
            success: false,
            id: 0,
            docRef: '',
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

.switch {
    background-color: white;
    color: black;
    border: 2px solid black;
    padding: 0px 5px 0px 5px;
    margin: 0px 5px 0px 5px;
    outline: none;
}

label {
    display: inline-block;
    width: 140px;
    text-align: right;
}
</style>




