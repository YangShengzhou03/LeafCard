import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
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
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data } = response
    
    if (data.code === 200) {
      return data
    } else {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error) => {
    // 对响应错误做点什么
    let message = '请求失败'
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.request) {
      message = '网络错误，请检查网络连接'
    } else {
      message = error.message
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default request