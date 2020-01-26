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
        savePwd (state, pwd) {
            state.password = pwd;
        },
        // 修改token，并将token存入localStorage
        changeLogin (state, user) {
            state.Authorization = user.Authorization;
            localStorage.setItem("token", user.token);
            localStorage.setItem("is_manager", user.is_manager || false);
            state.is_manager = user.is_manager || false;
        },
        //存储用户名
        saveUser (state, user) {
            state.account = user.account;
        }
    },
    getters: {
        getAccount: state => {
            return state.account;
        },
        getManager: state => {
            state.is_manager = localStorage.getItem("is_manager") || false;
            return state.is_manager;
        }
    }
});

export default store;
