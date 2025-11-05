import Server from '../utils/Server'

/**
 * 操作日志相关API - 适配后端统一响应格式
 */
export const operationLogApi = {
  /**
   * 获取操作日志列表（分页，支持筛选）
   * @param {number} page - 页码
   * @param {number} size - 每页大小
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @param {string} operationType - 操作类型
   * @param {string} adminId - 管理员ID
   * @returns {Promise} 操作日志列表
   */
  getOperationLogs(page = 1, size = 10, startDate = null, endDate = null, operationType = null, adminId = null) {
    const params = { page, size }
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (operationType) params.operationType = operationType
    if (adminId) params.adminId = adminId
    return Server.get('/api/operation-logs', params)
  },

  /**
   * 获取日志统计信息
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @returns {Promise} 统计信息
   */
  getLogStats(startDate = null, endDate = null) {
    const params = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    return Server.get('/api/operation-logs/stats', params)
  },

  /**
   * 导出操作日志
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @returns {Promise} 导出结果
   */
  exportLogs(startDate = null, endDate = null) {
    const params = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    return Server.get('/api/operation-logs/export', params, { responseType: 'blob' })
  },

  /**
   * 清空操作日志
   * @returns {Promise} 清空结果
   */
  clearLogs() {
    return Server.delete('/api/operation-logs')
  },

  /**
   * 根据管理员ID获取操作日志
   * @param {string} adminId - 管理员ID
   * @returns {Promise} 操作日志列表
   */
  getOperationLogsByAdmin(adminId) {
    return Server.get(`/api/operation-logs/admin/${adminId}`)
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
   * @param {string} logData.adminId - 管理员ID
   * @param {string} logData.operationType - 操作类型
   * @param {string} logData.targetType - 目标类型
   * @param {string} logData.targetId - 目标ID
   * @param {string} logData.description - 描述
   * @param {string} logData.ipAddress - IP地址
   * @returns {Promise} 记录结果
   */
  logOperation(logData) {
    const { adminId, operationType, targetType, targetId, description, ipAddress } = logData
    return Server.post('/api/operation-logs', {
      adminId,
      operationType,
      targetType,
      targetId,
      description,
      ipAddress
    })
  },

  /**
   * 记录详细操作日志
   * @param {Object} logData - 详细日志数据
   * @returns {Promise} 记录结果
   */
  logDetailedOperation(logData) {
    return Server.post('/api/operation-logs/detailed', logData)
  }
}

export default operationLogApi