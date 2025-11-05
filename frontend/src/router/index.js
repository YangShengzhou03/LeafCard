import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../components/Layout.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/Products.vue')
      },
      {
        path: 'products/add',
        name: 'AddProduct',
        component: () => import('../views/ProductForm.vue')
      },
      {
        path: 'products/edit/:id',
        name: 'EditProduct',
        component: () => import('../views/ProductForm.vue')
      },
      {
        path: 'specifications',
        name: 'Specifications',
        component: () => import('../views/Specifications.vue')
      },
      {
        path: 'specifications/add',
        name: 'AddSpecification',
        component: () => import('../views/SpecificationForm.vue')
      },
      {
        path: 'specifications/edit/:id',
        name: 'EditSpecification',
        component: () => import('../views/SpecificationForm.vue')
      },
      {
        path: 'card-keys',
        name: 'CardKeys',
        component: () => import('../views/CardKeys.vue')
      },
      {
        path: 'card-keys/add',
        name: 'AddCardKey',
        component: () => import('../views/CardKeyForm.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users.vue')
      },
      {
        path: 'logs',
        name: 'OperationLogs',
        component: () => import('../views/OperationLogs.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    // 如果已经登录，跳转到首页
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    // 需要登录的页面
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router