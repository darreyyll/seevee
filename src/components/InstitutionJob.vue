<template>
<div class="jobs">
      <hdrIns></hdrIns>
  <div class="contentInsJob">
      <p style="font-size: 20px;"> <b> Job: </b> </p>
      <div class="postjob">
        <form>
             <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
               label="Role: " label-align-sm="left">
                    <b-form-input type="text" v-model="role" placeholder="Role"></b-form-input>
             </b-form-group> 
             <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
               label="Job ID: " label-align-sm="left">
                    <b-form-input type="number" v-model="jobid" placeholder="Job ID"></b-form-input>
             </b-form-group> 
             <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
               label="Job Description: " label-align-sm="left">
                    <b-form-input type="text" v-model="jobdesc" placeholder="Job Description"></b-form-input>
             </b-form-group> 
            <button class="btn btn-secondary" v-on:click.prevent="submitJob"> Post Job </button>
        </form>
          <!--form>
                <label for="role">Role :</label><br>
                <input type="role" id="role" name="role" v-model="role"><br>
                <label for="jobid">Job ID :</label><br>
                <input type="jobid" id="jobid" name="jobid" v-model="jobid"><br>
                <label for="jobdesc">Job Description:</label><br>
                <input type="jobdesc" id="jobdesc" name="jobdesc" v-model="jobdesc"><br>
                <input type="submit" v-on:click="submitJob"><br>
          </form-->
      </div>
      <br><hr><br>

      <div class="viewapps">
        <form>
             <b-form-group label-cols-sm="1" label-cols-lg="1" content-cols-sm  content-cols-lg="4"
               label="Job ID: " label-align-sm="left">
                    <b-form-input type="number" v-model="queryjobid" placeholder="Job ID"></b-form-input>
             </b-form-group> 
            <button class="btn btn-secondary" v-on:click.prevent="queryJob"> Get Applicants </button>
        </form>
          <!--form>
                <label for="queryjobid">Query for Job ID :</label><br>
                <input type="queryjobid" id="queryjobid" name="queryjobid" v-model="queryjobid">
                <input type="submit" v-on:click="queryJob">
          </form-->
            <div v-show="queried">
                <ul>
                    <li v-for="app in applicants" :key="app"> <b> {{app.applicantAddress}} : </b> <br>
                    Credential IDs: {{app.claims}} are available for review </li>
                </ul>
            </div>
      </div>
  </div>
</div>
</template>

<script>
import database from '../firebase.js' //to log our data
import { mapGetters } from 'vuex'
export default {
      computed: {
      ...mapGetters("accounts",["activeAccount","activeBalance"]),
      ...mapGetters("drizzle",["drizzleInstance","isDrizzleInitialized"]),
  },
    data: function () {
        return {
        role : "",
        jobid : "",
        jobdesc : "",
        queryjobid : "",
        applicants : [],
        queried : false
        };
    },
    
    methods : {
        submitJob(event) {
            event.preventDefault()
            console.log(this.activeAccount)
            //set blank for the application dcument to exist
            database.collection("jobapps").doc(this.jobid).set({});
            database.collection("jobs").doc(this.jobid).set({
                "role" : this.role,
                "jobid" : this.jobid,
                "jobdesc" : this.jobdesc,
                "instadd" : this.activeAccount

            }).then(() => {
                console.log("Added Job Listing")
            });
        },
        queryJob(event) {
            event.preventDefault();
            this.applicants = [];
            this.queried = true;
            database.collection("jobapps").doc(this.queryjobid).collection("applications").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("Applicant : ", doc.data()["applicantAddress"]);
                    this.applicants.push(doc.data());
                });
            }).catch((err) => {
                console.log(err);
            });
            //console.log(this.applicants[1]);
        }
    }
}
</script>

<style>
.postjob {
    margin: auto;
}
.contentInsJob {
    padding: 0px 20px 20px 20px;
}
</style>
