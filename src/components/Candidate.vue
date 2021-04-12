<template>
<div>
    <hdrCan></hdrCan>
    <div class="contentCan">
        <form>
        <p style="font-size: 20px;"> <b> Welcome to SeeVee! </b> </p>
        <p> <u> Claim </u> </p>
        <p> Enter this tab to submit claims to credentials. You will require the institution address and claim details to submit a claim. Retain your claim id for later retrieval. </p>
        <p> <u> View </u> </p>
        <p> Enter this tab to view your claims to credentials. You can view your claim details as well as verification status. </p>
        <p> <u> Approve </u> </p>
        <p> Enter this tab to approve your credentials for other institutions to view. You will require the institution address and claim ID to submit an approval. </p>
        <p> <u> Job </u> </p>
        <p> Apply for jobs by sharing your credentials. </p>
        </form>
    </div>
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

.contentCan {
    padding: 0px 20px 20px 20px;
}

</style>


