import { createStore } from 'vuex'

export default createStore({
  namespace : true,
  state:{
      isSigned : {signed: 0},
      userData : {}
  },
  mutations: {
    setSigned(state,status = 0){
      state.isSigned = new Object({signed: status});
    },
    setUserData(state,data){
      state.userData = new Object(data);
    }
  },
  actions: {
    assignUserData({commit},data){
      commit('setUserData', data);
    },
    assignSigned({commit},data = 0){
      commit('setSigned', data);
    }
  },
  modules: {
  },
  getters: {
    isSigned(state){
      return state.isSigned.signed == 1;
    },
    getUserData(state){
      return state.userData;
    }
  }
})
