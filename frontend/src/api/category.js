import request from '@/utils/request'

// 分类管理API
export const categoryApi = {
  // 获取分类列表
  getCategories(params) {
    return request({
      url: '/api/categories',
      method: 'get',
      params
    })
  },

  // 获取分类详情
  getCategory(id) {
    return request({
      url: `/api/categories/${id}`,
      method: 'get'
    })
  },

  // 创建分类
  createCategory(data) {
    return request({
      url: '/api/categories',
      method: 'post',
      data
    })
  },

  // 更新分类
  updateCategory(id, data) {
    return request({
      url: `/api/categories/${id}`,
      method: 'put',
      data
    })
  },

  // 删除分类
  deleteCategory(id) {
    return request({
      url: `/api/categories/${id}`,
      method: 'delete'
    })
  },

  // 获取分类树形结构
  getCategoryTree() {
    return request({
      url: '/api/categories/tree',
      method: 'get'
    })
  }
}

// 导出单独的函数以便在store中使用
export const getCategories = categoryApi.getCategories
export const getCategoryDetail = categoryApi.getCategory
export const createCategory = categoryApi.createCategory
export const updateCategory = categoryApi.updateCategory
export const deleteCategory = categoryApi.deleteCategory
export const getCategoryTree = categoryApi.getCategoryTree