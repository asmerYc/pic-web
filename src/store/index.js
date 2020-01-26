import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 存储token
    Authorization: localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "",
    is_manager: localStorage.getItem("is_manager")
      ? localStorage.getItem("is_manager")
      : false,
    account: "",
    password: ""
  },

  mutations: {
    savePwd(state, pwd) {
      state.password = pwd;
    },
    // 修改token，并将token存入localStorage
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      //   state.is_manager = user.is_manager;
      localStorage.setItem("token", user.token);
      if (user.is_manager) {
        localStorage.setItem("is_manager", user.is_manager);
        state.is_manager = true;
      } else {
        localStorage.setItem("is_manager", false);
        state.is_manager = false;
      }
    },
    //存储用户名
    saveUser(state, user) {
      state.account = user.account;
    },
    is_manager(state, is_manager) {
      state.is_manager = is_manager;
    }
  },
  getters: {
    getAccount: state => {
      return state.account;
    }
  }
});

export default store;
