import Server from '../utils/Server'

/**
 * 规格相关API - 适配后端统一响应格式
 */
export const specificationApi = {
  /**
   * 获取规格列表（分页）
   * @param {number} page - 页码
   * @param {number} size - 每页大小
   * @returns {Promise} 规格列表
   */
  getSpecifications(page = 1, size = 10) {
    return Server.get('/api/specifications', { page, size })
  },

  /**
   * 根据ID获取规格
   * @param {string} id - 规格ID
   * @returns {Promise} 规格信息
   */
  getSpecificationById(id) {
    return Server.get(`/api/specifications/${id}`)
  },

  /**
   * 根据产品ID获取规格列表
   * @param {string} productId - 产品ID
   * @returns {Promise} 规格列表
   */
  getSpecificationsByProduct(productId) {
    return Server.get(`/api/specifications/product/${productId}`)
  },

  /**
   * 根据状态获取规格列表
   * @param {number} status - 状态
   * @returns {Promise} 规格列表
   */
  getSpecificationsByStatus(status) {
    return Server.get(`/api/specifications/status/${status}`)
  },

  /**
   * 创建规格
   * @param {Object} specificationData - 规格数据
   * @returns {Promise} 创建结果
   */
  createSpecification(specificationData) {
    return Server.post('/api/specifications', specificationData)
  },

  /**
   * 更新规格
   * @param {string} id - 规格ID
   * @param {Object} specificationData - 规格数据
   * @returns {Promise} 更新结果
   */
  updateSpecification(id, specificationData) {
    return Server.put(`/api/specifications/${id}`, specificationData)
  },

  /**
   * 删除规格
   * @param {string} id - 规格ID
   * @returns {Promise} 删除结果
   */
  deleteSpecification(id) {
    return Server.delete(`/api/specifications/${id}`)
  },

  /**
   * 获取规格统计信息
   * @returns {Promise} 统计信息
   */
  getSpecificationStatistics() {
    return Server.get('/api/specifications/statistics')
  }
}

export default specificationApi