// 工具函数集合

// 检查用户是否已登录
export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

// 保存token到localStorage
export function saveToken(token) {
  localStorage.setItem('token', token)
}

// 从localStorage移除token
export function removeToken() {
  localStorage.removeItem('token')
}

// 获取token
export function getToken() {
  return localStorage.getItem('token')
}

// 格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 解析JWT token
export function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT解析错误:', error);
    return {};
  }
}

// 保存登录凭据到localStorage
export function saveCredentials(username, password) {
  const credentials = {
    username: username,
    password: password,
    timestamp: Date.now()
  }
  localStorage.setItem('rememberedCredentials', JSON.stringify(credentials))
}

// 获取保存的登录凭据
export function getCredentials() {
  const saved = localStorage.getItem('rememberedCredentials')
  if (saved) {
    const credentials = JSON.parse(saved)
    // 检查凭据是否在7天内保存的
    if (Date.now() - credentials.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return credentials
    } else {
      // 超过7天，清除凭据
      removeCredentials()
    }
  }
  return null
}

// 清除保存的登录凭据
export function removeCredentials() {
  localStorage.removeItem('rememberedCredentials')
}