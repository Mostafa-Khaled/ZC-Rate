import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Course from '../views/Course.vue'
import Section from '../views/Section.vue'
import NotFound from '../views/NotFound.vue'
import Profile from '../views/Profile.vue'
import Survey from '../views/Survey.vue'
import Department from '../views/Department.vue'
import Admin from '../views/Admin.vue'
import store from '@/store'
import { Accounts } from '../../server'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {title: 'Home'}
  },
  {
    path: '/courses',
    name: 'Course',
    component:Course,
    meta: {title: 'Courses'}
  },
  {
    path: '/sections',
    name: 'Section',
    component: Section,
    props:true,
    meta: {title: 'Section'}
  },
  {
    path : "/profile",
    name : "Profile",
    component : Profile,
    meta: {title: 'Profile'}
  },
  {
    path : "/survey",
    name : "Survey",
    component: Survey,
    meta: {title: 'Survey'}
  },
  {
    path : "/department",
    name : "Department",
    component : Department,
    meta: {title: 'Department'}
  },
  {
    path : "/admin",
    name : "Admin",
    component : Admin,
    meta: {title : 'Control-Page'}
  },
  {
    path : "/:catchAll(.*)*",
    name : "NotFound",
    component : NotFound,
    props:true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  let item = await Accounts.crypt("datahashing");
  let pass = "thedatahasdfasdnflasndlkfasld1sf";
  let user = await Accounts.crypt(sessionStorage.getItem(item),"decrypt",pass);
  let gapi = JSON.parse(localStorage.getItem("gapi.session"));
  store.dispatch('assignSigned',user.isLogged);
  // user.google_id in the session ( cookies )
  if ( to.path !== '/' && ( !gapi || gapi.id != user.google_id) ) next({name: 'Home'})
  else next()
})
router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
    document.title = to.meta.title || 'ZC-Rate';
});

export default router
