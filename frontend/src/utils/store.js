import { reactive } from 'vue'
import * as utils from './utils.js'
import api from '@/services/api.js'

const state = reactive({
  user: null,
  isAuthenticated: utils.isLoggedIn(),
  loading: false,
  isAdmin: false,
  storageInfo: {
    totalStorageGB: 0,
    usedStorageGB: 0
  }
})

const store = {
  state,

  setUser(user) {
    if (user) {
      state.user = user
      state.isAuthenticated = true
      state.isAdmin = true
      if (user.storageInfo) {
        state.storageInfo = user.storageInfo
      }
    }
  },

  clearUser() {
    state.user = null
    state.isAuthenticated = false
    state.isAdmin = false
    utils.removeToken()
    state.storageInfo = {
      totalStorageGB: 0,
      usedStorageGB: 0
    }
  },

  updateStorageInfo(storageInfo) {
    if (storageInfo) {
      state.storageInfo = storageInfo
    }
  },

  async adminLogin(credentials) {
    state.loading = true
    try {
      const response = await api.admin.login(credentials)

      if (response && response.code === 200 && response.data) {
        const { token, user } = response.data

        if (token) {
          utils.saveToken(token)
        }

        if (user) {
          this.setUser(user)
        }

        return { success: true, message: response.message || '登录成功', user }
      }

      return { success: false, message: response?.message || '登录失败' }
    } catch (error) {
      return { success: false, message: '登录失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  async adminRegister(registerData) {
    const response = await api.admin.register(registerData);
    return { success: true, message: response.message };
  },

  async login(credentials) {
    state.loading = true
    try {
      const response = await api.user.login(credentials)

      if (response && response.code === 200 && response.data) {
        const { token, user } = response.data

        if (token) {
          utils.saveToken(token)
        }

        if (user) {
          this.setUser(user)
        } else {
          await this.fetchCurrentUser()
        }

        return { success: true, message: response.message || '登录成功', user }
      }

      return { success: false, message: response?.message || '登录失败' }
    } catch (error) {
      return { success: false, message: '登录失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  async updateUserProfile(userData) {
    try {
      const response = await api.user.updateUserInfo(userData)

      if (response && response.code === 200 && response.data) {
        this.setUser({ ...state.user, ...response.data })
        return { success: true, message: response.message || '更新成功' }
      }

      return { success: false, message: response?.message || '更新失败' }
    } catch (error) {
      return { success: false, message: '更新失败，请重试' }
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.user.changePassword(passwordData)

      if (response && response.code === 200) {
        return { success: true, message: response.message || '密码修改成功' }
      }

      return { success: false, message: response?.message || '密码修改失败' }
    } catch (error) {
      return { success: false, message: '密码修改失败，请重试' }
    }
  },

  async checkAuthStatus() {
    const token = utils.getToken()
    if (!token) {
      this.clearUser()
      return false
    }

    try {
      const decoded = utils.parseJWT(token)

      // 检查token是否过期
      if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
        this.clearUser()
        return false
      }

      // 检查token是否有效（包含必要字段）
      if (!decoded.adminId && !decoded.userId) {
        this.clearUser()
        return false
      }

      // 如果用户信息不存在，尝试获取当前用户信息
      if (!state.user) {
        await this.fetchCurrentUser()
      }

      return true
    } catch (error) {
      // token解析失败，清除用户状态
      this.clearUser()
      return false
    }
  },

  setLoading(loading) {
    state.loading = loading
  },

  getLoading() {
    return state.loading
  },

  async register(userData) {
    state.loading = true
    try {
      const response = await api.user.register(userData)

      if (response && response.code === 200) {
        // 处理响应数据，无论是否直接返回token和user
        const data = response.data || {}
        const { token, user } = data

        // 如果有token，保存并设置用户信息
        if (token) {
          utils.saveToken(token)

          if (user) {
            this.setUser(user)
          } else {
            // 如果没有直接返回用户信息，尝试获取当前用户信息
            await this.fetchCurrentUser().catch(() => {
              console.log('无法获取用户信息，但token已保存')
            })
          }

          return { success: true, message: response.message || '注册成功', user, token }
        } else {
          // 如果没有token，尝试使用注册的凭据进行登录
          try {
            const loginResponse = await api.user.login({
              email: userData.email,
              password: userData.passwordHash // 使用passwordHash作为密码
            })

            if (loginResponse && loginResponse.code === 200 && loginResponse.data) {
              const { token: loginToken, user: loginUser } = loginResponse.data

              if (loginToken) {
                utils.saveToken(loginToken)

                if (loginUser) {
                  this.setUser(loginUser)
                } else {
                  await this.fetchCurrentUser().catch(() => {
                    console.log('无法获取用户信息，但token已保存')
                  })
                }

                return { success: true, message: response.message || '注册成功并自动登录', loginUser, loginToken }
              }
            }
          } catch (loginError) {
            console.log('自动登录失败', loginError)
          }

          return { success: true, message: response.message || '注册成功，请手动登录' }
        }
      }

      return { success: false, message: response?.message || '注册失败' }
    } catch (error) {
      return { success: false, message: '注册失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  async sendVerificationCode(email) {
    state.loading = true
    try {
      await api.user.sendVerificationCode({ email })
      return { success: true, message: '验证码发送成功' }
    } catch (error) {
      return { success: false, message: '验证码发送失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  async fetchCurrentUser() {
    if (!utils.isLoggedIn()) {
      this.clearUser()
      return
    }

    try {
      const response = await api.user.getCurrentUser()

      if (response && response.code === 200 && response.data) {
        this.setUser(response.data)

        if (response.data.storageInfo) {
          this.updateStorageInfo(response.data.storageInfo)
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.clearUser()
      }
    }
  },

  async fetchStorageInfo() {
    if (!utils.isLoggedIn()) {
      return null
    }

    try {
      const response = await api.user.getStorageInfo()
      const storageData = response.data || response

      if (storageData) {
        state.storageInfo = {
          totalStorageGB: storageData.storageQuota ? (storageData.storageQuota / (1024 * 1024 * 1024)) : 0,
          usedStorageGB: storageData.usedStorage ? (storageData.usedStorage / (1024 * 1024 * 1024)) : 0,
          availableStorageGB: storageData.availableStorage ? (storageData.availableStorage / (1024 * 1024 * 1024)) : 0,
          usagePercentage: storageData.usagePercentage || 0
        }
      }
      return storageData
    } catch (error) {
      return null
    }
  },

  async updateProfile(userData) {
    state.loading = true
    try {
      const response = await api.user.updateUserInfo(userData)
      this.setUser(response.data)
      return { success: true, message: '更新成功' }
    } catch (error) {
      return { success: false, message: '更新失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  async updatePassword(passwordData) {
    state.loading = true
    try {
      await api.user.changePassword(passwordData)
      return { success: true, message: '密码更新成功' }
    } catch (error) {
      return { success: false, message: '密码更新失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  async logout() {
    try {
      await api.user.logout()
    } catch (error) {
      // 忽略登出错误，继续清理用户信息
    } finally {
      this.clearUser()
    }
  },

  async init() {
    if (utils.isLoggedIn()) {
      try {
        await this.fetchCurrentUser()
        await this.fetchStorageInfo()
        return true
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.clearUser()
        }
        return false
      }
    } else {
      this.clearUser()
    }
    return false
  },

}

export default store