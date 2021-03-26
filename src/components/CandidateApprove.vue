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
    <hdrCan></hdrCan>
    <br><hr><br>
    <h1 style="color: blue"> CANDIDATE'S <u> APPROVAL PAGE </u> </h1>
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

  },
  data() {
      return {
          // all these data will serve as arguments to our contract calls
          test1: '',
          test2:'',
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



