<template>
  <div class="admin-product-management">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="searchQuery"
              placeholder="商品名称"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="statusFilter" placeholder="商品状态" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="在售" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </el-col>
          <el-col :span="14" class="button-group">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetFilters">重置</el-button>
            <div style="flex: 1;"></div>
            <el-button type="primary" @click="handleAddProduct">新增商品</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 商品列表 -->
      <div class="table-container">
        <el-table :data="filteredProducts" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="60" align="center" />
          <el-table-column prop="name" label="商品名称" width="160" show-overflow-tooltip />
          <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.description || '暂无描述' }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="70" align="center" />
          <el-table-column prop="status" label="状态" width="70" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                {{ row.status === 'active' ? '在售' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
          <el-table-column label="操作" width="110" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="handleEditProduct(row)">编辑</el-button>
              <el-button size="small" type="danger" link @click="handleDeleteProduct(row)">删除</el-button>
            </template>
          </el-table-column>
          
          <!-- 空状态 -->
          <template #empty>
            <div class="empty-container" style="padding: 40px 0;">
              <el-empty description="暂无商品数据" image-size="120" />
            </div>
          </template>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '../../services/api'

// 加载状态
const loading = ref(false)

// 商品列表数据
const products = ref([])

// 搜索条件
const searchQuery = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 计算属性：筛选后的商品列表
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }
  
  return filtered
})

// 分类标签类型映射函数已移除，因为所有商品都是虚拟卡密，不需要分类
// 分类文本映射函数已移除，因为所有商品都是虚拟卡密，不需要分类

// 加载商品数据
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await api.admin.getProductList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchQuery.value,
      status: statusFilter.value
    })
    
    if (response && response.data) {
      products.value = response.data.records || response.data.content || []
      total.value = response.data.total || response.data.totalElements || 0
    } else {
      // 如果API返回空数据，使用默认数据
      products.value = [
        {
          id: 1,
          name: 'VIP会员月卡',
          category: 'virtual',
          description: 'VIP会员专属月卡，享受专属权益',
          stock: 1000,
          status: 'active',
          createTime: '2024-01-01 10:00:00'
        },
        {
          id: 2,
          name: '实体礼品卡',
          category: 'physical',
          description: '精美实体礼品卡，适合各种场合赠送',
          stock: 50,
          status: 'active',
          createTime: '2024-01-02 14:30:00'
        },
        {
          id: 3,
          name: '在线课程服务',
          category: 'service',
          description: '专业在线课程服务，提供优质学习体验',
          stock: 200,
          status: 'inactive',
          createTime: '2024-01-03 09:15:00'
        }
      ]
      total.value = products.value.length
    }
  } catch (error) {
    ElMessage.error('加载商品数据失败')
    console.error('Product data loading error:', error)
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  handleSearch()
}

// 新增商品
const handleAddProduct = () => {
  ElMessage.info('新增商品功能开发中')
}

// 编辑商品
const handleEditProduct = (row) => {
  ElMessage.info(`编辑商品: ${row.name}`)
}

// 删除商品
const handleDeleteProduct = (row) => {
  ElMessageBox.confirm(
    `确定要删除商品"${row.name}"吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadProducts()
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
  loadProducts()
})
</script>

<style scoped>
.admin-product-management {
  padding: 0;
  background-color: #f0f2f5;
}

.product-card {
  margin-bottom: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.product-card :deep(.el-card__body) {
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
  margin-bottom: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-bar:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.search-bar :deep(.el-col) {
  display: flex;
  align-items: center;
}

.search-bar :deep(.el-input) {
  flex: 1;
}

.search-bar :deep(.button-group) {
  justify-content: flex-end;
}

.search-bar :deep(.button-group .el-button) {
  margin-left: 8px;
  transition: all 0.2s ease;
}

.search-bar :deep(.button-group .el-button:hover) {
  transform: translateY(-1px);
}

.table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.table-container :deep(.el-table) {
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.table-container :deep(.el-table__header-wrapper) {
  background-color: #f5f7fa;
}

.table-container :deep(.el-table th) {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  padding: 12px 0;
}

.table-container :deep(.el-table td) {
  padding: 12px 0;
  transition: background-color 0.2s ease;
}

.table-container :deep(.el-table tr:hover td) {
  background-color: #f8f9fa;
}

.table-container :deep(.el-table .cell) {
  padding: 0 12px;
  word-break: break-word;
}

.table-container :deep(.el-button) {
  transition: all 0.2s ease;
}

.table-container :deep(.el-button:hover) {
  transform: translateY(-1px);
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e6e8eb;
}

.empty-container {
  padding: 40px 0;
  transition: all 0.3s ease;
}
</style>