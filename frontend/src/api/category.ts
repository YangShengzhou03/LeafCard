import service from './index'
import type { 
  CardCategory, 
  CreateCardCategoryParams, 
  UpdateCardCategoryParams,
  CardCategoryQueryParams,
  PaginationResponse,
  ApiResponse 
} from '@/types'

// 分类管理API
export const categoryApi = {
  // 获取分类列表（树形结构）
  getCategories(params?: CardCategoryQueryParams): Promise<PaginationResponse<CardCategory>> {
    return service.get('/categories', { params })
  },

  // 获取所有分类（树形结构，不分页）
  getAllCategories(): Promise<CardCategory[]> {
    return service.get('/categories/all')
  },

  // 获取顶级分类列表
  getTopLevelCategories(): Promise<CardCategory[]> {
    return service.get('/categories/top-level')
  },

  // 获取指定分类的子分类
  getChildCategories(parentId: number): Promise<CardCategory[]> {
    return service.get(`/categories/${parentId}/children`)
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

  // 移动分类到新的父分类下
  moveCategory(id: number, newParentId?: number): Promise<CardCategory> {
    return service.patch(`/categories/${id}/move`, { parentId: newParentId })
  },

  // 获取分类统计
  getCategoryStats(): Promise<{
    totalCategories: number
    activeCategories: number
  }> {
    return service.get('/categories/stats')
  }
}

export default categoryApi