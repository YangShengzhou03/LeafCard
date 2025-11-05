import Server from '../utils/Server'

/**
 * 管理员相关API - 适配后端统一响应格式
 */
export const adminApi = {
  /**
   * 管理员登录
   * @param {Object} loginData - 登录数据
   * @param {string} loginData.username - 用户名
   * @param {string} loginData.password - 密码
   * @returns {Promise} 登录结果
   */
  login(loginData) {
    return Server.post('/api/admins/login', loginData)
  },

  /**
   * 管理员注册
   * @param {Object} registerData - 注册数据
   * @param {string} registerData.email - 邮箱
   * @param {string} registerData.password - 密码
   * @returns {Promise} 注册结果
   */
  register(registerData) {
    return Server.post('/api/admins', registerData)
  },

  /**
   * 获取管理员信息
   * @param {string} id - 管理员ID
   * @returns {Promise} 管理员信息
   */
  getProfile(id) {
    return Server.get(`/api/admins/${id}`)
  },

  /**
   * 更新管理员信息
   * @param {string} id - 管理员ID
   * @param {Object} profileData - 管理员数据
   * @returns {Promise} 更新结果
   */
  updateProfile(id, profileData) {
    return Server.put(`/api/admins/${id}`, profileData)
  },

  /**
   * 修改密码
   * @param {Object} passwordData - 密码数据
   * @param {string} passwordData.oldPassword - 旧密码
   * @param {string} passwordData.newPassword - 新密码
   * @returns {Promise} 修改结果
   */
  changePassword(passwordData) {
    return Server.post('/api/admins/reset-password', passwordData)
  },

  /**
   * 获取管理员列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @returns {Promise} 管理员列表
   */
  getAdmins(params = {}) {
    return Server.get('/api/admins', { params })
  }
}

export default adminApi