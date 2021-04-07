<template>
<div>
    <hdrCan></hdrCan>
    <br>
    <p> <b> Approve </b> </p>

    <form>

    <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
    label=" Institution: " label-align-sm="left">
        <b-form-input   type="text" v-model="ins" placeholder="Institution Address"></b-form-input>
    </b-form-group>

    <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
    label="Claim ID: " label-align-sm="left">
        <b-form-input type="number" v-model="claimId" placeholder="ClaimID"></b-form-input>
    </b-form-group>
        
    <br>
    <button class="btn btn-secondary" v-on:click.prevent="approve"> Approve </button>
   
    </form>
    <hr>
    <div v-if="this.success">
    <p> Approval <b> <u> success. </u> </b> </p>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
//import database from '../firebase.js' //to log our data

export default {
  name: "app",
  computed: {
      ...mapGetters("accounts",["activeAccount","activeBalance"]),
      ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
  },
  methods: {
      async approve() {
          this.success = false;
          await this.drizzleInstance
            .contracts
            .Credential
            .methods
            .givePermission(this.ins, this.claimId)
            .send().then(() => {
                this.success = true;
            }).catch((err) => {
                this.success = false;
                console.log(err);
            });
      },

  },
  data() {
      return {
          // all these data will serve as arguments to our contract calls
          ins: '',
          claimId:'',
          success: false,
      }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>



