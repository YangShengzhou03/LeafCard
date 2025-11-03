import request from '@/utils/request'

// 卡管理API
export const cardApi = {
  // 获取卡列表
  getCards(params) {
    return request({
      url: '/api/cards',
      method: 'get',
      params
    })
  },

  // 获取卡详情
  getCard(id) {
    return request({
      url: `/api/cards/${id}`,
      method: 'get'
    })
  },

  // 创建卡
  createCard(data) {
    return request({
      url: '/api/cards',
      method: 'post',
      data
    })
  },

  // 更新卡
  updateCard(id, data) {
    return request({
      url: `/api/cards/${id}`,
      method: 'put',
      data
    })
  },

  // 删除卡
  deleteCard(id) {
    return request({
      url: `/api/cards/${id}`,
      method: 'delete'
    })
  },

  // 上架卡
  publishCard(id) {
    return request({
      url: `/api/cards/${id}/publish`,
      method: 'put'
    })
  },

  // 下架卡
  unpublishCard(id) {
    return request({
      url: `/api/cards/${id}/unpublish`,
      method: 'put'
    })
  },

  // 批量上架
  batchPublish(ids) {
    return request({
      url: '/api/cards/batch-publish',
      method: 'put',
      data: { ids }
    })
  },

  // 批量下架
  batchUnpublish(ids) {
    return request({
      url: '/api/cards/batch-unpublish',
      method: 'put',
      data: { ids }
    })
  },

  // 批量删除
  batchDelete(ids) {
    return request({
      url: '/api/cards/batch-delete',
      method: 'delete',
      data: { ids }
    })
  }
}

// 导出单独的函数以便在store中使用
export const getCards = cardApi.getCards
export const getCardDetail = cardApi.getCard
export const createCard = cardApi.createCard
export const updateCard = cardApi.updateCard
export const deleteCard = cardApi.deleteCard
export const batchDeleteCards = cardApi.batchDelete
export const updateCardStatus = (id, status) => {
  return status === 'active' ? cardApi.publishCard(id) : cardApi.unpublishCard(id)
}
export const batchUpdateCardStatus = (ids, status) => {
  return status === 'active' ? cardApi.batchPublish(ids) : cardApi.batchUnpublish(ids)
}

// 带错误处理和重试机制的安全API
export const safeCardApi = {
  async getCards(params, retries = 3) {
    try {
      return await cardApi.getCards(params)
    } catch (error) {
      if (retries > 0) {
        console.warn(`获取卡列表失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.getCards(params, retries - 1)
      }
      throw error
    }
  },

  async getCard(id, retries = 3) {
    try {
      return await cardApi.getCard(id)
    } catch (error) {
      if (retries > 0) {
        console.warn(`获取卡详情失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.getCard(id, retries - 1)
      }
      throw error
    }
  },

  async createCard(data, retries = 3) {
    try {
      return await cardApi.createCard(data)
    } catch (error) {
      if (retries > 0) {
        console.warn(`创建卡失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.createCard(data, retries - 1)
      }
      throw error
    }
  },

  async updateCard(id, data, retries = 3) {
    try {
      return await cardApi.updateCard(id, data)
    } catch (error) {
      if (retries > 0) {
        console.warn(`更新卡失败，剩余重试次数: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return safeCardApi.updateCard(id, data, retries - 1)
      }
      throw error
    }
  }
}