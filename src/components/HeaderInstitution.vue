<template>
<div>
    <button v-on:click="logOut" style='float: right;'> LogOut </button>

    <br>

    <div>
        <router-link to="/institution" exact> Institution </router-link><br>
        <router-link to="/institution/mint" exact> InstitutionMint </router-link><br>
        <router-link to="/institution/request" exact> InstitutionRequest </router-link><br>
        <router-link to="/institution/view" exact> InstitutionView </router-link><br>
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

</style>
