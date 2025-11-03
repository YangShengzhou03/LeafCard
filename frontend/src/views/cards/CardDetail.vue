<template>
  <div class="card-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>卡详情</span>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="卡名称">{{ cardData.cardName }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ cardData.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="子分类">{{ cardData.subCategoryName }}</el-descriptions-item>
        <el-descriptions-item label="卡状态">
          <el-tag :type="getStatusTagType(cardData.cardStatus)">
            {{ getStatusLabel(cardData.cardStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="收藏状态">
          <el-tag :type="cardData.isFavorite ? 'success' : 'info'">
            {{ cardData.isFavorite ? '已收藏' : '未收藏' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ cardData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ cardData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="卡内容" :span="2">
          <div style="white-space: pre-wrap;">{{ cardData.content || '无' }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 操作按钮 -->
      <div class="action-buttons" style="margin-top: 20px;">
        <el-button 
          v-if="cardData.cardStatus === 'disabled'" 
          type="success" 
          @click="handleEnable"
        >
          启用
        </el-button>
        <el-button 
          v-if="cardData.cardStatus === 'unused' || cardData.cardStatus === 'used'" 
          type="warning" 
          @click="handleDisable"
        >
          禁用
        </el-button>
        <el-button 
          :type="cardData.isFavorite ? 'warning' : 'info'" 
          @click="handleToggleFavorite"
        >
          {{ cardData.isFavorite ? '取消收藏' : '收藏' }}
        </el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { CardInfo } from '@/types'
import { cardApi } from '@/api/card'

const route = useRoute()
const router = useRouter()

const cardData = ref<CardInfo>({
  cardName: '',
  categoryName: '',
  subCategoryName: '',
  cardStatus: 0,
  isFavorite: false,
  content: ''
})

const getStatusTagType = (status: string) => {
  const map: Record<string, string> = {
    'unused': 'info',
    'used': 'success',
    'disabled': 'danger'
  }
  return map[status] || ''
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'unused': '未使用',
    'used': '已使用',
    'disabled': '已禁用'
  }
  return map[status] || '未知'
}

// 加载卡详情
const loadCardDetail = async () => {
  try {
    const { id } = route.params
    const data = await cardApi.getCard(Number(id))
    cardData.value = data
  } catch (error) {
    ElMessage.error('加载卡详情失败')
    router.back()
  }
}

// 编辑
const handleEdit = () => {
  router.push(`/cards/edit/${route.params.id}`)
}

// 启用
const handleEnable = async () => {
  try {
    await ElMessageBox.confirm('确定要启用这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cardApi.updateCardStatus(cardData.value.id!, 'unused')
    ElMessage.success('启用成功')
    loadCardDetail()
  } catch (error) {
    // 用户取消操作
  }
}

// 禁用
const handleDisable = async () => {
  try {
    await ElMessageBox.confirm('确定要禁用这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cardApi.updateCardStatus(cardData.value.id!, 'disabled')
    ElMessage.success('禁用成功')
    loadCardDetail()
  } catch (error) {
    // 用户取消操作
  }
}

// 切换收藏状态
const handleToggleFavorite = async () => {
  try {
    await cardApi.toggleFavorite(cardData.value.id!)
    ElMessage.success(cardData.value.isFavorite ? '取消收藏成功' : '收藏成功')
    loadCardDetail()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这张卡吗？删除后将进入回收站。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cardApi.deleteCard(cardData.value.id!)
    ElMessage.success('删除成功')
    router.push('/cards')
  } catch (error) {
    // 用户取消操作
  }
}

// 返回
const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadCardDetail()
})
</script>

<style scoped>
.card-detail {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.action-buttons {
  text-align: center;
}
</style>