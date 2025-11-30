import { createRouter, createWebHistory } from 'vue-router';
import store from '@/utils/store.js';
import * as utils from '@/utils/utils.js';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: {
      title: '管理员登录 - LeafCard',
      requiresAuth: false
    }
  },

  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/components/IndexLayout.vue'),
    meta: {
      title: 'LeafCard - 轻羽卡管系统',
      requiresAuth: false
    }
  },

  {
    path: '/admin',
    component: () => import('@/components/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardPage.vue'),
        meta: {
          title: 'LeafCard - 管理员仪表盘',
          requiresAuth: true
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersPage.vue'),
        meta: {
          title: 'LeafCard - 用户管理',
          requiresAuth: true
        }
      },

      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('@/views/admin/LogsPage.vue'),
        meta: {
          title: 'LeafCard - 操作日志',
          requiresAuth: true
        }
      },
      {
        path: 'products',
        name: 'ProductManagement',
        component: () => import('@/views/admin/ProductManagement.vue'),
        meta: {
          title: 'LeafCard - 商品管理',
          requiresAuth: true
        }
      },
      {
        path: 'card-keys',
        name: 'CardKeyManagement',
        component: () => import('@/views/admin/CardKeyManagement.vue'),
        meta: {
          title: 'LeafCard - 卡密管理',
          requiresAuth: true
        }
      },
      {
        path: 'card-verify',
        name: 'CardKeyVerifyAdmin',
        component: () => import('@/views/admin/CardKeyVerify.vue'),
        meta: {
          title: 'LeafCard - 卡密验证',
          requiresAuth: true
        }
      },
      {
        path: 'card-generate',
        name: 'CardKeyGenerate',
        component: () => import('@/views/admin/CardKeyGenerate.vue'),
        meta: {
          title: 'LeafCard - 卡密生成',
          requiresAuth: true
        }
      },
      {
        path: 'profile',
        name: 'ProfilePage',
        component: () => import('@/views/admin/ProfilePage.vue'),
        meta: {
          title: 'LeafCard - 个人资料',
          requiresAuth: true
        }
      },
      {
        path: 'product-specs',
        name: 'ProductSpecManagement',
        component: () => import('@/views/admin/ProductSpecManagement.vue'),
        meta: {
          title: 'LeafCard - 规格管理',
          requiresAuth: true
        }
      },
    ]
  },

  {
    path: '/share/:id?',
    name: 'SharePage',
    component: () => import('@/components/IndexLayout.vue'),
    meta: {
      title: 'LeafCard - 轻羽卡管系统',
      requiresAuth: false
    }
  },

  {
    path: '/user-guide',
    name: 'UserGuidePage',
    component: () => import('@/views/index/UserGuidePage.vue'),
    meta: {
      title: '使用指南 - LeafCard',
      requiresAuth: false
    }
  },
  {
    path: '/contact-us',
    name: 'ContactUsPage',
    component: () => import('@/views/index/ContactUsPage.vue'),
    meta: {
      title: '联系我们 - LeafCard',
      requiresAuth: false
    }
  },
  {
    path: '/faq',
    name: 'FAQPage',
    component: () => import('@/views/index/FaqPage.vue'),
    meta: {
      title: '常见问题 - LeafCard',
      requiresAuth: false
    }
  },

  {
    path: '/author-info',
    name: 'AuthorInfoPage',
    component: () => import('@/views/index/AuthorInfoPage.vue'),
    meta: {
      title: '作者介绍 - LeafCard',
      requiresAuth: false
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyPage',
    component: () => import('@/views/index/PrivacyPolicyPage.vue'),
    meta: {
      title: '隐私保护 - LeafCard',
      requiresAuth: false
    }
  },

  {
    path: '/verify',
    name: 'CardKeyVerify',
    component: () => import('@/views/admin/CardKeyVerify.vue'),
    meta: {
      title: 'LeafCard - 卡密验证',
      requiresAuth: false
    }
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.meta.requiresAuth) {
    // 使用store中的checkAuthStatus方法验证token
    const isAuthenticated = await store.checkAuthStatus();

    if (!isAuthenticated) {
      // token无效或过期，清除本地存储并跳转到登录页
      store.clearUser();
      next('/login');
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      // 开发环境下，直接继续路由
      next();
      return;
    }

    // 确保用户信息存在
    if (!store.state.user) {
      try {
        await store.fetchCurrentUser();
      } catch (error) {
        // 获取用户信息失败，清除token并跳转到登录页
        store.clearUser();
        next('/login');
        return;
      }
    }
  }

  // 如果已登录且访问登录页，跳转到管理页面
  if (to.path === '/login' && utils.isLoggedIn()) {
    // 验证token是否有效
    const isAuthenticated = await store.checkAuthStatus();
    if (isAuthenticated) {
      next('/admin');
      return;
    } else {
      // token无效，清除本地存储
      store.clearUser();
    }
  }

  next();
});

export default router;