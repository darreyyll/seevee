import Vue from 'vue'
import App from './App.vue'
//import router from './router'
import store from './store'
import drizzleVuePlugin from "@drizzle/vue-plugin"
import drizzleOptions from "./drizzleOptions"
import VueRouter from 'vue-router'
import Routes from './routes.js'

import LogIn from './components/Login.vue'
import Candidate from './components/Candidate.vue'
import CandidateClaim from './components/CandidateClaim.vue'
import CandidateApprove from './components/CandidateApprove.vue'
import CandidateView from './components/CandidateView.vue'
import Institution from './components/Institution.vue'
import InstitutionMint from './components/InstitutionMint.vue'
import InstitutionRequest from './components/InstitutionRequest.vue'
import InstitutionView from './components/InstitutionView.vue'
import HeaderCandidate from './components/HeaderCandidate.vue'
import HeaderInstitution from './components/HeaderInstitution.vue'
import firebase from 'firebase'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false
Vue.use(drizzleVuePlugin, { store, drizzleOptions })

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const myRouter = new VueRouter({ 
  routes: Routes,
  mode: 'history'
});

//NavGuards
myRouter.beforeEach((to, from, next) => {
  //Check if authentication required to move forward
  if(to.matched.some(record => record.meta.requiresAuth)) {
    //Check if user is not logged in
    if(!firebase.auth().currentUser) {
      
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else { //Means we are logged in
      next();
    }
  } else {
    next();
  }
});

Vue.component('login', LogIn)
Vue.component('candidate', Candidate)
Vue.component('cadidateclaim', CandidateClaim)
Vue.component('cadidateapprove', CandidateApprove)
Vue.component('candidateview', CandidateView)
Vue.component('institution', Institution)
Vue.component('institutionmint', InstitutionMint)
Vue.component('institutionrequest', InstitutionRequest)
Vue.component('institutionview', InstitutionView)
Vue.component('hdrCan',HeaderCandidate)
Vue.component('hdrIns',HeaderInstitution)



new Vue({
  router: myRouter,
  store,
  render: h => h(App)
}).$mount('#app')
