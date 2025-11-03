import { productApi } from '@/api/product'

const state = {
  products: [],
  currentProduct: null,
  loading: false,
  total: 0,
  pagination: {
    page: 1,
    size: 10
  },
  filters: {
    keyword: '',
    category: '',
    status: ''
  }
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
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
  ADD_PRODUCT(state, product) {
    state.products.unshift(product)
  },
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(product => product.id === updatedProduct.id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },
  REMOVE_PRODUCT(state, productId) {
    state.products = state.products.filter(product => product.id !== productId)
  }
}

const actions = {
  // 获取商品列表
  async fetchProducts({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        ...state.pagination,
        ...state.filters
      }
      
      const response = await productApi.getProducts(params)
      const { items, total } = response.data
      
      commit('SET_PRODUCTS', items)
      commit('SET_TOTAL', total)
      
      return response
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取商品详情
  async fetchProduct({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await productApi.getProduct(id)
      const product = response.data
      
      commit('SET_CURRENT_PRODUCT', product)
      
      return response
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 创建商品
  async createProduct({ commit }, productData) {
    try {
      const response = await productApi.createProduct(productData)
      const product = response.data
      
      commit('ADD_PRODUCT', product)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 更新商品
  async updateProduct({ commit }, { id, data }) {
    try {
      const response = await productApi.updateProduct(id, data)
      const updatedProduct = response.data
      
      commit('UPDATE_PRODUCT', updatedProduct)
      
      return response
    } catch (error) {
      throw error
    }
  },
  
  // 删除商品
  async deleteProduct({ commit }, id) {
    try {
      await productApi.deleteProduct(id)
      commit('REMOVE_PRODUCT', id)
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
      category: '',
      status: ''
    })
  }
}

const getters = {
  activeProducts: state => state.products.filter(product => product.status === 'active'),
  inactiveProducts: state => state.products.filter(product => product.status === 'inactive'),
  productsByCategory: state => category => state.products.filter(product => product.category === category),
  productOptions: state => state.products.map(product => ({
    value: product.id,
    label: product.name
  }))
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}