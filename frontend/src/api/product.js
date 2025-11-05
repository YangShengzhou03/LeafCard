import Server from '../utils/Server'

/**
 * 产品相关API - 适配后端统一响应格式
 */
export const productApi = {
  /**
   * 获取产品列表（分页）
   * @param {number} page - 页码
   * @param {number} size - 每页大小
   * @param {string} category - 分类筛选
   * @param {string} status - 状态筛选
   * @returns {Promise} 产品列表
   */
  getProducts(page = 1, size = 10, category = null, status = null) {
    const params = { page, size }
    if (category) params.category = category
    if (status) params.status = status
    return Server.get('/api/products', params)
  },

  /**
   * 根据ID获取产品
   * @param {string} id - 产品ID
   * @returns {Promise} 产品信息
   */
  getProductById(id) {
    return Server.get(`/api/products/${id}`)
  },

  /**
   * 创建产品
   * @param {Object} productData - 产品数据
   * @returns {Promise} 创建结果
   */
  createProduct(productData) {
    return Server.post('/api/products', productData)
  },

  /**
   * 更新产品
   * @param {string} id - 产品ID
   * @param {Object} productData - 产品数据
   * @returns {Promise} 更新结果
   */
  updateProduct(id, productData) {
    return Server.put(`/api/products/${id}`, productData)
  },

  /**
   * 删除产品
   * @param {string} id - 产品ID
   * @returns {Promise} 删除结果
   */
  deleteProduct(id) {
    return Server.delete(`/api/products/${id}`)
  },

  /**
   * 获取产品统计信息
   * @returns {Promise} 统计信息
   */
  getProductStatistics() {
    return Server.get('/api/products/statistics')
  },

  /**
   * 根据分类获取产品
   * @param {string} category - 分类
   * @returns {Promise} 产品列表
   */
  getProductsByCategory(category) {
    return Server.get(`/api/products/category/${category}`)
  }
}

export default productApi