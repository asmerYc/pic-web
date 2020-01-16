import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: () => import('@/components/HelloWorld'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../view/home/home'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/',
      name: 'login',
      component: () => import('../view/login'),
      meta: {
        keepAlive: false
      }
    }
  ]
})
