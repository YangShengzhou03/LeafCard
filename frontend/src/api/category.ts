import service from './index'
import type { 
  CardCategory, 
  CardSubCategory, 
  CreateCardCategoryParams, 
  UpdateCardCategoryParams,
  CreateCardSubCategoryParams,
  UpdateCardSubCategoryParams,
  CardCategoryQueryParams,
  PaginationResponse,
  ApiResponse 
} from '@/types'

// 分类管理API
export const categoryApi = {
  // 获取分类列表
  getCategories(params?: CardCategoryQueryParams): Promise<PaginationResponse<CardCategory>> {
    return service.get('/categories', { params })
  },

  // 获取所有分类（不分页）
  getAllCategories(): Promise<CardCategory[]> {
    return service.get('/categories/all')
  },

  // 获取分类详情
  getCategory(id: number): Promise<CardCategory> {
    return service.get(`/categories/${id}`)
  },

  // 创建分类
  createCategory(data: CreateCardCategoryParams): Promise<CardCategory> {
    return service.post('/categories', data)
  },

  // 更新分类
  updateCategory(id: number, data: UpdateCardCategoryParams): Promise<CardCategory> {
    return service.put(`/categories/${id}`, data)
  },

  // 删除分类
  deleteCategory(id: number): Promise<void> {
    return service.delete(`/categories/${id}`)
  },

  // 批量删除分类
  batchDeleteCategories(ids: number[]): Promise<void> {
    return service.delete('/categories/batch', { data: { ids } })
  },

  // 切换分类状态
  toggleCategoryStatus(id: number): Promise<CardCategory> {
    return service.patch(`/categories/${id}/status`)
  },

  // 获取子分类列表
  getSubCategories(categoryId: number): Promise<CardSubCategory[]> {
    return service.get(`/categories/${categoryId}/sub-categories`)
  },

  // 创建子分类
  createSubCategory(data: CreateCardSubCategoryParams): Promise<CardSubCategory> {
    return service.post('/sub-categories', data)
  },

  // 更新子分类
  updateSubCategory(id: number, data: UpdateCardSubCategoryParams): Promise<CardSubCategory> {
    return service.put(`/sub-categories/${id}`, data)
  },

  // 删除子分类
  deleteSubCategory(id: number): Promise<void> {
    return service.delete(`/sub-categories/${id}`)
  },

  // 切换子分类状态
  toggleSubCategoryStatus(id: number): Promise<CardSubCategory> {
    return service.patch(`/sub-categories/${id}/status`)
  },

  // 获取分类统计
  getCategoryStats(): Promise<{
    totalCategories: number
    activeCategories: number
    totalSubCategories: number
    activeSubCategories: number
  }> {
    return service.get('/categories/stats')
  }
}

export default categoryApi