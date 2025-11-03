<template>
  <div class="cards-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>卡密管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加卡密
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索卡密编号"
          style="width: 200px"
          clearable
        />
        <el-select v-model="filterSpec" placeholder="规格类型" clearable>
          <el-option label="月卡" value="month" />
          <el-option label="季卡" value="quarter" />
          <el-option label="年卡" value="year" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable>
          <el-option label="未使用" value="unused" />
          <el-option label="已使用" value="used" />
        </el-select>
      </div>

      <!-- 卡密表格 -->
      <el-table :data="filteredCards" v-loading="loading">
        <el-table-column prop="id" label="卡密编号" width="200" />
        <el-table-column prop="specType" label="规格类型" width="120" />
        <el-table-column prop="responseNumber" label="响应数字" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'unused' ? 'success' : 'info'">
              {{ row.status === 'unused' ? '未使用' : '已使用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="生成时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewCard(row)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteCard(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 添加卡密弹窗 -->
    <el-dialog v-model="showAddDialog" title="添加卡密" width="500px">
      <el-form :model="newCard" label-width="80px">
        <el-form-item label="规格类型">
          <el-select v-model="newCard.specType" placeholder="请选择规格类型">
            <el-option label="月卡" value="month" />
            <el-option label="季卡" value="quarter" />
            <el-option label="年卡" value="year" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="newCard.quantity" :min="1" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addCards">生成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')
const filterSpec = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)
const showAddDialog = ref(false)

const newCard = ref({
  specType: '',
  quantity: 1
})

// 模拟数据
const cards = ref([
  {
    id: 'CARD-20240115-001',
    specType: '月卡',
    responseNumber: 0,
    status: 'unused',
    createdAt: '2024-01-15 10:30:00'
  },
  {
    id: 'CARD-20240115-002',
    specType: '年卡',
    responseNumber: 0,
    status: 'used',
    createdAt: '2024-01-15 09:15:00'
  }
])

const filteredCards = computed(() => {
  return cards.value.filter(card => {
    const matchesKeyword = !searchKeyword.value || 
      card.id.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesSpec = !filterSpec.value || card.specType === filterSpec.value
    const matchesStatus = !filterStatus.value || card.status === filterStatus.value
    return matchesKeyword && matchesSpec && matchesStatus
  })
})

const viewCard = (card) => {
  ElMessage.info(`查看卡密: ${card.id}`)
}

const deleteCard = async (card) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除卡密 ${card.id} 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

const addCards = () => {
  ElMessage.success('卡密生成成功')
  showAddDialog.value = false
}

onMounted(() => {
  loading.value = true
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>