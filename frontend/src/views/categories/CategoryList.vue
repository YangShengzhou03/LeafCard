<template>
  <div class="category-list">
    <!-- 搜索和操作区域 -->
    <div class="search-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchParams.keyword"
            placeholder="搜索分类名称"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="searchParams.status"
            placeholder="状态筛选"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 分类列表 -->
    <div class="table-container">
      <el-table
        :data="categoryList"
        v-loading="loading"
        row-key="id"
        :tree-props="{ children: 'subCategories', hasChildren: 'hasSubCategories' }"
      >
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <div class="category-name">
              <el-icon v-if="row.icon" :size="16">
                <component :is="row.icon" />
              </el-icon>
              <span class="name-text">{{ row.name }}</span>
              <el-tag v-if="row.isDefault" size="small" type="success">默认</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="cardCount" label="卡片数量" width="100" align="center">
          <template #default="{ row }">
            <span :class="{ 'text-primary': row.cardCount > 0 }">{{ row.cardCount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="subCategoryCount" label="子分类数量" width="120" align="center">
          <template #default="{ row }">
            <span :class="{ 'text-primary': row.subCategoryCount > 0 }">{{ row.subCategoryCount }}</span>
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
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="primary" link @click="handleManageSubCategories(row)">
              <el-icon><Folder /></el-icon>
              子分类
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑分类对话框 -->
    <category-form-dialog
      v-model="dialogVisible"
      :category="currentCategory"
      :mode="dialogMode"
      @success="handleDialogSuccess"
    />

    <!-- 子分类管理对话框 -->
    <sub-category-dialog
      v-model="subCategoryDialogVisible"
      :category="currentCategory"
      @success="handleSubCategorySuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Refresh, Edit, Delete, Folder } from '@element-plus/icons-vue'
import type { CardCategory, CardCategoryQueryParams } from '@/types'
import categoryApi from '@/api/category'
import CategoryFormDialog from './components/CategoryFormDialog.vue'
import SubCategoryDialog from './components/SubCategoryDialog.vue'

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const subCategoryDialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const currentCategory = ref<CardCategory | null>(null)

const categoryList = ref<CardCategory[]>([])

const searchParams = reactive<CardCategoryQueryParams>({
  keyword: '',
  status: undefined,
  page: 1,
  size: 20
})

const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 方法
const loadCategories = async () => {
  try {
    loading.value = true
    const response = await categoryApi.getCategories(searchParams)
    categoryList.value = response.records
    pagination.total = response.total
    pagination.current = response.current
    pagination.size = response.size
  } catch (error) {
    ElMessage.error('获取分类列表失败')
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchParams.page = 1
  loadCategories()
}

const handleRefresh = () => {
  loadCategories()
}

const handleAdd = () => {
  currentCategory.value = null
  dialogMode.value = 'add'
  dialogVisible.value = true
}

const handleEdit = (category: CardCategory) => {
  currentCategory.value = { ...category }
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

const handleDelete = async (category: CardCategory) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${category.name}"吗？此操作将同时删除该分类下的所有子分类和卡片。`,
      '确认删除',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    await categoryApi.deleteCategory(category.id!)
    ElMessage.success('删除成功')
    loadCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

const handleStatusChange = async (category: CardCategory) => {
  try {
    await categoryApi.toggleCategoryStatus(category.id!)
    ElMessage.success('状态更新成功')
  } catch (error) {
    // 回滚状态
    category.status = category.status === 1 ? 0 : 1
    ElMessage.error('状态更新失败')
    console.error('状态更新失败:', error)
  }
}

const handleManageSubCategories = (category: CardCategory) => {
  currentCategory.value = category
  subCategoryDialogVisible.value = true
}

const handleDialogSuccess = () => {
  dialogVisible.value = false
  loadCategories()
}

const handleSubCategorySuccess = () => {
  subCategoryDialogVisible.value = false
  loadCategories()
}

const handleSizeChange = (size: number) => {
  searchParams.size = size
  searchParams.page = 1
  loadCategories()
}

const handleCurrentChange = (page: number) => {
  searchParams.page = page
  loadCategories()
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-list {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.search-container {
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}

.table-container {
  margin-bottom: 20px;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-text {
  flex: 1;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.text-primary {
  color: #409eff;
  font-weight: 600;
}
</style>