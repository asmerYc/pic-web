import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect() {
        return '/login'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../view/home/home'),
      meta: {
        keepAlive: true,
        requiresAuth: true // 添加表示需要验证
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../view/login'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('../view/password'),
      meta: {
        keepAlive: false
      }
    }
  ]

})
export default router;
