<template>
  <div class="card-list">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="卡名称">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入卡名称/描述"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable @change="handleCategoryChange">
            <el-option label="全部分类" value="" />
            <el-option
              v-for="category in categoryOptions"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="子分类">
          <el-select v-model="searchForm.subCategoryId" placeholder="请选择子分类" clearable>
            <el-option label="全部子分类" value="" />
            <el-option
              v-for="subCategory in subCategoryOptions"
              :key="subCategory.id"
              :label="subCategory.name"
              :value="subCategory.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="未使用" value="unused" />
            <el-option label="已使用" value="used" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增卡
      </el-button>
      <el-button type="success" @click="showImportDialog = true">
        <el-icon><Upload /></el-icon>
        导入卡
      </el-button>
      <el-button @click="showExportDialog = true">
        <el-icon><Download /></el-icon>
        导出数据
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="title" label="卡名称" min-width="150" />
<el-table-column prop="categoryName" label="分类" width="120" />
<el-table-column prop="subCategoryName" label="子分类" width="120" />
<el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
  <el-tag :type="getStatusTagType(row.status)">
    {{ getStatusLabel(row.status) }}
  </el-tag>
</template>
        </el-table-column>
        <el-table-column prop="viewCount" label="查看次数" width="100" />
        <el-table-column prop="isFavorite" label="收藏" width="80">
          <template #default="{ row }">
            <el-icon :color="row.isFavorite ? '#f56c6c' : '#ccc'" style="cursor: pointer" @click="handleToggleFavorite(row)">
              <StarFilled v-if="row.isFavorite" />
              <Star v-else />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
<el-table-column prop="updatedAt" label="更新时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              v-if="row.cardStatus === 'disabled'" 
              link 
              type="success" 
              @click="handleEnable(row)"
            >
              启用
            </el-button>
            <el-button 
              v-if="row.cardStatus === 'unused' || row.cardStatus === 'used'" 
              link 
              type="warning" 
              @click="handleDisable(row)"
            >
              禁用
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
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
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="showImportDialog" title="导入卡数据" width="500px">
      <div class="import-dialog">
        <div class="import-tips">
          <p>支持格式：Excel (.xlsx, .xls), CSV (.csv)</p>
          <p>文件大小限制：10MB</p>
        </div>
        
        <div class="import-actions">
          <el-button type="primary" @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
          <el-button type="success" @click="handleFileSelect">
            <el-icon><Upload /></el-icon>
            选择文件
          </el-button>
        </div>
        
        <div v-if="selectedFile" class="file-info">
          <el-icon><Document /></el-icon>
          <span>{{ selectedFile.name }}</span>
          <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          :loading="importLoading" 
          :disabled="!selectedFile"
          @click="handleImport"
        >
          开始导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog v-model="showExportDialog" title="导出卡数据" width="500px">
      <div class="export-dialog">
        <div class="export-tips">
          <p>导出格式：Excel (.xlsx)</p>
          <p>导出范围：当前筛选条件下的所有数据</p>
        </div>
        
        <div class="export-options">
          <el-form :model="exportForm" label-width="80px">
            <el-form-item label="导出范围">
              <el-radio-group v-model="exportForm.range">
                <el-radio label="current">当前页数据</el-radio>
                <el-radio label="all">全部数据</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文件格式">
              <el-radio-group v-model="exportForm.format">
                <el-radio label="xlsx">Excel (.xlsx)</el-radio>
                <el-radio label="csv">CSV (.csv)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          :loading="exportLoading" 
          @click="handleExport"
        >
          开始导出
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Upload, Document, Star, StarFilled } from '@element-plus/icons-vue'
import type { CardInfo, CardQueryParams } from '@/types'
import { cardApi } from '@/api/card'
import { categoryApi } from '@/api/category'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  title: '',
  categoryId: undefined as number | undefined,
  subCategoryId: undefined as number | undefined,
  status: '' as string | undefined,
  isFavorite: false
})

// 分类数据
const categoryOptions = ref<{ id: number; name: string }[]>([])
const subCategoryOptions = ref<{ id: number; name: string }[]>([])

// 表格数据
const tableData = ref<CardInfo[]>([])
const loading = ref(false)

// 导入相关
const showImportDialog = ref(false)
const importLoading = ref(false)
const selectedFile = ref<File | null>(null)

// 导出相关
const showExportDialog = ref(false)
const exportLoading = ref(false)
const exportForm = reactive({
  range: 'all',
  format: 'xlsx'
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 枚举数据
const cardStatuses = [
  { value: 'unused', label: '未使用' },
  { value: 'used', label: '已使用' },
  { value: 'disabled', label: '已禁用' }
]

// 获取标签类型
const getStatusTagType = (status: string) => {
  const map: Record<string, string> = {
    'unused': 'info',
    'used': 'success',
    'disabled': 'danger'
  }
  return map[status] || ''
}

// 获取标签文本
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'unused': '未使用',
    'used': '已使用',
    'disabled': '已禁用'
  }
  return map[status] || '未知'
}

// 加载分类数据
const loadCategories = async () => {
  try {
    const response = await categoryApi.getCategories({ page: 1, size: 1000 })
    categoryOptions.value = response.records.map(item => ({
      id: item.id!,
      name: item.name
    }))
  } catch (error) {
    console.error('加载分类数据失败:', error)
  }
}

// 分类变化时加载子分类
const handleCategoryChange = async (categoryId: number | undefined) => {
  if (!categoryId) {
    subCategoryOptions.value = []
    searchForm.subCategoryId = undefined
    return
  }
  
  try {
    const response = await categoryApi.getSubCategoryList(categoryId, { page: 1, size: 1000 })
    subCategoryOptions.value = response.records.map(item => ({
      id: item.id!,
      name: item.name
    }))
    searchForm.subCategoryId = undefined
  } catch (error) {
    console.error('加载子分类数据失败:', error)
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params: CardQueryParams = {
      page: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    const response = await cardApi.getCards(params)
    tableData.value = response.records
    pagination.total = response.total
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    title: '',
    categoryId: undefined,
    subCategoryId: undefined,
    status: undefined,
    isFavorite: false
  })
  subCategoryOptions.value = []
  handleSearch()
}

// 新增
const handleAdd = () => {
  router.push('/cards/add')
}

// 查看
const handleView = (row: CardInfo) => {
  router.push(`/cards/detail/${row.id}`)
}

// 编辑
const handleEdit = (row: CardInfo) => {
  router.push(`/cards/edit/${row.id}`)
}

// 启用
const handleEnable = async (row: CardInfo) => {
  try {
    await ElMessageBox.confirm('确定要启用这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cardApi.updateCardStatus(row.id!, 'unused')
    ElMessage.success('启用成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 禁用
const handleDisable = async (row: CardInfo) => {
  try {
    await ElMessageBox.confirm('确定要禁用这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cardApi.updateCardStatus(row.id!, 'disabled')
    ElMessage.success('禁用成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 删除
const handleDelete = async (row: CardInfo) => {
  try {
    await ElMessageBox.confirm('确定要删除这张卡吗？删除后将进入回收站', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cardApi.deleteCard(row.id!)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 切换收藏状态
const handleToggleFavorite = async (row: CardInfo) => {
  try {
    await cardApi.toggleFavoriteStatus(row.id!)
    ElMessage.success(row.isFavorite ? '已取消收藏' : '已收藏')
    loadData()
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    ElMessage.error('操作失败')
  }
}

// 文件选择
const handleFileSelect = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls,.csv'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    // 检查文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过10MB')
      return
    }
    
    // 检查文件类型
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      ElMessage.error('请选择Excel或CSV格式的文件')
      return
    }
    
    selectedFile.value = file
  }
  input.click()
}

// 导入
const handleImport = async () => {
  if (!selectedFile.value) return
  
  try {
    importLoading.value = true
    await cardApi.importCards(selectedFile.value)
    ElMessage.success('导入成功')
    showImportDialog.value = false
    selectedFile.value = null
    loadData()
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败，请检查文件格式')
  } finally {
    importLoading.value = false
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response = await cardApi.downloadTemplate()
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '卡导入模板.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('下载模板失败:', error)
    ElMessage.error('下载模板失败')
  }
}

// 导出
const handleExport = async () => {
  try {
    exportLoading.value = true
    
    // 构建导出参数
    const params: CardQueryParams = {
      ...searchForm
    }
    
    if (exportForm.range === 'current') {
      params.page = pagination.current
      params.size = pagination.size
    } else {
      params.page = 1
      params.size = pagination.total
    }
    
    const response = await cardApi.exportCards(params)
    
    // 创建下载链接
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // 设置文件名
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const extension = exportForm.format === 'csv' ? 'csv' : 'xlsx'
    link.download = `卡数据_${timestamp}.${extension}`
    
    link.href = url
    link.click()
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
    showExportDialog.value = false
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadData()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  loadData()
}

onMounted(() => {
  loadCategories()
  loadData()
})
</script>

<style scoped>
.card-list {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.import-dialog {
  text-align: center;
}

.import-tips {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.import-tips p {
  margin: 5px 0;
}

.import-actions {
  margin-bottom: 20px;
}

.import-actions .el-button {
  margin: 0 10px;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;
}

.file-info .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.file-size {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

.export-dialog {
  text-align: center;
}

.export-tips {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.export-tips p {
  margin: 5px 0;
}

.export-options {
  text-align: left;
}

.export-options .el-form-item {
  margin-bottom: 15px;
}
</style>