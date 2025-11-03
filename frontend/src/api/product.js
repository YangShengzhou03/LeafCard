import request from '@/utils/request'

// 商品管理API
export const productApi = {
  // 获取商品列表
  getProducts(params) {
    return request({
      url: '/api/products',
      method: 'get',
      params
    })
  },

  // 获取商品详情
  getProduct(id) {
    return request({
      url: `/api/products/${id}`,
      method: 'get'
    })
  },

  // 创建商品
  createProduct(data) {
    return request({
      url: '/api/products',
      method: 'post',
      data
    })
  },

  // 更新商品
  updateProduct(id, data) {
    return request({
      url: `/api/products/${id}`,
      method: 'put',
      data
    })
  },

  // 删除商品
  deleteProduct(id) {
    return request({
      url: `/api/products/${id}`,
      method: 'delete'
    })
  },

  // 批量删除商品
  batchDeleteProducts(ids) {
    return request({
      url: '/api/products/batch',
      method: 'delete',
      data: { ids }
    })
  },

  // 导入商品
  importProducts(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return request({
      url: '/api/products/import',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 导出商品
  exportProducts(params) {
    return request({
      url: '/api/products/export',
      method: 'get',
      params,
      responseType: 'blob'
    })
  }
}

// 导出单独的函数以便在store中使用
export const getProducts = productApi.getProducts
export const getProductDetail = productApi.getProduct
export const createProduct = productApi.createProduct
export const updateProduct = productApi.updateProduct
export const deleteProduct = productApi.deleteProduct
export const batchDeleteProducts = productApi.batchDeleteProducts
export const importProducts = productApi.importProducts
export const exportProducts = productApi.exportProducts