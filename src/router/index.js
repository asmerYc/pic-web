import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router =  new Router({
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
// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');
 
    if (token === 'null' || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});

 
export default router;
