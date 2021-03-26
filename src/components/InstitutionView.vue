<!--
// (1) Drizzle template tag to return a contract call
<drizzle-contract
    contractName="Credential"
    method="owner"
    label="Value"
/>
// (2) Drizzle template to call a contract with its arguments
<drizzle-contract-form
    contractName="Credential"
    method="mintAcad"
    :placeholders="['studentAddress','moduleCode','moduleGrade']"
/>
// (3) Drizzle template limitations:
// - dizzle-contract cannot call viewing functions with arguments!?
// - drizzle-contract-form cannot add fields or retireve field values; hidden by drizzle abstraction – cannot log into firebase.
-->
<template>
<div>
    <hdrIns></hdrIns>
    <br><hr><br>
    <h1 style="color: blue"> INSTITUTION'S <u> TOKEN VIEWING PAGE </u> </h1>
    <br><hr><br>
    <h1> MAIN CONTRACT OWNER ACCOUNT </h1>
    <drizzle-contract
        contractName="Credential"
        method="owner"
        label="Value"
    />
    <br><hr><br>
    <h1> CURRENT METAMASK ACCOUNT </h1>
    <!-- this has some big number error in the console-->
    <!--drizzle-account units="Ether" :precision="2"/-->
    <p>{{activeAccount}}</p>
    <p>Balance: {{activeBalance}} Wei</p>
    <br><hr><br>
    <h1> (1) MAIN CONTRACT (TEST) </h1>
    <h1> VIEWING ACAD TOKEN </h1>
    <drizzle-contract
        contractName="Credential"
        method="tokenId"
        label="Number of Acads Minted"
    />
    <form>
    <input type="text" v-model="view.addr" placeholder="Insert student address"/>
    <input type="text" v-model="view.modCode" placeholder="Insert module code"/>
    <button v-on:click.prevent="getGrade"> Get Grade </button>
    </form>
    <p> GRADE: {{this.view.grade}}</p> 
    <br><hr><br>
    <h1> (2) EMBEDDED CONTRACT (TEST) </h1>
    <h1> COUNTING ACAD TOKEN </h1>
    <form>
    <input type="text" v-model="cnt.addr" placeholder="Insert student address"/>
    <button v-on:click.prevent="getCount"> Get Count </button>
    </form>
    <p> NUMBER OF TOKENS: {{this.cnt.num}}</p> 
    <br><hr><br>
    <h1> (3) SECOND DEPLOYED CONTRACT (TEST) </h1>
    <h1> DEPLOYED SECOND CONTRACT </h1>
    <drizzle-contract
        contractName="Dummy"
        method="counter"
        label="Current Count"
    />
    <button v-on:click.prevent="decr"> Decrease </button>
    <button v-on:click.prevent="incr"> Increase </button>
    <br><hr><br>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
//import database from '../firebase.js' //to log our data

export default {
  name: "app",
  computed: {
      ...mapGetters("accounts",["activeAccount","activeBalance"]),
      ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
  },
  methods: {
      async getGrade() {
          // Retrieve value using ".call()'
          this.view.grade = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .viewGrade(this.view.addr, this.view.modCode)
            .call(); 
       },
       async getCount() {
          this.cnt.num = await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .studentAcadCount(this.cnt.addr)
            .call();
       },
       async decr() {
           await this.drizzleInstance
             .contracts
             .Dummy
             .methods
             .decr()
             .send();
       },
       async incr() {
           await this.drizzleInstance
             .contracts
             .Dummy
             .methods
             .incr()
             .send();
       },
  },
  data() {
      return {
          // all these data will serve as arguments to our contract calls
          view: {
            addr: '',
            modCode: '',
            grade: '',
          },
          cnt: {
              addr: '',
              num: ''
          }
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




