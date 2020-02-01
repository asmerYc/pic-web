// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import ElementUI from "element-ui";
import { Loading } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App";
import router from "./router";
import "./assets/common/common.css";
import store from "./store";

Vue.use(ElementUI);

Vue.prototype.openLoading = function() {
  const loading = this.$loading({
    // 声明一个loading对象
    lock: true, // 是否锁屏
    text: "正在加载...", // 加载动画的文字
    spinner: "el-icon-loading", // 引入的loading图标
    background: "rgba(0, 0, 0, 0.3)", // 背景颜色
    target: ".sub-main", // 需要遮罩的区域
    body: true,
    customClass: "mask" // 遮罩层新增类名
  });
  setTimeout(function() {
    // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close(); // 关闭遮罩层
  }, 5000);
  return loading;
};

Vue.config.productionTip = false;

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 这里判断用户是否登录，验证本地存储是否有token
    let token = localStorage.getItem("token");
    if (!token) {
      // 判断当前的token是否存在
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>"
});
