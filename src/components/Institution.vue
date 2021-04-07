<template>
<div>
    <hdrIns></hdrIns>
    <p> <b> Welcome to SeeVee! </b> </p>
    <p> <u> Verify </u> </p>
    <p> Enter this tab to verify credentials. Verification can be an acceptance, rejection or revocation. You will need a claim ID and details to perform verification. </p>
    <p> <u> View </u> </p>
    <p> Enter this tab to view credentials approved for your viewing. You can view the credential details here. </p>
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



