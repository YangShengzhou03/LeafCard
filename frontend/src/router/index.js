import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: '仪表板' }
  },
  {
    path: '/product',
    redirect: '/product/goods'
  },
  {
    path: '/product/goods',
    name: 'ProductGoods',
    component: () => import('@/views/ProductGoods.vue'),
    meta: { title: '商品管理' }
  },
  {
    path: '/product/categories',
    name: 'ProductCategories',
    component: () => import('@/views/ProductCategories.vue'),
    meta: { title: '商品分类' }
  },
  {
    path: '/product/specifications',
    name: 'ProductSpecifications',
    component: () => import('@/views/ProductSpecifications.vue'),
    meta: { title: '规格管理' }
  },
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('@/views/Cards.vue'),
    meta: { title: '卡密管理' }
  },
  {
    path: '/validation',
    name: 'Validation',
    component: () => import('@/views/Validation.vue'),
    meta: { title: '卡密验证' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Leaf Card`
  }
  next()
})

export default router