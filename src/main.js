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
import CandidateApprove from './components/CandidateApprove.vue'
import CandidateView from './components/CandidateView.vue'
import Institution from './components/Institution.vue'
import InstitutionMint from './components/InstitutionMint.vue'
import InstitutionRequest from './components/InstitutionRequest.vue'
import InstitutionView from './components/InstitutionView.vue'
import HeaderCandidate from './components/HeaderCandidate.vue'
import HeaderInstitution from './components/HeaderInstitution.vue'


Vue.config.productionTip = false
Vue.use(drizzleVuePlugin, { store, drizzleOptions })

Vue.use(VueRouter)

const myRouter = new VueRouter({ 
  routes: Routes,
  mode: 'history'
});

Vue.component('login', LogIn)
Vue.component('candidate', Candidate)
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
