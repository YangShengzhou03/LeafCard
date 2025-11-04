import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const http = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    
    switch (status) {
      case 400:
        ElMessage.error(`请求参数错误: ${message}`)
        break
      case 401:
        ElMessage.error('认证失败，请重新登录')
        // 清除token并跳转到登录页
        localStorage.removeItem('token')
        window.location.href = '/login'
        break
      case 403:
        ElMessage.error('权限不足')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 422:
        // 表单验证错误
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors
          const errorMessages = Object.values(errors).flat()
          ElMessage.error(errorMessages.join(', '))
        } else {
          ElMessage.error(`数据验证失败: ${message}`)
        }
        break
      case 429:
        ElMessage.error('请求过于频繁，请稍后再试')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      case 502:
        ElMessage.error('网关错误')
        break
      case 503:
        ElMessage.error('服务不可用')
        break
      case 504:
        ElMessage.error('网关超时')
        break
      default:
        if (error.code === 'ECONNABORTED') {
          ElMessage.error('请求超时，请检查网络连接')
        } else if (error.code === 'NETWORK_ERROR') {
          ElMessage.error('网络错误，请检查网络连接')
        } else if (error.message === 'canceled') {
          // 请求被取消，不显示错误
          return
        } else {
          ElMessage.error(`请求失败: ${message}`)
        }
    }
    
    return Promise.reject(error)
  }
)

export default http