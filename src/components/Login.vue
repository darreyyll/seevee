<template>
<div>
    <div v-if="isDrizzleInitialized">
        <h1 style="color: green"> LOADED SUCCESSFULLY </h1>
    </div>
    <div v-else>
        <h1 style="color:red"> LOADING..... </h1>
    </div>
    <form>
        <label> User Account: {{activeAccount}}</label> <br>
        <input type="text" v-model="pw" placeholder="Password"/> <br> <br>
        <label> User Type: </label> <br>
        <input type="radio" name="type" v-model="ins" v-bind:value="true">
        <label for="ins"> Institution User </label><br>
        <input type="radio" name="type" v-model="ins" v-bind:value="false">
        <label for="can"> Candidate </label>
        <br><br>
        <button v-on:click.prevent="login($event)"> Login </button>
    </form>
    <button @click="register"> Register </button>
    <br><hr><br>
    <!--div> Dummies to test </div>
    <button @click="loginCan"> LogIn Candidate </button>
    <button @click="loginIns"> LogIn Institution </button>
    <button @click="test"> Test </button-->


    <br>
</div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters("accounts",["activeAccount","activeBalance"]),
        ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
    },
    data: function() {
        return {
            usrAddress: '',
            pw: '',
            ins: false, //need to work this logic - firebase account user type metadata or smth...
        }
    },
    methods: {
        login() {
            this.usrAddress = this.activeAccount.toString() + "@seevee.com"; //format to email
            event.preventDefault();
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
        loginCan() {
            this.$router.push('/candidate');
        },
        loginIns() {
            this.$router.push('/institution');
        },
        test() {
            this.usrAddress = this.activeAccount.toString() + "@seevee.com";
            console.log(this.add.institutions.includes(this.usrAddress));
        },
    }
}
</script>

<style>

</style>
