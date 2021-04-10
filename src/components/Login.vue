<template>
  <div v-if="isDrizzleInitialized">
    <!--h1 style="color: green"> LOADED SUCCESSFULLY </h1-->
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">SeeVee</b-navbar-brand>
    </b-navbar>
  <br />
    <br />


      <b-form>
       <b-form-group label-cols-sm="2"
        label-cols-lg="2" content-cols-sm content-cols-lg="4"
        label="User Account: " label-align-sm="right" >
        <b-form-input type="text" v-model="this.activeAccount" disabled
        ></b-form-input>
      </b-form-group>

       <b-form-group
        label-cols-sm="2"
        label-cols-lg="2"
        content-cols-sm
        content-cols-lg="4"
        label="Password: "
        label-align-sm="right"
      >
        <b-form-input
          type="password"
          v-model="pw"
          placeholder="Password"
        ></b-form-input>
      </b-form-group>
      
        <div class="row">
          <div class="col-2" />
          <div class="col-lg-6 col-md-12 col-12 ml-12">
            <div class="row">
              <div class="col-4 col-lg-3 col-md-6">
                <button
                  v-on:click.prevent="login($event)"
                  class="btn btn-secondary btn-block"
                >
                  Login
                </button>
              </div>
              <div class="col-4 col-lg-3 col-md-6">
                <button @click="register" class="btn btn-info btn-block">
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </b-form>


    <!--div> Dummies to test </div>
        <button @click="loginCan"> LogIn Candidate </button>
        <button @click="loginIns"> LogIn Institution </button>
        <button @click="test"> Test </button-->
  </div>
  <div v-else>
    <h1 style="color: red">LOADING.....</h1>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import database from "../firebase.js"; //to log our data

export default {
  computed: {
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
    ...mapGetters("drizzle", ["drizzleInstance", "isDrizzleInitialized"]),
  },
  data: function () {
    return {
      usrAddress: "",
      pw: "",
      ins: "",
    };
  },
  methods: {
    async login() {
      this.usrAddress = this.activeAccount.toString() + "@seevee.com"; //format to email
      event.preventDefault();
      var dat = await database
        .collection("accounts")
        .doc(this.activeAccount)
        .get();
      this.ins = dat.data().institution;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.usrAddress, this.pw)
        .then(
          () => {
            if (this.ins) {
              this.$router.push("/institution");
            } else {
              this.$router.push("/candidate");
            }
            /*
                if (this.add.institutions.includes(this.usrAddress)) {
                    this.$router.push('/institution');
                } else {
                    this.$router.push('/candidate');
                }
                */
          },
          (err) => {
            console.log(err.message);
          }
        );
    },
    register() {
      this.$router.push("/register");
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
};
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
