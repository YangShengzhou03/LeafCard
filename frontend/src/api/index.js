// 导出API服务
export { apiService, useApiStore } from './service'
export { cardService, productService, userService, authService, statsService } from './modules'

// 默认导出API实例
export { default as api } from './service'