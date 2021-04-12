<template>
  <div class="apply">
      <hdrCan></hdrCan>
      <div class="contentCanJob">
          <p style="font-size: 20px;"> <b> Jobs </b> </p>
          <ul>
              <div>
                  <li v-for="job in jobs" :key="job" class="joblisting"><b> {{ job.jobid}}. {{job.role }}</b><br> 
                  {{ job.jobdesc }} 
                  <button style="float: right; margin: 10px;" v-on:click="applyjob(job.jobid, job.instadd)"> Apply </button><br>
                  </li>
              </div>
          </ul>
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
    beforeMount() {
        database.collection("jobs").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                    console.log("Job : ", doc.data()["jobid"]);
                    this.jobs.push(doc.data());
                    
            });
        })

         var dbinst = database.collection("students").doc(this.activeAccount).collection("claimlog");
        dbinst.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log("CLAIM", doc.data()["claimID"]);
                this.claimsarr.push(doc.data()["claimID"]);
            });
        }).catch((err) => {
            console.log(err);
        });
    },
    data : function() {
        return {
            jobs : [],
            claimsarr: [],
        }
    },

    // NEEDS TO BE FIXED TO GET PERMISSION FROM USER!
    methods : {
        async applyjob(jobid, instadd) {
            console.log(jobid, instadd);
            await database.collection("jobapps").doc(jobid).collection("applications").add({
                "applicantAddress" : this.activeAccount,
                "claims" : this.claimsarr
            }).then(async () => {

                for(var i =0; i < this.claimsarr.length; i++) {
                    var claimid = this.claimsarr[i]

                    await this.drizzleInstance
                            .contracts
                            .Credential
                            .methods
                            .givePermission(instadd, claimid)
                            .send()
                            .then(() => {
                                console.log("Successfully granted permission!");
                                //console.log(instadd);
                                //console.log(claimid);
                            });
                    
                }
            })

            
            
        },

    }
}
</script>

<style>
.joblisting {
    border-style: solid;
    padding: 5px 5px 5px 10px;
    margin-bottom:5px;
}
.contentCanJob {
    padding: 0px 20px 20px 20px;
}
.joblisting:after {
    content: "";
    display: table;
    clear: both;
}
</style>
