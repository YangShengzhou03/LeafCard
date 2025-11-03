<template>
  <div class="spec-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>规格详情</span>
          <div>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
            <el-button @click="handleBack">返回</el-button>
          </div>
        </div>
      </template>

      <div v-if="specificationInfo" class="detail-content">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="规格名称">{{ specificationInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="规格编码">{{ specificationInfo.code }}</el-descriptions-item>
          <el-descriptions-item label="规格类型">
            <el-tag :type="getTypeTagType(specificationInfo.type)">
              {{ getTypeLabel(specificationInfo.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否必填">
            <el-tag :type="specificationInfo.required ? 'success' : 'info'">
              {{ specificationInfo.required ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="默认值">
            {{ formatDefaultValue(specificationInfo) }}
          </el-descriptions-item>
          <el-descriptions-item label="排序">{{ specificationInfo.sortOrder }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(specificationInfo.status)">
              {{ getStatusLabel(specificationInfo.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(specificationInfo.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(specificationInfo.updatedAt) }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ specificationInfo.remark || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 选项列表（仅选项类型显示） -->
        <div v-if="specificationInfo.type === 'option'" class="section">
          <h3>选项列表</h3>
          <el-table :data="specificationInfo.options" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="label" label="选项名称" />
            <el-table-column prop="value" label="选项值" />
          </el-table>
        </div>

        <!-- 数值范围（仅数字类型显示） -->
        <div v-if="specificationInfo.type === 'number'" class="section">
          <h3>数值范围</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="最小值">{{ specificationInfo.minValue || '无限制' }}</el-descriptions-item>
            <el-descriptions-item label="最大值">{{ specificationInfo.maxValue || '无限制' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 使用记录 -->
        <div v-if="specificationInfo.usageRecords && specificationInfo.usageRecords.length > 0" class="section">
          <h3>使用记录</h3>
          <el-table :data="specificationInfo.usageRecords" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="productCode" label="商品编码" />
            <el-table-column prop="value" label="规格值" />
            <el-table-column prop="createdAt" label="使用时间">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSpecificationDetail } from '@/api/specification'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const specificationInfo = ref(null)

// 规格ID
const specificationId = ref(route.params.id)

onMounted(() => {
  loadSpecificationDetail()
})

// 加载规格详情
const loadSpecificationDetail = async () => {
  loading.value = true
  try {
    const response = await getSpecificationDetail(specificationId.value)
    if (response.success && response.data) {
      specificationInfo.value = response.data
    } else {
      ElMessage.error(response.message || '获取规格详情失败')
      router.push('/specifications/list')
    }
  } catch (error) {
    console.error('加载规格详情失败:', error)
    ElMessage.error('获取规格详情失败')
    router.push('/specifications/list')
  } finally {
    loading.value = false
  }
}

// 类型标签类型
const getTypeTagType = (type) => {
  switch (type) {
    case 'text': return 'primary'
    case 'number': return 'success'
    case 'option': return 'warning'
    case 'boolean': return 'info'
    default: return 'info'
  }
}

// 类型标签文本
const getTypeLabel = (type) => {
  switch (type) {
    case 'text': return '文本'
    case 'number': return '数字'
    case 'option': return '选项'
    case 'boolean': return '布尔'
    default: return type
  }
}

// 状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'info'
    default: return 'info'
  }
}

// 状态标签文本
const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return '启用'
    case 'inactive': return '禁用'
    default: return status
  }
}

// 格式化默认值
const formatDefaultValue = (specification) => {
  if (specification.type === 'boolean') {
    return specification.defaultValue ? '是' : '否'
  }
  return specification.defaultValue || '无'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '无'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 编辑规格
const handleEdit = () => {
  router.push(`/specifications/edit/${specificationId.value}`)
}

// 返回列表
const handleBack = () => {
  router.push('/specifications/list')
}
</script>

<style scoped>
.spec-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content {
  margin-top: 20px;
}

.section {
  margin-top: 30px;
}

.section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}
</style>