<template>
<div>
    <form>
        <label> User Account: {{activeAccount}}</label> <br>
        <input type="text" v-model="pw" placeholder="Password"/><br><br>
        <label> User Type: </label> <br>
        <input type="radio" name="type" v-model="ins" v-bind:value="true">
        <label for="ins"> Institution User </label><br>
        <input type="radio" name="type" v-model="ins" v-bind:value="false">
        <label for="can"> Candidate </label>
        <br><br>
        <button v-on:click.prevent="register($event)"> Register </button>
    </form>
    <!--br><hr><br>
    <button @click="test"> Test </button-->
    <br><hr><br>
    <button v-on:click.prevent="back"> Back </button>

</div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters("accounts",["activeAccount","activeBalance"]),
    },
    data: function() {
        return {
            usrAddress: '',
            pw: '',
            ins: false, 
        }
    },
    methods: {
        register(event) {
            this.usrAddress = this.activeAccount.toString() + "@seevee.com"; //format to email
            event.preventDefault();
            firebase.auth().createUserWithEmailAndPassword(this.usrAddress, this.pw)
            .then(() => {
                this.$router.push('/');
            },
            err => {
                console.log(err.message);
            });
        },
        back() {
            this.$router.push('/');
        },
        /*
        test() {
            console.log(this.ins);
        },*/
    }
}
</script>

<style>

</style>
