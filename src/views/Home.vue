<template>
  <div class="home mb-auto">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Navbar></Navbar>
    <div v-show="elementVisible" class="d-flex flex-column vh-75 justify-content-center align-items-center">
        <Search v-if="isSigned"></Search>
        <div v-else class="card">
          <div class="card-body">
            <h3 class="card-text text-light"> Welcome to ZC Rate <br> Please login using your ZC account. </h3>
            <button class="btn btn-primary btn-lg" id = "authorize_button" @click="login();"> <font-awesome-icon icon="sign-in-alt"></font-awesome-icon> Login </button>
          </div>
        </div>
      </div>
  </div>
</template>
<style>
  body{
    overflow:hidden;
  }
</style>
<style scoped>
.card{
  padding: 3rem;
  background: transparent;
  border:none;
}
button{
  font-size:1.4em;
  padding:0.4em 1.5em;
}
</style>
<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Search from '@/components/Search.vue'
import { mapState, mapGetters, mapActions } from 'vuex';
import { Comments, Accounts } from '../../server'
export default {
  name: 'Home',
  computed:mapGetters(['isSigned','getUserData']),
  components: {
    Navbar, Search
  },
  data(){
    return{
      elementVisible : false,
      item : null
    };
  },

  methods:{
    ...mapActions(['assignSigned','assignUserData']),
    login(){
      let ref = this;
      this.$gapi.login().then(async ({ currentUser, hasGrantedScopes }) => {
          ref.assignSigned(1);
          let account = ref.$gapi.getUserData();
          let f_name = account.firstName.match(/\w+/g)[0]
          let l_name = account.firstName.match(/\w+/g)[1]
          let id = account.lastName.replace(/-*/g,'');
          let email = account.email
          let google_id = account.id
          let role_ = email[0] == 'i' ? 'student' : 'instructor'
          let accountData = {f_name,l_name,email,google_id,role_,id};
          Accounts.addAccount(accountData)
          let accountData_ = await Accounts.getAccount(google_id);
          accountData_["id"] = id;
          accountData_["isLogged"] = 1;
          ref.assignUserData(accountData_);
          let pass = "thedatahasdfasdnflasndlkfasld1sf";
          let string = JSON.stringify(accountData_);
          let val = await Accounts.crypt(string,"encrypt",pass);
          sessionStorage.setItem(this.item, val);
      });
    },
    logout(){
      document.body.classList.remove("not-signed");
      localStorage.removeItem(this.item);
      this.$gapi.logout();
      this.assignUserData({});
      this.assignSigned(0);
    }
  },
  async created(){
    document.body.classList.remove('bg-light');
    document.body.classList.add('bg-dark');
    let item = await Accounts.crypt("datahashing");  
    this.item = item;
    setTimeout(() => this.elementVisible = true, 3000)
  },async mounted(){
    let ref = this;
    if(document.querySelector('.nav-login')!=null){
      document.querySelector('.nav-login').addEventListener('click',function(){
        ref.login();
      })
    }
  }
}
</script>

