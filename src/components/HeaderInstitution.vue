<template>
<div>
      <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">SeeVee</b-navbar-brand>
         <b-navbar-nav>
        <router-link class="r" to="/institution" exact> Institution </router-link>
        <router-link class="r" to="/institution/mint" exact> Verify </router-link>
        <!-- Remove since we are not doing institution requesting access alr-->
        <!--router-link class="r" to="/institution/request" exact> Request </router-link-->
        <router-link class="r" to="/institution/view" exact> View </router-link>
        <router-link class="r" to="/institution/job" exact> Jobs </router-link>
         </b-navbar-nav>
         <b-navbar-nav class="ml-auto">
          <b-nav-item v-on:click="logOut">
          LogOut
       </b-nav-item>
      </b-navbar-nav>
      </b-navbar>
 

    <br>
</div>
</template>

<script>
import firebase from 'firebase'
export default {
    data: function() {
        return {
            test1: '',
            test2: '',
        }
    },
    methods: {
        logOut() {
            firebase.auth().signOut().then(() => {
                this.$router.push('/');
            }).catch(err => {
                console.log(err.message);
            });
         },
    }
}
</script>

<style>
.logo {
    font-family: Helvetica, sans-serif;
    color: black;
    font-size: 30px;
}

.logo:after {
    content: "";
    display: table;
    clear: both;
}

.loButton {
    float: right;
    background-color: white;
    color: black;
    border: 2px solid black;
}

.nav {
    float: right;
}

.nav:after {
    content: "";
    display: table;
    clear: both;
}

.r {
    padding: 0px 5px 0px 5px;
    text-decoration: none;
    font-family: Helvetica, sans-serif;
    color: black;
}

.r:hover, r:active {
    text-decoration: underline;
    color: darkblue;
}
</style>
