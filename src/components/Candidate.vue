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
    <br><hr>
    <p> <b> Welcome to SeeVee! </b> </p>
    <p> <u> Claim </u> </p>
    <p> Enter this tab to submit claims to credentials. You will require the institution address and claim details to submit a claim. Retain your claim id for later retrieval. </p>
    <p> <u> View </u> </p>
    <p> Enter this tab to view your claims to credentials. You can view your claim details as well as verification status. </p>
    <p> <u> Approve </u> </p>
    <p> Enter this tab to approve your credentials for other institutions to view. You will require the institution address and claim details to submit an approval. </p>
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
          name: '',
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


