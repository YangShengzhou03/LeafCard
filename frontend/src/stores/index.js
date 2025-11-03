import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出所有store
export { useAuthStore } from './auth'
export { useCardStore } from './cards'
export { useProductStore } from './products'
export { useSpecificationStore } from './specifications'