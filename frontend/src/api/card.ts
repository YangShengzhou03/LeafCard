import service from './index'
import type { 
  CardInfo, 
  CreateCardParams, 
  UpdateCardParams, 
  CardQueryParams,
  PaginationResponse,
  ApiResponse 
} from '@/types'

// 卡管理API
export const cardApi = {
  // 获取卡列表
  getCards(params?: CardQueryParams): Promise<PaginationResponse<CardInfo>> {
    return service.get('/cards', { params })
  },

  // 获取卡详情
  getCard(id: number): Promise<CardInfo> {
    return service.get(`/cards/${id}`)
  },

  // 创建卡
  createCard(data: CreateCardParams): Promise<CardInfo> {
    return service.post('/cards', data)
  },

  // 更新卡
  updateCard(id: number, data: UpdateCardParams): Promise<CardInfo> {
    return service.put(`/cards/${id}`, data)
  },

  // 更新卡状态
  updateCardStatus(id: number, status: 'unused' | 'used' | 'disabled'): Promise<CardInfo> {
    return service.patch(`/cards/${id}/status`, { status })
  },

  // 删除卡（软删除）
  deleteCard(id: number): Promise<void> {
    return service.delete(`/cards/${id}`)
  },

  // 批量删除卡
  batchDeleteCards(ids: number[]): Promise<void> {
    return service.delete('/cards/batch', { data: { ids } })
  },

  // 恢复卡（从回收站）
  restoreCard(id: number): Promise<CardInfo> {
    return service.patch(`/cards/${id}/restore`)
  },

  // 永久删除卡
  permanentDeleteCard(id: number): Promise<void> {
    return service.delete(`/cards/${id}/permanent`)
  },

  // 批量永久删除卡
  batchPermanentDeleteCards(ids: number[]): Promise<void> {
    return service.delete('/cards/batch/permanent', { data: { ids } })
  },

  // 切换收藏状态
  toggleFavorite(id: number): Promise<CardInfo> {
    return service.patch(`/cards/${id}/favorite`)
  },

  // 更新查看次数
  updateViewCount(id: number): Promise<CardInfo> {
    return service.patch(`/cards/${id}/view-count`)
  },

  // 获取回收站列表
  getTrashCards(params?: CardQueryParams): Promise<PaginationResponse<CardInfo>> {
    return service.get('/cards/trash', { params })
  },

  // 清空回收站
  clearTrash(): Promise<void> {
    return service.delete('/cards/trash/clear')
  },

  // 获取卡统计
  getCardStats(): Promise<{
    totalCards: number
    activeCards: number
    deletedCards: number
    favoriteCards: number
    todayAdded: number
    todayViewed: number
  }> {
    return service.get('/cards/stats')
  },

  // 导出卡数据
  exportCards(params?: CardQueryParams): Promise<Blob> {
    return service.get('/cards/export', { 
      params, 
      responseType: 'blob' 
    })
  },

  // 导入卡数据
  importCards(file: File): Promise<{
    successCount: number
    failedCount: number
    errors: Array<{ row: number; error: string }>
  }> {
    const formData = new FormData()
    formData.append('file', file)
    
    return service.post('/cards/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 下载导入模板
  downloadTemplate(): Promise<Blob> {
    return service.get('/cards/import/template', {
      responseType: 'blob'
    })
  }
}

export default cardApi