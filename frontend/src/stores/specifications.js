import { defineStore } from 'pinia'
import {
  getSpecifications,
  createSpecification,
  updateSpecification,
  deleteSpecification,
  getSpecificationDetail
} from '@/api/specification'

export const useSpecificationStore = defineStore('specifications', {
  state: () => ({
    specifications: [],
    currentSpecification: null,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    filters: {
      status: '',
      productId: '',
      keyword: ''
    }
  }),

  getters: {
    // 按状态筛选规格
    specificationsByStatus: (state) => (status) => {
      return state.specifications.filter(spec => spec.status === status)
    },
    
    // 按产品ID筛选规格
    specificationsByProductId: (state) => (productId) => {
      return state.specifications.filter(spec => spec.productId === productId)
    },
    
    // 获取活跃规格
    activeSpecifications: (state) => {
      return state.specifications.filter(spec => spec.status === 'active')
    },
    
    // 获取规格选项（用于下拉选择）
    specificationOptions: (state) => {
      return state.activeSpecifications.map(spec => ({
        value: spec.id,
        label: spec.name
      }))
    },
    
    // 根据产品ID获取规格选项
    specificationOptionsByProductId: (state) => (productId) => {
      return state.activeSpecifications
        .filter(spec => spec.productId === productId)
        .map(spec => ({
          value: spec.id,
          label: spec.name
        }))
    }
  },

  actions: {
    // 获取规格列表
    async fetchSpecifications(params = {}) {
      this.loading = true
      try {
        const queryParams = {
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.filters,
          ...params
        }
        
        const response = await getSpecifications(queryParams)
        const { data, total } = response.data
        
        this.specifications = data
        this.pagination.total = total
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取规格详情
    async fetchSpecificationDetail(id) {
      this.loading = true
      try {
        const response = await getSpecificationDetail(id)
        this.currentSpecification = response.data
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建规格
    async createSpecification(specificationData) {
      try {
        const response = await createSpecification(specificationData)
        // 刷新列表
        await this.fetchSpecifications()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 更新规格
    async updateSpecification(id, specificationData) {
      try {
        const response = await updateSpecification(id, specificationData)
        // 刷新列表
        await this.fetchSpecifications()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 删除规格
    async deleteSpecification(id) {
      try {
        const response = await deleteSpecification(id)
        // 刷新列表
        await this.fetchSpecifications()
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 根据产品ID获取规格列表
    async fetchSpecificationsByProductId(productId) {
      this.loading = true
      try {
        const response = await getSpecifications({ productId })
        this.specifications = response.data.data
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
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
        keyword: ''
      }
      this.pagination.current = 1
    }
  }
})