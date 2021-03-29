<template>
<div>
    <div v-if="isDrizzleInitialized">
        <!--h1 style="color: green"> LOADED SUCCESSFULLY </h1-->
        <div class="logo"> SeeVee </div><hr>
        <br>
        <form>
            <label> User Account: </label>
            <input type="text" v-model="this.activeAccount"/> <br>
            <label> Password: </label>
            <input type="text" v-model="pw" placeholder="Password"/> <br> <br>
            <!--label> User Type: </label> <br>
            <input type="radio" name="type" v-model="ins" v-bind:value="true">
            <label for="ins"> Institution User </label><br>
            <input type="radio" name="type" v-model="ins" v-bind:value="false">
            <label for="can"> Candidate </label>
            <br><br-->
            <button v-on:click.prevent="login($event)"> Login </button>
        </form>
        <br><hr>
        <p> Don't have an account? Register here! </p>
        <button @click="register"> Register </button> <br>
        <br><hr>
        <!--div> Dummies to test </div>
        <button @click="loginCan"> LogIn Candidate </button>
        <button @click="loginIns"> LogIn Institution </button>
        <button @click="test"> Test </button-->
    </div>
    <div v-else>
        <h1 style="color:red"> LOADING..... </h1>
    </div>

    <br>
</div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex'
import database from '../firebase.js' //to log our data

export default {
    computed: {
        ...mapGetters("accounts",["activeAccount","activeBalance"]),
        ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
    },
    data: function() {
        return {
            usrAddress: '',
            pw: '',
            ins: '',
        }
    },
    methods: {
        async login() {
            this.usrAddress = this.activeAccount.toString() + "@seevee.com"; //format to email
            event.preventDefault();
            var dat = await database.collection("accounts").doc(this.activeAccount).get();
            this.ins = dat.data().institution;
            firebase.auth().signInWithEmailAndPassword(this.usrAddress, this.pw)
            .then(() => {
                if (this.ins) {
                    this.$router.push('/institution');
                } else {
                    this.$router.push('/candidate');
                }
                /*
                if (this.add.institutions.includes(this.usrAddress)) {
                    this.$router.push('/institution');
                } else {
                    this.$router.push('/candidate');
                }
                */
            },
            err => {
                console.log(err.message);
            });
        },
        register() {
            this.$router.push('/register');
        },
        /*
        loginCan() {
            this.$router.push('/candidate');
        },
        loginIns() {
            this.$router.push('/institution');
        },
        test() {
            this.usrAddress = this.activeAccount.toString() + "@seevee.com";
            console.log(this.add.institutions.includes(this.usrAddress));
        },*/
    }, 
}
</script>

<style>
.logo {
    font-family: Helvetica, sans-serif;
    color: black;
    font-size: 30px;
}
label {
    display: inline-block;
    width: 140px;
    text-align: right;
}
</style>
