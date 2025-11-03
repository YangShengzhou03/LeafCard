import { cardApi } from '@/api/card'
import { CardStatus } from '@/types'

const state = {
  cards: [],
  currentCard: null,
  loading: false,
  total: 0,
  pagination: {
    page: 1,
    size: 10
  },
  filters: {
    keyword: '',
    status: '',
    productId: '',
    specificationId: ''
  }
}

const mutations = {
  SET_CARDS(state, cards) {
    state.cards = cards
  },
  SET_CURRENT_CARD(state, card) {
    state.currentCard = card
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_TOTAL(state, total) {
    state.total = total
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  ADD_CARD(state, card) {
    state.cards.unshift(card)
  },
  UPDATE_CARD(state, updatedCard) {
    const index = state.cards.findIndex(card => card.id === updatedCard.id)
    if (index !== -1) {
      state.cards.splice(index, 1, updatedCard)
    }
  },
  REMOVE_CARD(state, cardId) {
    state.cards = state.cards.filter(card => card.id !== cardId)
  }
}

const actions = {
  // 获取卡列表
  async fetchCards({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        ...state.pagination,
        ...state.filters
      }
      
      const response = await cardApi.getCards(params)
      const { items, total } = response.data
      
      commit('SET_CARDS', items)
      commit('SET_TOTAL', total)
      
      return response
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取卡详情
  async fetchCard({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await cardApi.getCard(id)
      const card = response.data
      
      commit('SET_CURRENT_CARD', card)
      
      return response
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 创建卡
  async createCard({ commit }, cardData) {
    try {
      const response = await cardApi.createCard(cardData)
      const card = response.data
      
      commit('ADD_CARD', card)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 更新卡
  async updateCard({ commit }, { id, data }) {
    try {
      const response = await cardApi.updateCard(id, data)
      const updatedCard = response.data
      
      commit('UPDATE_CARD', updatedCard)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 删除卡
  async deleteCard({ commit }, id) {
    try {
      await cardApi.deleteCard(id)
      commit('REMOVE_CARD', id)
    } catch (error) {
      throw error
    }
  },
  
  // 批量删除卡
  async batchDeleteCards({ commit }, ids) {
    try {
      await cardApi.batchDeleteCards(ids)
      
      // 从列表中移除已删除的卡
      ids.forEach(id => {
        commit('REMOVE_CARD', id)
      })
    } catch (error) {
      throw error
    }
  },
  
  // 上架卡
  async publishCard({ commit }, id) {
    try {
      const response = await cardApi.publishCard(id)
      const updatedCard = response.data
      
      commit('UPDATE_CARD', updatedCard)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 下架卡
  async unpublishCard({ commit }, id) {
    try {
      const response = await cardApi.unpublishCard(id)
      const updatedCard = response.data
      
      commit('UPDATE_CARD', updatedCard)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 批量上架卡
  async batchPublishCards({ commit }, ids) {
    try {
      const response = await cardApi.batchPublishCards(ids)
      const updatedCards = response.data
      
      // 更新列表中的卡状态
      updatedCards.forEach(card => {
        commit('UPDATE_CARD', card)
      })
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 批量下架卡
  async batchUnpublishCards({ commit }, ids) {
    try {
      const response = await cardApi.batchUnpublishCards(ids)
      const updatedCards = response.data
      
      // 更新列表中的卡状态
      updatedCards.forEach(card => {
        commit('UPDATE_CARD', card)
      })
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 设置分页
  setPagination({ commit }, pagination) {
    commit('SET_PAGINATION', pagination)
  },
  
  // 设置筛选条件
  setFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },
  
  // 重置筛选条件
  resetFilters({ commit }) {
    commit('SET_FILTERS', {
      keyword: '',
      status: '',
      productId: '',
      specificationId: ''
    })
  }
}

const getters = {
  publishedCards: state => state.cards.filter(card => card.status === CardStatus.PUBLISHED),
  draftCards: state => state.cards.filter(card => card.status === CardStatus.DRAFT),
  soldOutCards: state => state.cards.filter(card => card.status === CardStatus.SOLD_OUT),
  disabledCards: state => state.cards.filter(card => card.status === CardStatus.DISABLED),
  cardsByProductId: state => productId => state.cards.filter(card => card.productId === productId),
  cardsBySpecificationId: state => specificationId => state.cards.filter(card => card.specificationId === specificationId)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}