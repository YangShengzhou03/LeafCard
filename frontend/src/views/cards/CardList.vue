<template>
  <div class="card-list-container">
    <el-card class="filter-card">
      <el-form :model="filterForm" :inline="true" class="filter-form">
        <el-form-item label="卡名称">
          <el-input
            v-model="filterForm.name"
            placeholder="请输入卡名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            @clear="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetFilter">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-header">
        <h3>卡列表</h3>
        <div class="table-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增卡
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="cardList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="卡名称" min-width="120" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              size="small"
              link
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '下架' : '上架' }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 卡详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="卡详情"
      width="600px"
    >
      <div v-if="currentCard" class="card-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ currentCard.id }}</el-descriptions-item>
          <el-descriptions-item label="卡名称">{{ currentCard.name }}</el-descriptions-item>
          <el-descriptions-item label="价格">{{ currentCard.price }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentCard.status === 'active' ? 'success' : 'danger'">
              {{ currentCard.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentCard.description }}</el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ formatDate(currentCard.created_at) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ formatDate(currentCard.updated_at) }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import { useCardsStore } from '@/stores/cards'
import { getCards, deleteCard, updateCardStatus } from '@/api/card'

const router = useRouter()
const cardsStore = useCardsStore()
const loading = ref(false)
const cardList = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentCard = ref(null)

// 筛选表单
const filterForm = reactive({
  name: '',
  status: '',
  dateRange: []
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取卡列表
const fetchCardList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      limit: pagination.pageSize,
      name: filterForm.name,
      status: filterForm.status,
      start_date: filterForm.dateRange?.[0],
      end_date: filterForm.dateRange?.[1]
    }
    
    const response = await getCards(params)
    if (response.success) {
      cardList.value = response.data.list
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取卡列表失败')
    }
  } catch (error) {
    console.error('获取卡列表失败:', error)
    ElMessage.error('获取卡列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchCardList()
}

// 重置筛选
const resetFilter = () => {
  filterForm.name = ''
  filterForm.status = ''
  filterForm.dateRange = []
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchCardList()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchCardList()
}

// 选择行
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 新增卡
const handleAdd = () => {
  router.push('/cards/add')
}

// 查看卡详情
const handleView = (row) => {
  currentCard.value = row
  detailDialogVisible.value = true
}

// 编辑卡
const handleEdit = (row) => {
  router.push(`/cards/edit/${row.id}`)
}

// 切换卡状态
const handleToggleStatus = async (row) => {
  const action = row.status === 'active' ? '下架' : '上架'
  try {
    await ElMessageBox.confirm(`确定要${action}这张卡吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    const response = await updateCardStatus(row.id, newStatus)
    
    if (response.success) {
      ElMessage.success(`${action}成功`)
      fetchCardList()
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
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await deleteCard(row.id)
    
    if (response.success) {
      ElMessage.success('删除成功')
      fetchCardList()
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

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的卡')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}张卡吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const ids = selectedRows.value.map(row => row.id)
    // 这里假设有一个批量删除的API
    // const response = await batchDeleteCards(ids)
    
    // 临时方案：逐个删除
    let successCount = 0
    for (const id of ids) {
      try {
        const response = await deleteCard(id)
        if (response.success) {
          successCount++
        }
      } catch (error) {
        console.error(`删除ID为${id}的卡失败:`, error)
      }
    }
    
    if (successCount === ids.length) {
      ElMessage.success('批量删除成功')
    } else {
      ElMessage.warning(`成功删除${successCount}张卡，失败${ids.length - successCount}张`)
    }
    
    fetchCardList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败，请检查网络连接')
    }
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 初始化
onMounted(() => {
  fetchCardList()
})
</script>

<style scoped>
.card-list-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.card-detail {
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-list-container {
    padding: 10px;
  }
  
  .filter-form {
    flex-direction: column;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .table-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>