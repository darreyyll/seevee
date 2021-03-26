<template>
<div>
    <button v-on:click="logOut" style='float: right;'> LogOut </button>

    <br>

    <div>
        <router-link to="/candidate" exact> Candidate </router-link><br>
        <router-link to="/candidate/approve" exact> CandidateApprove </router-link><br>
        <router-link to="/candidate/view" exact> CandidateView </router-link><br>
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
