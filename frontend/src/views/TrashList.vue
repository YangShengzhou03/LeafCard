<template>
  <div class="trash-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>回收站</span>
          <div class="header-actions">
            <el-button type="danger" @click="handleEmptyTrash">
              <el-icon><Delete /></el-icon>
              清空回收站
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="卡名称">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入卡名称或描述"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="删除时间">
            <el-date-picker
              v-model="searchForm.deleteTimeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格区域 -->
      <el-card>
        <el-table :data="tableData" v-loading="loading" stripe>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="cardName" label="卡名称" min-width="150" />
          <el-table-column prop="categoryName" label="分类" width="120" />
          <el-table-column prop="subCategoryName" label="子分类" width="120" />
          <el-table-column prop="deleteTime" label="删除时间" width="160" />
          <el-table-column prop="deleteBy" label="删除人" width="120" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleRestore(row)">恢复</el-button>
              <el-button link type="danger" @click="handlePermanentDelete(row)">永久删除</el-button>
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete } from '@element-plus/icons-vue'
import type { CardInfo } from '@/types'
import { cardApi } from '@/api/card'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  deleteTimeRange: [] as string[]
})

// 表格数据
const tableData = ref<CardInfo[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    const response = await cardApi.getTrashCards(params)
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
    keyword: '',
    deleteTimeRange: []
  })
  handleSearch()
}

// 恢复
const handleRestore = async (row: CardInfo) => {
  try {
    await ElMessageBox.confirm('确定要恢复这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cardApi.restoreCard(row.id!)
    ElMessage.success('恢复成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 永久删除
const handlePermanentDelete = async (row: CardInfo) => {
  try {
    await ElMessageBox.confirm('确定要永久删除这张卡吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
    
    await cardApi.permanentDeleteCard(row.id!)
    ElMessage.success('永久删除成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 清空回收站
const handleEmptyTrash = async () => {
  try {
    await ElMessageBox.confirm('确定要清空回收站吗？此操作将永久删除所有已删除的卡！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
    
    await cardApi.clearTrash()
    ElMessage.success('回收站已清空')
    loadData()
  } catch (error) {
    // 用户取消操作
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
  loadData()
})
</script>

<style scoped>
.trash-list {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.search-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>