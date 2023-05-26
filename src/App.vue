<template>
  <router-view/>
</template>

<style lang="scss">
.vh-75{
  height:75vh !important;
}
body{
  margin : 0;
  height : 100vh;
  background:#1e2225 !important;
  position:relative;
}
body::after{
  content:'';
  position:absolute;
  width:0%;
  height:0%;
  background:#21212198;
  z-index : -1;
  opacity:0.7;
  top : 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.not-signed{
  background: url("./assets/zc.png") !important;
  background-size: cover;
}
.fixed-top{
  padding:1rem;
}
.fixed-top img{
  transform: translateX(3vw);
}
nav.fixed-top + div{
  transform:translateY(15vh);
}
.not-signed::after{
  width:100%;
  height:100%;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<style scoped>
    .Profile,
    .Comments {
        text-align:left;
        font-size: 1.8rem;
        margin-bottom: 20px;
        display: block;
    }

    .card {
        padding: 1rem;
        width:80%;
    }
    .comments-section{
        max-height:70%;
        overflow-y:scroll;
    }
    .text-align-left {
        text-align: left !important;
    }
    .commen{
        display:grid;
        width:100% !important;
        grid-template-columns: repeat(7,1fr);
    }
    .commen *:nth-child(1){
        grid-column:1/span 4;
        text-align: left;
    }
    .commen *:nth-child(2){
        grid-column:5/span 2;
    }
    .commen *:nth-child(3){
        grid-column:7/span 1;
        text-align: right;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    .list-group-item{
        border-top-right-radius: 0!important;
        border-bottom-right-radius: 0!important;
    }
    
    /* Track */
    ::-webkit-scrollbar-track {
        background: #212529;
        border-radius: 2px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #eee;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { Comments, Accounts } from '../server'
export default {
  computed : mapGetters(['isSigned','getUserData']),
  methods: mapActions(['assignSigned','assignUserData']),
  data(){
    return{
    }
  },
  async mounted(){
    function nav(w){
      window.scrollTo(0,0);
      if(w.innerWidth <= 768){
        let e = document.querySelector('nav');
        if(e==null)return;
        e.classList.add('nav');
        e.classList.add('navbar');
        e.classList.remove('container');
        e.classList.add('fixed-top');
        if(!document.body.classList.contains('not-signed')){
          e.classList.add('bg-dark');
        }
      }else{
        let e = document.querySelector('nav');
        if(e==null)return;
        e.classList.remove('nav');
        e.classList.remove('navbar');
        e.classList.add('container');
        e.classList.remove('fixed-top');
        e.classList.remove('bg-dark');
      }
    }
    window.onresize = function(){nav(this)};
    window.onload = function(){nav(this)};
    let ref = this;
    this.$gapi.listenUserSignIn(async (isSigned_) => {
        ref.assignSigned(isSigned_);
        if(isSigned_){
          let account = ref.$gapi.getUserData();
          let f_name = account.firstName.match(/\w+/g)[0]
          let l_name = account.firstName.match(/\w+/g)[1]
          let id = account.lastName.replace(/-*/g,'');
          let email = account.email
          let google_id = account.id
          let role_ = email[0] == 'i' ? 'student' : 'instructor'
          let accountData = {f_name,l_name,email,google_id,role_,id};
          await Accounts.addAccount(accountData)
          let accountData_ = await Accounts.getAccount(google_id);
          accountData_["id"] = id;
          accountData_["isLogged"] = 1;
          ref.assignUserData(accountData_);
          let item = await Accounts.crypt("datahashing");  
          let pass = "thedatahasdfasdnflasndlkfasld1sf";
          let string = JSON.stringify(accountData_);
          let val = await Accounts.crypt(string,"encrypt",pass);
          sessionStorage.setItem(item, val);
          document.body.classList.remove("not-signed");
        }else{
          document.body.classList.add("not-signed");
        }
    });
  },
}
</script>