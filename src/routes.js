import LogIn from './components/Login.vue'
import Register from './components/Register.vue'
import Candidate from './components/Candidate.vue'
import CandidateApprove from './components/CandidateApprove.vue'
import CandidateView from './components/CandidateView.vue'
import CandidateClaim from './components/CandidateClaim.vue'
import Institution from './components/Institution.vue'
import InstitutionMint from './components/InstitutionMint.vue'
import InstitutionRequest from './components/InstitutionRequest.vue'
import InstitutionView from './components/InstitutionView.vue'

export default[

    { 
        path: '/', 
        component: LogIn
    },
    { 
        path: '/register', 
        component: Register
    },
    { 
        path: '/candidate', 
        component: Candidate,
        meta : {
            requiresAuth: true,
        }
    },
    {
        path: '/candidate/claim', 
        component: CandidateClaim,
        meta : {
            requiresAuth: true
        }
    },
    {
        path: '/candidate/approve', 
        component: CandidateApprove,
        meta : {
            requiresAuth: true
        }
    },
    {
        path: '/candidate/view', 
        component: CandidateView,
        meta : {
            requiresAuth: true
        }
    },
    {
        path: '/institution', 
        component: Institution,
        meta : {
            requiresAuth: true
        }
    },
    {
        path: '/institution/mint', 
        component: InstitutionMint,
        meta : {
            requiresAuth: true
        }
    },
    {
        path: '/institution/request', 
        component: InstitutionRequest,
        meta : {
            requiresAuth: true
        }
    },
    {
        path: '/institution/view', 
        component: InstitutionView,
        meta : {
            requiresAuth: true
        }
    },

]


