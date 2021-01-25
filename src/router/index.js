import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'

import Home from '../components/user/Home.vue'
import Welcome from '../components/user/Welcome.vue'
import Users from '../components/user/Users.vue'


import Roles from '../components/power/Roles.vue'
import Rights from '../components/power/Rights.vue'

import Goods from '../components/goods/Goods.vue'
import Params from '../components/goods/Params.vue'
import Categories from '../components/goods/Categories.vue'
import Add from '../components/goods/Add.vue'

import orders from '../components/order/Orders.vue'
import Reports from '../components/report/Reports.vue'

import Menu from '../components/assembly/Menu.vue'


Vue.use(VueRouter)



const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component:orders
      },
      {
        path: '/reports',
        component:Reports
      },
      {
        path: '/menu',
        component: Menu
      }
    ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next()
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next()
})
export default router