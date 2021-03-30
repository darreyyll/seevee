<template>
<div>
    <div class="logo"> SeeVee 
    <button v-on:click="logOut" class="loButton"> LogOut </button>
    </div>

    <br>

    <div class="nav">
        <router-link class="r" to="/institution" exact> Institution </router-link>
        <router-link class="r" to="/institution/mint" exact> Verify </router-link>
        <!-- Remove since we are not doing institution requesting access alr-->
        <!--router-link class="r" to="/institution/request" exact> Request </router-link-->
        <router-link class="r" to="/institution/view" exact> View </router-link>
    </div>
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
