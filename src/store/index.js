import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 存储token
    Authorization: localStorage.getItem("Authorization")
      ? localStorage.getItem("Authorization")
      : "",
    is_manager: false,
    account: "",
    password: "",
  },

  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      state.is_manager = user.is_manager;
      localStorage.setItem("Authorization", user.Authorization);
    },
    //存储用户名
    saveUser(state, user) {
      state.account = user.account;
      state.password = user.password;
    }
  },
  getters: {
    getAccount: state => {
      return state.account;
    }
  }
});

export default store;
