import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// API接口定义
export const cardAPI = {
  // 获取卡密列表
  getCards: (params) => api.get('/cards', { params }),
  
  // 添加卡密
  addCard: (data) => api.post('/cards', data),
  
  // 验证卡密
  validateCard: (cardKey) => api.post('/cards/validate', { cardKey }),
  
  // 删除卡密
  deleteCard: (id) => api.delete(`/cards/${id}`)
}

export const specificationAPI = {
  // 获取规格列表
  getSpecifications: () => api.get('/specifications'),
  
  // 添加规格
  addSpecification: (data) => api.post('/specifications', data),
  
  // 更新规格
  updateSpecification: (id, data) => api.put(`/specifications/${id}`, data),
  
  // 删除规格
  deleteSpecification: (id) => api.delete(`/specifications/${id}`)
}

export default api