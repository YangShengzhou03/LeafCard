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
  }
}

// 导出单独的函数以便在store中使用
export const getProducts = productApi.getProducts
export const getProductDetail = productApi.getProduct
export const createProduct = productApi.createProduct
export const updateProduct = productApi.updateProduct
export const deleteProduct = productApi.deleteProduct