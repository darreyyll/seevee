<template>
<div>
    <router-view></router-view>
</div>
</template>

<script>
//import { mapGetters } from 'vuex'
//import database from './firebase.js' //to log our data

export default {
  name: "app",
  /*computed: {
      ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
  },*/
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

