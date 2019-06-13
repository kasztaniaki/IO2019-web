import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/pools',
      name: 'pools',
      component: () => import('./views/Pools.vue')
    },
    {
      path: '/users/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue')
    },
    {
      path: '/users/signin',
      name: 'signin',
      component: () => import('./views/Signin.vue')
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('./views/Reservations.vue')
    },
    {
      path: '/admin/users',
      name: 'users',
      component: () => import('./views/Users.vue')
    }
  ]
})
