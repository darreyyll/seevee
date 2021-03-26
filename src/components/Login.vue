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
        <input type="text" v-model="pw" placeholder="Password"/>
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
            add: {
                //hard coded address based ganache's deterministic seed
                candidates: ["0x78c580F07B6C68A0D4f07523ea113C31bE2b0fFA@seevee.com", 
                    "0xe6E3A35Fbc289953c462d989D67852d45a52C5EB@seevee.com", 
                    "0x42f5B341CBE81E6Ce41a63B43F3eea1EF5406FA7@seevee.com", 
                    "0xB028a762B55a97b0223DD4277417b264DCa5114A@seevee.com", 
                    "0x2f643281F10987f4e749B96499898De93B43670d@seevee.com"],
                institutions: ["0x4655250A142F0e544E132f0B248855B62E8Be113@seevee.com",
                    "0xBE01D4DA864f377FbbC29089348AA27b78531C10@seevee.com", 
                    "0xDa6bB00793a9AaD0D622c59F2f451ACb1b7321F3@seevee.com", 
                    "0xFFa9BdE5bBA7bAaeD6c7D43e91E2c4248B0Fa45d@seevee.com", 
                    "0xdB167B5E1a202f69Ce0bd1840a62F506ba07808d@seevee.com"],
            },
        }
    },
    methods: {
        login() {
            this.usrAddress = this.activeAccount.toString() + "@seevee.com"; //format to email
            event.preventDefault();
            firebase.auth().signInWithEmailAndPassword(this.usrAddress, this.pw)
            .then(() => {
                if (this.add.institutions.includes(this.usrAddress)) {
                    this.$router.push('/institution');
                } else {
                    this.$router.push('/candidate');
                }
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
        },
        */
    }
}
</script>

<style>

</style>
