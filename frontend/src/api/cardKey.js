import Server from '../utils/Server'

/**
 * 卡密相关API - 适配后端统一响应格式
 */
export const cardKeyApi = {
  /**
   * 获取卡密列表（分页）
   * @param {number} page - 页码
   * @param {number} size - 每页大小
   * @param {string} status - 状态筛选
   * @returns {Promise} 卡密列表
   */
  getCardKeys(page = 1, size = 10, status = null) {
    const params = { page, size }
    if (status) params.status = status
    return Server.get('/api/card-keys', params)
  },

  /**
   * 根据卡密查询
   * @param {string} cardKey - 卡密
   * @returns {Promise} 卡密信息
   */
  searchCardKey(cardKey) {
    return Server.get('/api/card-keys/search', { cardKey })
  },

  /**
   * 激活卡密
   * @param {string} cardKey - 卡密
   * @param {string} userId - 用户ID
   * @param {string} userEmail - 用户邮箱
   * @returns {Promise} 激活结果
   */
  activateCard(cardKey, userId, userEmail) {
    return Server.post(`/api/card-keys/${cardKey}/activate`, {
      userId,
      userEmail
    })
  },

  /**
   * 禁用卡密
   * @param {string} cardKey - 卡密
   * @returns {Promise} 禁用结果
   */
  disableCard(cardKey) {
    return Server.post(`/api/card-keys/${cardKey}/disable`)
  },

  /**
   * 获取卡密统计信息
   * @returns {Promise} 统计信息
   */
  getCardStatistics() {
    return Server.get('/api/card-keys/statistics')
  },

  /**
   * 创建卡密
   * @param {Object} cardKeyData - 卡密数据
   * @returns {Promise} 创建结果
   */
  createCardKey(cardKeyData) {
    return Server.post('/api/card-keys', cardKeyData)
  }
}

export default cardKeyApi