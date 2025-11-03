<template>
  <div class="spec-list">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="规格名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入规格名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="规格类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="文本" value="text" />
            <el-option label="数字" value="number" />
            <el-option label="选项" value="option" />
            <el-option label="布尔" value="boolean" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
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
        新增规格
      </el-button>
      <el-button @click="handleBatchDelete" :disabled="selectedIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="规格名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="code" label="规格编码" width="120" />
        <el-table-column prop="type" label="规格类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填" width="100">
          <template #default="{ row }">
            <el-tag :type="row.required ? 'success' : 'info'">
              {{ row.required ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" width="120" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleView(row)">查看</el-button>
            <el-button 
              type="warning" 
              link 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { specificationApi, batchDeleteSpecifications, getSpecifications, deleteSpecification } from '@/api/specification'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: '',
  status: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const selectedIds = ref([])

onMounted(() => {
  loadSpecificationList()
})

// 加载规格列表
const loadSpecificationList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.size,
      ...searchForm
    }
    
    const response = await getSpecifications(params)
    if (response.success && response.data) {
      tableData.value = response.data.list || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.message || '获取规格列表失败')
    }
  } catch (error) {
    console.error('加载规格列表失败:', error)
    ElMessage.error('获取规格列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  loadSpecificationList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    type: '',
    status: ''
  })
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  loadSpecificationList()
}

// 当前页改变
const handleCurrentChange = (current) => {
  pagination.current = current
  loadSpecificationList()
}

// 选择改变
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增规格
const handleAdd = () => {
  router.push('/specifications/add')
}

// 编辑规格
const handleEdit = (row) => {
  router.push(`/specifications/edit/${row.id}`)
}

// 查看规格
const handleView = (row) => {
  router.push(`/specifications/detail/${row.id}`)
}

// 切换规格状态
const handleToggleStatus = async (row) => {
  try {
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    const response = await specificationApi.updateSpecificationStatus(row.id, newStatus)
    if (response.success) {
      ElMessage.success('状态更新成功')
      loadSpecificationList()
    } else {
      ElMessage.error(response.message || '状态更新失败')
    }
  } catch (error) {
    console.error('切换状态失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 删除规格
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规格"${row.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteSpecification(row.id)
    if (response.success) {
      ElMessage.success('删除成功')
      loadSpecificationList()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的规格')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个规格吗？此操作不可恢复。`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await batchDeleteSpecifications(selectedIds.value)
    if (response.success) {
      ElMessage.success('批量删除成功')
      selectedIds.value = []
      loadSpecificationList()
    } else {
      ElMessage.error(response.message || '批量删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
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

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<style scoped>
.spec-list {
  padding: 20px;
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
</style>