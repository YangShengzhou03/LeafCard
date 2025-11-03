import request from '@/utils/request'

// 认证API
export const authApi = {
  // 登录
  login(data) {
    return request({
      url: '/api/auth/login',
      method: 'post',
      data
    })
  },

  // 登出
  logout() {
    return request({
      url: '/api/auth/logout',
      method: 'post'
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/api/auth/user',
      method: 'get'
    })
  },

  // 注册
  register(data) {
    return request({
      url: '/api/auth/register',
      method: 'post',
      data
    })
  },

  // 重置密码
  resetPassword(data) {
    return request({
      url: '/api/auth/reset-password',
      method: 'post',
      data
    })
  },

  // 忘记密码
  forgotPassword(data) {
    return request({
      url: '/api/auth/forgot-password',
      method: 'post',
      data
    })
  }
}

// 导出单独的函数以便在store中使用
export const login = authApi.login
export const logout = authApi.logout
export const getUserInfo = authApi.getUserInfo
export const register = authApi.register
export const resetPassword = authApi.resetPassword
export const forgotPassword = authApi.forgotPassword