// 应用常量定义

// 应用配置
export const APP_CONFIG = {
  NAME: '枫叶卡管',
  VERSION: '1.0.0',
  DESCRIPTION: 'Leaf Card - 智能卡管理系统',
  COPYRIGHT: '© 2024 Leaf Card. All Rights Reserved.',
} as const

// API配置
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
} as const

// 路由配置
export const ROUTE_CONFIG = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CARDS: '/cards',
  CATEGORIES: '/categories',
  TRASH: '/trash',
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  SIDEBAR_STATUS: 'sidebarStatus',
  SIZE: 'size',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

// 响应状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const

// 卡状态枚举
export const CARD_STATUS = {
  UNUSED: 'unused',
  USED: 'used',
  DISABLED: 'disabled',
} as const

export type CardStatus = typeof CARD_STATUS[keyof typeof CARD_STATUS]

// 权限枚举
export const PERMISSIONS = {
  // 卡管理
  CARD_VIEW: 'card:view',
  CARD_CREATE: 'card:create',
  CARD_EDIT: 'card:edit',
  CARD_DELETE: 'card:delete',
  
  // 分类管理
  CATEGORY_VIEW: 'category:view',
  CATEGORY_CREATE: 'category:create',
  CATEGORY_EDIT: 'category:edit',
  CATEGORY_DELETE: 'category:delete',
  
  // 系统管理
  USER_MANAGEMENT: 'system:user',
  ROLE_MANAGEMENT: 'system:role',
  SETTINGS_MANAGEMENT: 'system:settings',
} as const

// 响应式断点
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
} as const

// 主题配置
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#409EFF',
  SUCCESS_COLOR: '#67C23A',
  WARNING_COLOR: '#E6A23C',
  DANGER_COLOR: '#F56C6C',
  INFO_COLOR: '#909399',
  
  // 字体大小
  FONT_SIZE_SM: '12px',
  FONT_SIZE_MD: '14px',
  FONT_SIZE_LG: '16px',
  FONT_SIZE_XL: '18px',
  
  // 间距
  SPACING_XS: '4px',
  SPACING_SM: '8px',
  SPACING_MD: '12px',
  SPACING_LG: '16px',
  SPACING_XL: '20px',
} as const

// 表单验证规则
export const VALIDATION_RULES = {
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^1[3-9]\d{9}$/,
} as const

export default {
  APP_CONFIG,
  API_CONFIG,
  ROUTE_CONFIG,
  STORAGE_KEYS,
  HTTP_STATUS,
  CARD_STATUS,
  PERMISSIONS,
  BREAKPOINTS,
  THEME_CONFIG,
  VALIDATION_RULES,
}