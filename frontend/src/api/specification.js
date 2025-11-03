import request from '@/utils/request'

// 规格管理API
export const specificationApi = {
  // 获取规格列表
  getSpecifications(params) {
    return request({
      url: '/api/specifications',
      method: 'get',
      params
    })
  },

  // 获取规格详情
  getSpecification(id) {
    return request({
      url: `/api/specifications/${id}`,
      method: 'get'
    })
  },

  // 创建规格
  createSpecification(data) {
    return request({
      url: '/api/specifications',
      method: 'post',
      data
    })
  },

  // 更新规格
  updateSpecification(id, data) {
    return request({
      url: `/api/specifications/${id}`,
      method: 'put',
      data
    })
  },

  // 删除规格
  deleteSpecification(id) {
    return request({
      url: `/api/specifications/${id}`,
      method: 'delete'
    })
  }
}

// 导出单独的函数以便在store中使用
export const getSpecifications = specificationApi.getSpecifications
export const getSpecificationDetail = specificationApi.getSpecification
export const createSpecification = specificationApi.createSpecification
export const updateSpecification = specificationApi.updateSpecification
export const deleteSpecification = specificationApi.deleteSpecification