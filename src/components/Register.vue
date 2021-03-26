<template>
<div>
    <form>
        <label> User Account: {{activeAccount}}</label> <br>
        <input type="text" v-model="pw" placeholder="Password"/>
        <button v-on:click.prevent="register($event)"> Register </button>
    </form>
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
        }
    }
}
</script>

<style>

</style>
