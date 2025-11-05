import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/admin/DashboardPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/admin/ProductManagement.vue')
      },
      {
        path: 'products/add',
        name: 'AddProduct',
        component: () => import('../views/admin/ProductSpecManagement.vue')
      },
      {
        path: 'products/edit/:id',
        name: 'EditProduct',
        component: () => import('../views/admin/ProductSpecManagement.vue')
      },
      {
        path: 'specifications',
        name: 'Specifications',
        component: () => import('../views/admin/ProductSpecManagement.vue')
      },
      {
        path: 'specifications/add',
        name: 'AddSpecification',
        component: () => import('../views/admin/ProductSpecManagement.vue')
      },
      {
        path: 'specifications/edit/:id',
        name: 'EditSpecification',
        component: () => import('../views/admin/ProductSpecManagement.vue')
      },
      {
        path: 'card-keys',
        name: 'CardKeys',
        component: () => import('../views/admin/CardKeyManagement.vue')
      },
      {
        path: 'card-keys/add',
        name: 'AddCardKey',
        component: () => import('../views/admin/CardKeyGenerate.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/admin/UsersPage.vue')
      },
      {
        path: 'logs',
        name: 'OperationLogs',
        component: () => import('../views/admin/LogsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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