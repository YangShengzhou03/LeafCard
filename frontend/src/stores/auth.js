import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRoles: (state) => state.userInfo.roles || [],
    userName: (state) => state.userInfo.name || ''
  },

  actions: {
    // 登录
    async login(loginForm) {
      try {
        const response = await login(loginForm)
        const { token, userInfo } = response.data
        
        this.token = token
        this.userInfo = userInfo
        
        localStorage.setItem('token', token)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 登出
    async logout() {
      try {
        await logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = ''
        this.userInfo = {}
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      try {
        const response = await getUserInfo()
        const userInfo = response.data
        
        this.userInfo = userInfo
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        
        return userInfo
      } catch (error) {
        throw error
      }
    },
    
    // 清除认证信息
    clearAuth() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})