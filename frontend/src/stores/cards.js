import { defineStore } from 'pinia'
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  batchDeleteCards,
  updateCardStatus,
  batchUpdateCardStatus,
  getCardDetail
} from '@/api/card'

export const useCardStore = defineStore('cards', {
  state: () => ({
    cards: [],
    currentCard: null,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    filters: {
      status: '',
      productId: '',
      specificationId: '',
      keyword: ''
    }
  }),

  getters: {
    // 按状态筛选卡片
    cardsByStatus: (state) => (status) => {
      return state.cards.filter(card => card.status === status)
    },
    
    // 按产品ID筛选卡片
    cardsByProductId: (state) => (productId) => {
      return state.cards.filter(card => card.productId === productId)
    },
    
    // 按规格ID筛选卡片
    cardsBySpecificationId: (state) => (specificationId) => {
      return state.cards.filter(card => card.specificationId === specificationId)
    },
    
    // 获取已上架卡片
    activeCards: (state) => {
      return state.cards.filter(card => card.status === 'active')
    },
    
    // 获取已下架卡片
    inactiveCards: (state) => {
      return state.cards.filter(card => card.status === 'inactive')
    }
  },

  actions: {
    // 获取卡片列表
    async fetchCards(params = {}) {
      this.loading = true
      try {
        const queryParams = {
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.filters,
          ...params
        }
        
        const response = await getCards(queryParams)
        const { data, total } = response.data
        
        this.cards = data
        this.pagination.total = total
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取卡片详情
    async fetchCardDetail(id) {
      this.loading = true
      try {
        const response = await getCardDetail(id)
        this.currentCard = response.data
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建卡片
    async createCard(cardData) {
      try {
        const response = await createCard(cardData)
        // 刷新列表
        await this.fetchCards()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 更新卡片
    async updateCard(id, cardData) {
      try {
        const response = await updateCard(id, cardData)
        // 刷新列表
        await this.fetchCards()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 删除卡片
    async deleteCard(id) {
      try {
        const response = await deleteCard(id)
        // 刷新列表
        await this.fetchCards()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 批量删除卡片
    async batchDeleteCards(ids) {
      try {
        const response = await batchDeleteCards(ids)
        // 刷新列表
        await this.fetchCards()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 更新卡片状态（上架/下架）
    async updateCardStatus(id, status) {
      try {
        const response = await updateCardStatus(id, status)
        // 刷新列表
        await this.fetchCards()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 批量更新卡片状态
    async batchUpdateCardStatus(ids, status) {
      try {
        const response = await batchUpdateCardStatus(ids, status)
        // 刷新列表
        await this.fetchCards()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 设置分页
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },
    
    // 设置筛选条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        status: '',
        productId: '',
        specificationId: '',
        keyword: ''
      }
      this.pagination.current = 1
    }
  }
})