<template>
    <nav id="navbar" class="navbar-expand-md navbar-dark" :class="isSigned?'':''">
                <router-link to = "/" class = "logo"> 
                    <img class="navbar-brand" width="150" src="../assets/wlogo.svg" alt="" srcset="">
                </router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

        <div class="collapse navbar-collapse " id="navbarText">
            <ul class="navbar-nav ms-auto">
                <li class = "nav-item active" v-if="!isSigned">
                    <button style="float:right" class = "nav-login btn btn-primary"> 
                        <font-awesome-icon icon="sign-in-alt"/> Login
                    </button>
                </li>
                <li class = "nav-item active" v-if="isSigned">
                    <router-link to = "/profile" class = "profile nav-link"> 
                        Profile
                    </router-link>
                </li>
                <li class="nav-item" v-if="isSigned">
                    <router-link to = "/department" class = "department nav-link"> 
                        Department
                    </router-link>
                </li>
                <li class="nav-item" v-if="isSigned">
                    <a href="#" class = "btn btn-outline-warning text-warning logout nav-link" @click="logout" style="margin-left:40px;"> <font-awesome-icon icon="sign-out-alt"/> Logout </a>
                </li>
            </ul>
        </div>
    </nav>
</template>
<style scoped>
    nav{
        display:flex;
        align-items: center;
    }
    .nav-login{
        padding:0.7em 1.55em;
    }
    .nav-item{
        padding:0.8em;
    }
    .nav-item > a{
        font-size:1.23rem !important;
    }
    .navbar-toggler{
        float:right;
    }
    .nav .nav-item{
        text-align: left !important;
    }
    .nav .nav-login{
        display:none;
    }
    .logout:hover{
        color:black!important;
    }
</style>
<script>
import Home from "../views/Home.vue"
import {Accounts} from "../../server"
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    name: 'Navabr',
    components:Home,
    data(){
        return{
            
        }
    },
    methods:{
        ...mapActions(['assignUserData','assignSigned']),
        logout(){
            this.assignUserData({});
            this.assignSigned(0);
            sessionStorage.removeItem(this.item);
            this.$gapi.logout();
            let router = this.$router;
            setTimeout(()=>router.push('/'),1000)
            document.body.classList.remove("not-signed");
        }
    },
    computed: mapGetters(['isSigned','getUserData']),
    async mounted(){
        let item = await Accounts.crypt("datahashing"); 
        this.item = item; 
        let signed = this.isSigned;
        if(signed == 1){
            //document.querySelector('#navbar').classList.add("bg-dark");
        }else{
            //document.querySelector('#navbar').classList.remove("bg-dark");
        }
        function nav(e){
            if(e.innerWidth <= 768){
                let e = document.querySelector('nav');
                e.classList.add('nav');
                e.classList.add('navbar');
                e.classList.remove('container');
                e.classList.add('fixed-top');
                if(!document.body.classList.has('not-signed')){
                    e.classList.add('bg-dark');
                }
            }else{
            let e = document.querySelector('nav');
                e.classList.remove('nav');
                e.classList.remove('navbar');
                e.classList.add('container');
                e.classList.remove('fixed-top');
                e.classList.remove('bg-dark');
            }
        }
        nav(window);
    }
}
</script>
<style scoped>
img{
    float:left;
}
</style>