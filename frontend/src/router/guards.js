import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { AppStorage } from '@/utils/storage'

// 白名单路由（不需要登录即可访问）
const WHITE_LIST = ['/login', '/register', '/forgot-password', '/reset-password']

// 需要特定权限的路由配置
const PERMISSION_ROUTES = {
  '/users': ['admin'],
  '/settings': ['admin', 'manager']
}

/**
 * 检查用户是否有权限访问路由
 */
function checkPermission(routePath, userRoles) {
  // 检查路由元信息中的权限要求
  const requiredPermissions = getRoutePermissions(routePath)
  
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true // 没有权限要求，允许访问
  }
  
  return requiredPermissions.some(permission => userRoles.includes(permission))
}

/**
 * 获取路由所需的权限
 */
function getRoutePermissions(routePath) {
  // 根据路径匹配权限要求
  for (const [path, permissions] of Object.entries(PERMISSION_ROUTES)) {
    if (routePath.startsWith(path)) {
      return permissions
    }
  }
  return []
}

/**
 * 路由守卫设置
 */
export function setupRouterGuards(router) {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    // 检查token是否存在
    if (token) {
      // 如果已经登录，尝试访问登录页，则重定向到首页
      if (to.path === '/login') {
        next('/dashboard')
        return
      }
      
      // 检查用户权限
      const userRoles = authStore.userRoles
      if (!checkPermission(to.path, userRoles)) {
        ElMessage.error('您没有权限访问此页面')
        next(from.path || '/dashboard')
        return
      }
      
      next()
    } else {
      // 没有token
      if (WHITE_LIST.includes(to.path)) {
        next() // 在白名单中，允许访问
      } else {
        // 不在白名单中，重定向到登录页
        ElMessage.warning('请先登录')
        next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      }
    }
  })
  
  // 全局后置守卫
  router.afterEach((to) => {
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - Leaf Card`
    } else {
      document.title = 'Leaf Card'
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0)
  })
  
  // 路由错误处理
  router.onError((error) => {
    console.error('路由错误:', error)
    ElMessage.error('页面加载失败，请刷新重试')
  })
}

/**
 * 检查当前用户是否有指定权限
 */
export function hasPermission(permission) {
  const authStore = useAuthStore()
  const userRoles = authStore.userRoles
  
  if (typeof permission === 'string') {
    return userRoles.includes(permission)
  }
  
  if (Array.isArray(permission)) {
    return permission.some(role => userRoles.includes(role))
  }
  
  return false
}

/**
 * 检查当前用户是否有任意指定权限
 */
export function hasAnyPermission(permissions) {
  const authStore = useAuthStore()
  const userRoles = authStore.userRoles
  
  return permissions.some(permission => userRoles.includes(permission))
}

/**
 * 检查当前用户是否有所有指定权限
 */
export function hasAllPermissions(permissions) {
  const authStore = useAuthStore()
  const userRoles = authStore.userRoles
  
  return permissions.every(permission => userRoles.includes(permission))
}

/**
 * 权限指令工具函数
 */
export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding
    
    if (value && !hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}