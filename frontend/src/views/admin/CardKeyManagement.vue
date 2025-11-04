<template>
  <div class="admin-cardkey-management">
    <el-card class="cardkey-card">
      <template #header>
        <div class="card-header">
          <span>卡密管理</span>
          <el-button type="primary" @click="handleAddCardKey">
            <el-icon><Plus /></el-icon>
            生成卡密
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-input
              v-model="searchQuery"
              placeholder="搜索卡密代码或用户邮箱"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="statusFilter" placeholder="卡密状态" clearable>
              <el-option label="未使用" value="unused" />
              <el-option label="已使用" value="used" />
              <el-option label="已禁用" value="disabled" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
            <el-button type="danger" @click="handleClearUsed">清空已使用</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 卡密列表 -->
      <div class="table-container">
        <el-table 
          :data="filteredCardKeys" 
          v-loading="loading" 
          stripe
          style="width: 100%"
          :scroll="{ x: 800 }"
          :header-cell-style="{ textAlign: 'center', background: '#f5f7fa' }"
          :cell-style="{ textAlign: 'center' }"
        >
          <el-table-column prop="cardKey" label="卡密代码" width="180" align="center" :show-overflow-tooltip="true">
            <template #default="{ row }">
              <span class="cardkey-code" @click="copyCardKey(row.cardKey)" style="cursor: pointer;">{{ row.cardKey }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productSpec" label="商品规格" width="140" align="center" :show-overflow-tooltip="true">
            <template #default="{ row }">
              {{ row.productSpec || '未设置' }}
            </template>
          </el-table-column>
          <el-table-column prop="activateTime" label="使用时间" width="160" align="center" :show-overflow-tooltip="true">
            <template #default="{ row }">
              {{ row.activateTime || '未使用' }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <el-button 
                size="small" 
                type="warning" 
                @click="handleDisableCardKey(row)"
                :disabled="row.status === 'used' || row.status === 'disabled'"
              >
                禁用
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDeleteCardKey(row)"
                :disabled="row.status === 'used'"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 生成卡密对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="生成卡密"
      width="500px"
    >
      <el-form :model="cardKeyForm" :rules="cardKeyRules" ref="cardKeyFormRef" label-width="100px">
        <el-form-item label="生成数量" prop="count">
          <el-input-number v-model="cardKeyForm.count" :min="1" :max="1000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="generateCardKeys">生成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 卡密列表数据
const cardKeys = ref([])

// 搜索条件
const searchQuery = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 对话框状态
const showAddDialog = ref(false)
const cardKeyFormRef = ref(null)

// 卡密表单数据
const cardKeyForm = ref({
  count: 10
})

// 表单验证规则
const cardKeyRules = {
  count: [
    { required: true, message: '请输入生成数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 1000, message: '数量必须在1-1000之间', trigger: 'blur' }
  ]
}

// 计算属性：筛选后的卡密列表
const filteredCardKeys = computed(() => {
  let filtered = cardKeys.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(cardKey => 
      cardKey.cardKey.toLowerCase().includes(query) ||
      (cardKey.userEmail && cardKey.userEmail.toLowerCase().includes(query))
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(cardKey => cardKey.status === statusFilter.value)
  }
  
  return filtered
})

// 状态标签类型映射
const getStatusTagType = (status) => {
  const typeMap = {
    unused: 'success',
    used: 'primary',
    disabled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 状态文本映射
const getStatusText = (status) => {
  const textMap = {
    unused: '未使用',
    used: '已使用',
    disabled: '已禁用'
  }
  return textMap[status] || '未知'
}



// 加载卡密数据
const loadCardKeys = async () => {
  loading.value = true
  try {
    // 模拟数据 - 实际项目中应该调用API
    cardKeys.value = [
      {
        id: 1,
        cardKey: 'LEAF-2024-001-ABCD-EFGH',
        type: 'month',
        duration: 30,
        status: 'unused',
        userId: null,
        userEmail: null,
        activateTime: null,
        expireTime: null,
        createTime: '2024-01-01 10:00:00',
        productSpec: '月卡-基础版'
      },
      {
        id: 2,
        cardKey: 'LEAF-2024-002-IJKL-MNOP',
        type: 'quarter',
        duration: 90,
        status: 'used',
        userId: 1001,
        userEmail: 'user1@example.com',
        activateTime: '2024-01-15 14:30:00',
        expireTime: '2024-04-15 14:30:00',
        createTime: '2024-01-02 09:15:00',
        productSpec: '季卡-高级版'
      },
      {
        id: 3,
        cardKey: 'LEAF-2024-003-QRST-UVWX',
        type: 'year',
        duration: 365,
        status: 'disabled',
        userId: 1002,
        userEmail: 'user2@example.com',
        activateTime: '2023-12-01 08:00:00',
        expireTime: '2024-12-01 08:00:00',
        createTime: '2023-11-28 16:45:00',
        productSpec: '年卡-旗舰版'
      },
      {
        id: 4,
        cardKey: 'LEAF-2024-004-YZAB-CDEF',
        type: 'permanent',
        duration: null,
        status: 'disabled',
        userId: null,
        userEmail: null,
        activateTime: null,
        expireTime: null,
        createTime: '2024-01-03 11:20:00',
        productSpec: '永久卡-至尊版'
      }
    ]
    total.value = cardKeys.value.length
  } catch (error) {
    ElMessage.error('加载卡密数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  // 实际项目中应该重新调用API
}

// 复制卡密
const copyCardKey = async (cardKey) => {
  try {
    await navigator.clipboard.writeText(cardKey)
    ElMessage.success('卡密已复制到剪贴板')
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = cardKey
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('卡密已复制到剪贴板')
  }
}

// 重置筛选
const resetFilter = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  handleSearch()
}

// 清空已使用卡密
const handleClearUsed = () => {
  ElMessageBox.confirm(
    '确定要清空所有已使用的卡密吗？此操作不可恢复！',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    // 模拟清空已使用卡密操作
    cardKeys.value = cardKeys.value.filter(cardKey => cardKey.status !== 'used')
    total.value = cardKeys.value.length
    ElMessage.success('已成功清空所有已使用的卡密')
  }).catch(() => {
    // 取消操作
  })
}

// 生成卡密
const handleAddCardKey = () => {
  showAddDialog.value = true
}

// 生成卡密
const generateCardKeys = async () => {
  if (!cardKeyFormRef.value) return
  
  try {
    await cardKeyFormRef.value.validate()
    
    // 模拟生成卡密
    ElMessage.success(`成功生成 ${cardKeyForm.value.count} 张卡密`)
    showAddDialog.value = false
    loadCardKeys()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('生成卡密失败')
    }
  }
}

// 禁用卡密
const handleDisableCardKey = (row) => {
  ElMessageBox.confirm(
    `确定要禁用卡密"${row.cardKey}"吗？`,
    '确认禁用',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟禁用操作
    row.status = 'disabled'
    ElMessage.success('禁用成功')
  }).catch(() => {
    // 取消操作
  })
}

// 删除卡密
const handleDeleteCardKey = (row) => {
  ElMessageBox.confirm(
    `确定要删除卡密"${row.cardKey}"吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadCardKeys()
  }).catch(() => {
    // 取消操作
  })
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  // 实际项目中应该重新调用API
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中应该重新调用API
}

onMounted(() => {
  loadCardKeys()
})
</script>

<style scoped>
.admin-cardkey-management {
  padding: 0;
  background-color: #f0f2f5;
}

.cardkey-card {
  margin-bottom: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cardkey-card :deep(.el-card__body) {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.search-bar {
  padding: 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #e6e6e6;
}

.table-container {
  padding: 16px;
  width: 100%;
  overflow-x: auto;
  min-height: 400px;
}

.pagination-container {
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: flex-end;
}

.cardkey-code {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #409EFF;
  letter-spacing: 1px;
}

:deep(.el-table) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}
</style>