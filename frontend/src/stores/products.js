import { defineStore } from 'pinia'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail
} from '@/api/product'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    filters: {
      status: '',
      category: '',
      keyword: ''
    }
  }),

  getters: {
    // 按状态筛选商品
    productsByStatus: (state) => (status) => {
      return state.products.filter(product => product.status === status)
    },
    
    // 按分类筛选商品
    productsByCategory: (state) => (category) => {
      return state.products.filter(product => product.category === category)
    },
    
    // 获取活跃商品
    activeProducts: (state) => {
      return state.products.filter(product => product.status === 'active')
    },
    
    // 获取商品选项（用于下拉选择）
    productOptions: (state) => {
      return state.activeProducts.map(product => ({
        value: product.id,
        label: product.name
      }))
    }
  },

  actions: {
    // 获取商品列表
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        const queryParams = {
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.filters,
          ...params
        }
        
        const response = await getProducts(queryParams)
        const { data, total } = response.data
        
        this.products = data
        this.pagination.total = total
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取商品详情
    async fetchProductDetail(id) {
      this.loading = true
      try {
        const response = await getProductDetail(id)
        this.currentProduct = response.data
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建商品
    async createProduct(productData) {
      try {
        const response = await createProduct(productData)
        // 刷新列表
        await this.fetchProducts()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 更新商品
    async updateProduct(id, productData) {
      try {
        const response = await updateProduct(id, productData)
        // 刷新列表
        await this.fetchProducts()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 删除商品
    async deleteProduct(id) {
      try {
        const response = await deleteProduct(id)
        // 刷新列表
        await this.fetchProducts()
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
        category: '',
        keyword: ''
      }
      this.pagination.current = 1
    }
  }
})