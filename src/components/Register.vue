<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">SeeVee</b-navbar-brand>
    </b-navbar>
    <br />
    <br />

    <form>
       <b-row>
        <b-col cols="1"></b-col>
        <b-col cols="5"> 
          <b-alert variant="danger"  :show="showerror">Invalid information!</b-alert>
        </b-col>
      </b-row>
      <b-form-group label-cols-sm="2" label-cols-lg="2" content-cols-sm  content-cols-lg="4"
       label="User Account: " label-align-sm="right">
        <b-form-input type="text" v-model="this.activeAccount" disabled></b-form-input>
      </b-form-group>
      <b-form-group label-cols-sm="2" label-cols-lg="2" content-cols-sm content-cols-lg="4"
      label="Password: " label-align-sm="right">
        <b-form-input type="password" v-model="pw" placeholder="Password"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="2"
        label-cols-lg="2"
        label="Account Type: "
        label-align-sm="right"
      >
      <div class="ml-2 mt-2">
        <input type="radio" name="type" v-model="ins" v-bind:value="false" />
        <label for="can" class="ml-2" style="text-align:left"> Candidate </label>
         <br />
    
        <input type="radio" name="type" v-model="ins" v-bind:value="true" />
        <label for="ins"  class="ml-2" style="text-align:left"> Institution User </label>
        </div>
      </b-form-group>


      <br />

       <div class="row">
          <div class="col-2" />
          <div class="col-lg-6 col-md-12 col-12 ml-12">
            <div class="row">
              <div class="col-4 col-lg-3 col-md-6">
                  <button class="btn btn-info btn-block" v-on:click.prevent="register($event)">Register</button>
              </div>
              <div class="col-4 col-lg-3 col-md-6">
                  <button class="btn btn-danger btn-block" v-on:click.prevent="back">Back</button>
              </div>
            </div>
          </div>
        </div>
    </form>

    <!--br><hr><br>
    <button @click="test"> Test </button-->
    <br />
    <hr />
    <br />
 
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import database from "../firebase.js";

export default {
  computed: {
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
    ...mapGetters("drizzle", ["drizzleInstance", "isDrizzleInitialized"]),
  },
  data: function () {
    return {
      usrAddress: "",
      pw: "",
      ins: false,
      showerror:false,
    };
  },
  methods: {
    register(event) {
      this.showerror =false;
    if( this.pw.trim()!=""){
     this.usrAddress = this.activeAccount.toString() + "@seevee.com"; //format to email
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.usrAddress, this.pw)
        .then(
          async () => {
            await database.collection("accounts").doc(this.activeAccount).set({
              institution: this.ins,
            });
            if (this.ins) {
              await this.drizzleInstance.contracts.Credential.methods
                .listInstitution(this.activeAccount)
                .send();
            } else {
              await this.drizzleInstance.contracts.Credential.methods
                .listCandidate(this.activeAccount)
                .send();
            }
            this.$router.push("/");
          },
          (err) => {
            console.log(err.message);
            this.showerror =true;
          }
        );}
        else{
             this.showerror =true;
        }
    },
    back() {
      this.$router.push("/");
    },
    
    /*
        test() {
            console.log(this.ins);
        },*/
  },
};
</script>

<style>
label {
  display: inline-block;
  /*width: 140px;*/
  /*text-align: right;*/
}
</style>
