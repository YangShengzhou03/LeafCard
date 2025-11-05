import Server from '../utils/Server'

/**
 * 操作日志相关API - 适配后端统一响应格式
 */
export const operationLogApi = {
  /**
   * 获取操作日志列表（分页）
   * @param {number} page - 页码
   * @param {number} size - 每页大小
   * @returns {Promise} 操作日志列表
   */
  getOperationLogs(page = 1, size = 10) {
    return Server.get('/api/operation-logs', { page, size })
  },

  /**
   * 根据用户ID获取操作日志
   * @param {string} userId - 用户ID
   * @returns {Promise} 操作日志列表
   */
  getOperationLogsByUser(userId) {
    return Server.get(`/api/operation-logs/user/${userId}`)
  },

  /**
   * 根据操作类型获取操作日志
   * @param {string} operationType - 操作类型
   * @returns {Promise} 操作日志列表
   */
  getOperationLogsByType(operationType) {
    return Server.get(`/api/operation-logs/type/${operationType}`)
  },

  /**
   * 根据目标获取操作日志
   * @param {string} targetType - 目标类型
   * @param {string} targetId - 目标ID
   * @returns {Promise} 操作日志列表
   */
  getOperationLogsByTarget(targetType, targetId) {
    return Server.get('/api/operation-logs/target', { targetType, targetId })
  },

  /**
   * 记录操作日志
   * @param {Object} logData - 日志数据
   * @param {string} logData.userId - 用户ID
   * @param {string} logData.operationType - 操作类型
   * @param {string} logData.targetType - 目标类型
   * @param {string} logData.targetId - 目标ID
   * @param {string} logData.description - 描述
   * @param {string} logData.ipAddress - IP地址
   * @returns {Promise} 记录结果
   */
  logOperation(logData) {
    const { userId, operationType, targetType, targetId, description, ipAddress } = logData
    return Server.post('/api/operation-logs', {
      userId,
      operationType,
      targetType,
      targetId,
      description,
      ipAddress
    })
  }
}

export default operationLogApi