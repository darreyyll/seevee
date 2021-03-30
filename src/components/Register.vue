<template>
<div>
    <div class="logo"> SeeVee </div> <hr>
    <br>
    <form>
        <label> User Account: </label>
        <input type="text" v-model="this.activeAccount"/> <br>
        <label> Password: </label>
        <input type="text" v-model="pw" placeholder="Password"/><br>
        <label for="can"> Candidate </label>
        <input type="radio" name="type" v-model="ins" v-bind:value="false"> <br>
        <label for="ins"> Institution User </label>
        <input type="radio" name="type" v-model="ins" v-bind:value="true"> <br> 
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
import database from '../firebase.js'

export default {
    computed: {
        ...mapGetters("accounts",["activeAccount","activeBalance"]),
        ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
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
            .then(async () => {
                await database.collection("accounts").doc(this.activeAccount).set({
                    institution: this.ins,
                });
                if (this.ins) {
                    await this.drizzleInstance
                        .contracts
                        .Credential
                        .methods
                        .listInstitution(this.activeAccount)
                        .send();
                } else {
                    await this.drizzleInstance
                        .contracts
                        .Credential
                        .methods
                        .listCandidate(this.activeAccount)
                        .send();
                }
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
label {
    display: inline-block;
    /*width: 140px;*/
    /*text-align: right;*/
}
</style>
