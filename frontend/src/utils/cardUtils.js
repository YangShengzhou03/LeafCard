/**
 * 卡密工具函数
 */

/**
 * 生成卡密ID
 * @param {string} prefix - 卡密前缀
 * @param {number} index - 序号
 * @returns {string} 卡密ID
 */
export const generateCardId = (prefix = 'CARD', index = 1) => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${String(index).padStart(3, '0')}-${randomSuffix}`
}

/**
 * 批量生成卡密
 * @param {string} specType - 规格类型
 * @param {number} quantity - 数量
 * @param {Object} options - 选项
 * @returns {Array} 卡密数组
 */
export const generateCardsBatch = (specType, quantity, options = {}) => {
  const {
    prefix = 'CARD',
    categoryName = '软件服务',
    goodsName = '办公软件'
  } = options
  
  const specNameMap = {
    'month': '月卡',
    'quarter': '季卡', 
    'year': '年卡'
  }
  
  return Array.from({ length: quantity }, (_, i) => ({
    id: generateCardId(prefix, i + 1),
    specType,
    responseNumber: 0,
    status: 'unused',
    createdAt: new Date().toLocaleString('zh-CN'),
    categoryName,
    goodsName,
    specName: specNameMap[specType] || specType
  }))
}

/**
 * 验证卡密格式
 * @param {string} cardId - 卡密ID
 * @returns {boolean} 是否有效
 */
export const validateCardFormat = (cardId) => {
  if (!cardId || typeof cardId !== 'string') return false
  
  // 卡密格式验证: CARD-20240115-001-ABC123
  const pattern = /^[A-Z]{3,10}-\d{8}-\d{3}-[A-Z0-9]{6}$/
  return pattern.test(cardId)
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @returns {string} 格式化后的日期
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}