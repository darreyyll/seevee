<template>
<div class="jobs">
      <hdrIns></hdrIns>
  <div class="postjob">
      <form>
            <label for="role">Role :</label><br>
            <input type="role" id="role" name="role" v-model="role"><br>
            <label for="jobid">Job ID :</label><br>
            <input type="jobid" id="jobid" name="jobid" v-model="jobid"><br>
            <label for="jobdesc">Job Description:</label><br>
            <input type="jobdesc" id="jobdesc" name="jobdesc" v-model="jobdesc"><br>
            <input type="submit" v-on:click="submitJob"><br>
      </form>
  </div>

  <div class="viewapps">
      <form>
            <label for="queryjobid">Query for Job ID :</label><br>
            <input type="queryjobid" id="queryjobid" name="queryjobid" v-model="queryjobid">
            <input type="submit" v-on:click="queryJob">
      </form>
        <div v-show="queried">
            <ul>
                <li v-for="app in applicants" :key="app"> <b> {{app.applicantAddress}} : </b> <br>
                Credential IDs: {{app.claimsarr}} are available for review </li>
            </ul>
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
            this.queried = true;
            database.collection("jobapps").doc(this.jobid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("Applicant : ", doc.data()["applicantAddress"]);
                    this.applicants.push(doc.data());
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style>
.postjob {
    margin: auto;
}
</style>