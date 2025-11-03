<template>
  <div class="card-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <h3>卡详情</h3>
          <div class="header-actions">
            <el-button @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
          </div>
        </div>
      </template>

      <div v-if="cardData" class="card-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="card-image-container">
              <img 
                v-if="cardData.image" 
                :src="cardData.image" 
                alt="卡图片" 
                class="card-image"
              />
              <div v-else class="no-image">暂无图片</div>
            </div>
          </el-col>
          <el-col :span="16">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="ID">{{ cardData.id }}</el-descriptions-item>
              <el-descriptions-item label="卡名称">{{ cardData.name }}</el-descriptions-item>
              <el-descriptions-item label="价格">¥{{ cardData.price }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusTagType(cardData.status)">
                  {{ getStatusLabel(cardData.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ formatDate(cardData.created_at) }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ formatDate(cardData.updated_at) }}</el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">
                <div class="description">{{ cardData.description || '无' }}</div>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <!-- 关联商品 -->
        <div v-if="cardData.products && cardData.products.length > 0" class="related-products">
          <h4>关联商品</h4>
          <el-table :data="cardData.products" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="商品名称" min-width="150" />
            <el-table-column prop="price" label="价格" width="100" />
            <el-table-column prop="category_name" label="分类" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '上架' : '下架' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button 
                  type="primary" 
                  size="small" 
                  link
                  @click="viewProduct(scope.row.id)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button 
            v-if="cardData.status === 'inactive'" 
            type="success" 
            @click="handleToggleStatus"
          >
            上架
          </el-button>
          <el-button 
            v-if="cardData.status === 'active'" 
            type="warning" 
            @click="handleToggleStatus"
          >
            下架
          </el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCardDetail, deleteCard, updateCardStatus } from '@/api/card'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const cardData = ref(null)

// 获取卡ID
const cardId = route.params.id

// 获取状态标签类型
const getStatusTagType = (status) => {
  return status === 'active' ? 'success' : 'danger'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  return status === 'active' ? '上架' : '下架'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 获取卡详情
const fetchCardDetail = async () => {
  loading.value = true
  try {
    const response = await getCardDetail(cardId)
    if (response.success) {
      cardData.value = response.data
    } else {
      ElMessage.error(response.message || '获取卡详情失败')
      router.push('/cards/list')
    }
  } catch (error) {
    console.error('获取卡详情失败:', error)
    ElMessage.error('获取卡详情失败，请检查网络连接')
    router.push('/cards/list')
  } finally {
    loading.value = false
  }
}

// 编辑卡
const handleEdit = () => {
  router.push(`/cards/edit/${cardId}`)
}

// 切换卡状态
const handleToggleStatus = async () => {
  const action = cardData.value.status === 'active' ? '下架' : '上架'
  try {
    await ElMessageBox.confirm(`确定要${action}这张卡吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const newStatus = cardData.value.status === 'active' ? 'inactive' : 'active'
    const response = await updateCardStatus(cardId, newStatus)
    
    if (response.success) {
      ElMessage.success(`${action}成功`)
      fetchCardDetail()
    } else {
      ElMessage.error(response.message || `${action}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败，请检查网络连接`)
    }
  }
}

// 删除卡
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await deleteCard(cardId)
    
    if (response.success) {
      ElMessage.success('删除成功')
      router.push('/cards/list')
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请检查网络连接')
    }
  }
}

// 查看商品详情
const viewProduct = (productId) => {
  router.push(`/products/detail/${productId}`)
}

// 返回列表
const handleBack = () => {
  router.push('/cards/list')
}

// 初始化
onMounted(() => {
  fetchCardDetail()
})
</script>

<style scoped>
.card-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.card-content {
  padding: 20px 0;
}

.card-image-container {
  text-align: center;
  margin-bottom: 20px;
}

.card-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.no-image {
  width: 200px;
  height: 200px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  border-radius: 4px;
  margin: 0 auto;
}

.description {
  white-space: pre-wrap;
  line-height: 1.5;
}

.related-products {
  margin-top: 30px;
}

.related-products h4 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #303133;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
}

.action-buttons .el-button {
  margin: 0 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-detail-container {
    padding: 10px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .el-col {
    margin-bottom: 20px;
  }
}
</style>