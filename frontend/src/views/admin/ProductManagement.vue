<template>
  <div class="product-management">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
              <el-option label="虚拟商品" value="virtual" />
              <el-option label="实体商品" value="physical" />
              <el-option label="服务类" value="service" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="上架" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="handleAddProduct">
          <el-icon><Plus /></el-icon>
          新增商品
        </el-button>
      </div>

      <!-- 商品列表 -->
      <div class="table-container">
        <el-table :data="productList" v-loading="loading" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="商品名称" min-width="200" />
          <el-table-column prop="category" label="分类" width="100">
            <template #default="{ row }">
              <el-tag :type="getCategoryTagType(row.category)">
                {{ getCategoryText(row.category) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120">
            <template #default="{ row }">
              ¥{{ row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '上架' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEditProduct(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteProduct(row)">删除</el-button>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  status: ''
})

// 商品列表数据
const productList = ref([])
const loading = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 分类标签类型映射
const getCategoryTagType = (category) => {
  const typeMap = {
    virtual: 'primary',
    physical: 'success',
    service: 'warning'
  }
  return typeMap[category] || 'info'
}

// 分类文本映射
const getCategoryText = (category) => {
  const textMap = {
    virtual: '虚拟商品',
    physical: '实体商品',
    service: '服务类'
  }
  return textMap[category] || '未知'
}

// 模拟商品数据加载
const loadProductData = () => {
  loading.value = true
  // 模拟异步请求
  setTimeout(() => {
    productList.value = [
      {
        id: 1,
        name: 'VIP会员月卡',
        category: 'virtual',
        price: 29.99,
        stock: 1000,
        status: 'active',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        name: '实体礼品卡',
        category: 'physical',
        price: 199.99,
        stock: 50,
        status: 'active',
        createTime: '2024-01-02 14:30:00'
      },
      {
        id: 3,
        name: '在线课程服务',
        category: 'service',
        price: 399.99,
        stock: 200,
        status: 'inactive',
        createTime: '2024-01-03 09:15:00'
      }
    ]
    total.value = 3
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadProductData()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
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
    loadProductData()
  }).catch(() => {
    // 取消操作
  })
}

// 分页大小改变
const handleSizeChange = (size) => {
  pageSize.value = size
  loadProductData()
}

// 当前页改变
const handleCurrentChange = (page) => {
  currentPage.value = page
  loadProductData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadProductData()
})
</script>

<style scoped>
.product-management {
  padding: 12px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-form {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.action-bar {
  margin-bottom: 16px;
}

.table-container {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-form {
    padding: 12px;
  }
  
  .action-bar {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .action-bar .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .product-management {
    padding: 8px;
  }
  
  .page-header h2 {
    font-size: 20px;
  }
}
</style>