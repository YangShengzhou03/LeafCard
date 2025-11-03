import { specificationApi } from '@/api/specification'

const state = {
  specifications: [],
  currentSpecification: null,
  loading: false,
  total: 0,
  pagination: {
    page: 1,
    size: 10
  },
  filters: {
    keyword: '',
    productId: '',
    status: ''
  }
}

const mutations = {
  SET_SPECIFICATIONS(state, specifications) {
    state.specifications = specifications
  },
  SET_CURRENT_SPECIFICATION(state, specification) {
    state.currentSpecification = specification
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
  ADD_SPECIFICATION(state, specification) {
    state.specifications.unshift(specification)
  },
  UPDATE_SPECIFICATION(state, updatedSpecification) {
    const index = state.specifications.findIndex(spec => spec.id === updatedSpecification.id)
    if (index !== -1) {
      state.specifications.splice(index, 1, updatedSpecification)
    }
  },
  REMOVE_SPECIFICATION(state, specificationId) {
    state.specifications = state.specifications.filter(spec => spec.id !== specificationId)
  }
}

const actions = {
  // 获取规格列表
  async fetchSpecifications({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        ...state.pagination,
        ...state.filters
      }
      
      const response = await specificationApi.getSpecifications(params)
      const { items, total } = response.data
      
      commit('SET_SPECIFICATIONS', items)
      commit('SET_TOTAL', total)
      
      return response
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取规格详情
  async fetchSpecification({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await specificationApi.getSpecification(id)
      const specification = response.data
      
      commit('SET_CURRENT_SPECIFICATION', specification)
      
      return response
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 创建规格
  async createSpecification({ commit }, specificationData) {
    try {
      const response = await specificationApi.createSpecification(specificationData)
      const specification = response.data
      
      commit('ADD_SPECIFICATION', specification)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 更新规格
  async updateSpecification({ commit }, { id, data }) {
    try {
      const response = await specificationApi.updateSpecification(id, data)
      const updatedSpecification = response.data
      
      commit('UPDATE_SPECIFICATION', updatedSpecification)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 删除规格
  async deleteSpecification({ commit }, id) {
    try {
      await specificationApi.deleteSpecification(id)
      commit('REMOVE_SPECIFICATION', id)
    } catch (error) {
      throw error
    }
  },
  
  // 根据商品ID获取规格列表
  async fetchSpecificationsByProductId({ commit }, productId) {
    commit('SET_LOADING', true)
    try {
      const params = { productId }
      const response = await specificationApi.getSpecifications(params)
      const specifications = response.data.items
      
      return specifications
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
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
      productId: '',
      status: ''
    })
  }
}

const getters = {
  activeSpecifications: state => state.specifications.filter(spec => spec.status === 'active'),
  inactiveSpecifications: state => state.specifications.filter(spec => spec.status === 'inactive'),
  specificationsByProductId: state => productId => state.specifications.filter(spec => spec.productId === productId),
  specificationOptions: state => state.specifications.map(spec => ({
    value: spec.id,
    label: spec.name
  }))
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}