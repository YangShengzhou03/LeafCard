<template>
  <div class="specification-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规格管理</span>
          <el-button type="primary" @click="handleAdd">添加规格</el-button>
        </div>
      </template>
      
      <div class="search-form">
        <el-form :model="searchForm" inline>
          <el-form-item label="规格名称">
            <el-input v-model="searchForm.name" placeholder="请输入规格名称" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="规格名称" min-width="120" />
        <el-table-column prop="type" label="规格类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.type === 'text' ? '文本' : '数值' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="values" label="规格值" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="value in row.values" :key="value" style="margin-right: 4px;">
              {{ value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link @click="handleToggleStatus(row)">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({
  name: '',
  status: ''
})

const tableData = ref([])
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const loadData = async () => {
  // 模拟数据加载
  tableData.value = [
    {
      id: 1,
      name: '颜色',
      type: 'text',
      values: ['红色', '蓝色', '绿色', '黑色'],
      status: 'active',
      createTime: '2024-01-01 10:00:00'
    },
    {
      id: 2,
      name: '尺寸',
      type: 'text',
      values: ['S', 'M', 'L', 'XL'],
      status: 'active',
      createTime: '2024-01-02 14:30:00'
    },
    {
      id: 3,
      name: '内存',
      type: 'text',
      values: ['8GB', '16GB', '32GB', '64GB'],
      status: 'inactive',
      createTime: '2024-01-03 09:15:00'
    }
  ]
  pagination.total = 3
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  pagination.current = 1
  loadData()
}

const handleAdd = () => {
  ElMessage.info('添加规格功能待实现')
}

const handleEdit = (row) => {
  ElMessage.info(`编辑规格: ${row.name}`)
}

const handleToggleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 'active' ? '禁用' : '启用'}规格"${row.name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟状态切换
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success('操作成功')
  } catch (error) {
    // 用户取消操作
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规格"${row.name}"吗？此操作不可恢复！`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    // 模拟删除操作
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadData()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.specification-management {
  padding: 12px;
}

.search-form {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>