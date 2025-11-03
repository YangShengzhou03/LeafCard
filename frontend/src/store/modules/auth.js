import { login, logout, getUserInfo } from '@/api/auth'

const state = {
  token: localStorage.getItem('token') || '',
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  },
  CLEAR_AUTH(state) {
    state.token = ''
    state.userInfo = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
}

const actions = {
  // 登录
  async login({ commit }, loginForm) {
    try {
      const response = await login(loginForm)
      const { token, userInfo } = response.data
      
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 登出
  async logout({ commit }) {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      commit('CLEAR_AUTH')
    }
  },
  
  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      const response = await getUserInfo()
      const userInfo = response.data
      
      commit('SET_USER_INFO', userInfo)
      
      return userInfo
    } catch (error) {
      throw error
    }
  }
}

const getters = {
  isAuthenticated: state => !!state.token,
  userRoles: state => state.userInfo.roles || [],
  userName: state => state.userInfo.name || ''
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}