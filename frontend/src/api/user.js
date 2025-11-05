import Server from '../utils/Server'

/**
 * 用户相关API - 适配后端统一响应格式
 */
export const userApi = {
  /**
   * 用户登录
   * @param {Object} loginData - 登录数据
   * @param {string} loginData.username - 用户名
   * @param {string} loginData.password - 密码
   * @returns {Promise} 登录结果
   */
  login(loginData) {
    return Server.post('/api/users/login', loginData)
  },

  /**
   * 获取用户列表（分页）
   * @param {number} page - 页码
   * @param {number} size - 每页大小
   * @returns {Promise} 用户列表
   */
  getUsers(page = 1, size = 10) {
    return Server.get('/api/users', { page, size })
  },

  /**
   * 根据ID获取用户
   * @param {string} id - 用户ID
   * @returns {Promise} 用户信息
   */
  getUserById(id) {
    return Server.get(`/api/users/${id}`)
  },

  /**
   * 根据用户名获取用户
   * @param {string} username - 用户名
   * @returns {Promise} 用户信息
   */
  getUserByUsername(username) {
    return Server.get(`/api/users/username/${username}`)
  },

  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Promise} 创建结果
   */
  createUser(userData) {
    return Server.post('/api/users', userData)
  },

  /**
   * 更新用户
   * @param {string} id - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise} 更新结果
   */
  updateUser(id, userData) {
    return Server.put(`/api/users/${id}`, userData)
  },

  /**
   * 删除用户
   * @param {string} id - 用户ID
   * @returns {Promise} 删除结果
   */
  deleteUser(id) {
    return Server.delete(`/api/users/${id}`)
  },

  /**
   * 获取用户统计信息
   * @returns {Promise} 统计信息
   */
  getUserStatistics() {
    return Server.get('/api/users/statistics')
  }
}

export default userApi