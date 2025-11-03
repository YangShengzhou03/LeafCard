<template>
  <el-dialog
    v-model="visible"
    :title="`管理子分类 - ${category?.name}`"
    width="800px"
    :before-close="handleClose"
  >
    <!-- 操作区域 -->
    <div class="operation-container">
      <el-button type="primary" @click="handleAddSubCategory">
        <el-icon><Plus /></el-icon>
        添加子分类
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 子分类列表 -->
    <div class="table-container">
      <el-table
        :data="subCategoryList"
        v-loading="loading"
        row-key="id"
      >
        <el-table-column prop="name" label="子分类名称" min-width="150">
          <template #default="{ row }">
            <div class="subcategory-name">
              <el-icon v-if="row.icon" :size="14">
                <component :is="row.icon" />
              </el-icon>
              <span>{{ row.name }}</span>
              <el-tag v-if="row.level" size="small" type="info">L{{ row.level }}</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="level" label="等级" width="80" align="center">
          <template #default="{ row }">
            <span class="level-badge">L{{ row.level }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="cardCount" label="卡片数量" width="100" align="center">
          <template #default="{ row }">
            <span :class="{ 'text-primary': row.cardCount > 0 }">{{ row.cardCount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
        
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑子分类对话框 -->
    <sub-category-form-dialog
      v-model="formDialogVisible"
      :sub-category="currentSubCategory"
      :category-id="category?.id"
      :mode="formDialogMode"
      @success="handleFormDialogSuccess"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import type { CardCategory, CardSubCategory } from '@/types'
import categoryApi from '@/api/category'
import SubCategoryFormDialog from './SubCategoryFormDialog.vue'

// Props
interface Props {
  modelValue: boolean
  category?: CardCategory | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// 响应式数据
const visible = ref(false)
const loading = ref(false)
const formDialogVisible = ref(false)
const formDialogMode = ref<'add' | 'edit'>('add')
const currentSubCategory = ref<CardSubCategory | null>(null)

const subCategoryList = ref<CardSubCategory[]>([])

// 方法
const loadSubCategories = async () => {
  if (!props.category?.id) return

  try {
    loading.value = true
    const data = await categoryApi.getSubCategories(props.category.id)
    subCategoryList.value = data
  } catch (error) {
    ElMessage.error('获取子分类列表失败')
    console.error('获取子分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAddSubCategory = () => {
  currentSubCategory.value = null
  formDialogMode.value = 'add'
  formDialogVisible.value = true
}

const handleEdit = (subCategory: CardSubCategory) => {
  currentSubCategory.value = { ...subCategory }
  formDialogMode.value = 'edit'
  formDialogVisible.value = true
}

const handleDelete = async (subCategory: CardSubCategory) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除子分类"${subCategory.name}"吗？此操作将同时删除该子分类下的所有卡片。`,
      '确认删除',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    await categoryApi.deleteSubCategory(subCategory.id!)
    ElMessage.success('删除成功')
    loadSubCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

const handleStatusChange = async (subCategory: CardSubCategory) => {
  try {
    await categoryApi.toggleSubCategoryStatus(subCategory.id!)
    ElMessage.success('状态更新成功')
  } catch (error) {
    // 回滚状态
    subCategory.status = subCategory.status === 1 ? 0 : 1
    ElMessage.error('状态更新失败')
    console.error('状态更新失败:', error)
  }
}

const handleRefresh = () => {
  loadSubCategories()
}

const handleFormDialogSuccess = () => {
  formDialogVisible.value = false
  loadSubCategories()
}

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 监听props变化
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    
    if (val && props.category?.id) {
      loadSubCategories()
    }
  },
  { immediate: true }
)

// 监听分类变化
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory?.id && visible.value) {
      loadSubCategories()
    }
  }
)
</script>

<style scoped>
.operation-container {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.subcategory-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-badge {
  display: inline-block;
  padding: 2px 6px;
  background: #f4f4f5;
  color: #909399;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.text-primary {
  color: #409eff;
  font-weight: 600;
}
</style>