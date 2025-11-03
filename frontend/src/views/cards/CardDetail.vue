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
        <el-descriptions-item label="卡号">{{ cardData.cardNumber }}</el-descriptions-item>
        <el-descriptions-item label="卡等级">
          <el-tag :type="getLevelTagType(cardData.cardLevel)">
            {{ cardData.cardLevel }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="商品类别">{{ cardData.productCategory }}</el-descriptions-item>
        <el-descriptions-item label="卡状态">
          <el-tag :type="getStatusTagType(cardData.cardStatus)">
            {{ getStatusLabel(cardData.cardStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ cardData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="激活时间">{{ cardData.activateTime || '未激活' }}</el-descriptions-item>
        <el-descriptions-item label="使用时间">{{ cardData.useTime || '未使用' }}</el-descriptions-item>
        <el-descriptions-item label="过期时间">{{ cardData.expireTime || '永久有效' }}</el-descriptions-item>
        <el-descriptions-item label="使用者ID">{{ cardData.userId || '未使用' }}</el-descriptions-item>
        <el-descriptions-item label="使用者IP">{{ cardData.userIp || '未使用' }}</el-descriptions-item>
        <el-descriptions-item label="补充次数">{{ cardData.rechargeTimes }}</el-descriptions-item>
        <el-descriptions-item label="最后补充时间">{{ cardData.lastRechargeTime || '未补充' }}</el-descriptions-item>
        <el-descriptions-item label="UUID" :span="2">{{ cardData.uuid }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          <div style="white-space: pre-wrap;">{{ cardData.remark || '无' }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 操作按钮 -->
      <div class="action-buttons" style="margin-top: 20px;">
        <el-button 
          v-if="cardData.cardStatus === 0" 
          type="success" 
          @click="handleActivate"
        >
          激活卡
        </el-button>
        <el-button 
          v-if="cardData.cardStatus === 1" 
          type="warning" 
          @click="handleRecharge"
        >
          补充卡
        </el-button>
        <el-button type="danger" @click="handleDelete">删除卡</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Card } from '@/api/card'
import { getCardDetail, deleteCard, activateCard, rechargeCard } from '@/api/card'

const route = useRoute()
const router = useRouter()

const cardData = ref<Card>({
  cardNumber: '',
  cardLevel: '',
  productCategory: '',
  cardStatus: 0,
  rechargeTimes: 0
})

// 获取标签类型
const getLevelTagType = (level: string) => {
  const map: Record<string, string> = {
    '普通会员': '',
    '超级会员': 'warning',
    '钻石会员': 'success'
  }
  return map[level] || ''
}

const getStatusTagType = (status: number) => {
  const map: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: '',
    3: 'warning',
    4: 'danger'
  }
  return map[status] || ''
}

// 获取状态标签
const getStatusLabel = (status: number) => {
  const map: Record<number, string> = {
    0: '未激活',
    1: '已激活',
    2: '已使用',
    3: '已过期',
    4: '已冻结'
  }
  return map[status] || '未知'
}

// 加载卡详情
const loadCardDetail = async () => {
  try {
    const { id } = route.params
    const data = await getCardDetail(Number(id))
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

// 激活
const handleActivate = async () => {
  try {
    await ElMessageBox.confirm('确定要激活这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await activateCard(cardData.value.id!)
    ElMessage.success('激活成功')
    loadCardDetail()
  } catch (error) {
    // 用户取消操作
  }
}

// 补充
const handleRecharge = async () => {
  try {
    await ElMessageBox.confirm('确定要补充这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await rechargeCard(cardData.value.id!)
    ElMessage.success('补充成功')
    loadCardDetail()
  } catch (error) {
    // 用户取消操作
  }
}

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteCard(cardData.value.id!)
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