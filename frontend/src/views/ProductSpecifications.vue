<template>
  <div class="specifications-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规格管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加规格
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索规格名称"
          style="width: 200px"
          clearable
        />
        <el-select v-model="filterCategory" placeholder="商品分类" clearable @change="handleCategoryChange">
          <el-option 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :value="category.id" 
          />
        </el-select>
        <el-select v-model="filterGoods" placeholder="商品" clearable :disabled="!filterCategory">
          <el-option 
            v-for="goods in filteredGoods" 
            :key="goods.id" 
            :label="goods.name" 
            :value="goods.id" 
          />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable>
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </div>

      <!-- 规格表格 -->
      <el-table :data="filteredSpecs" v-loading="loading">
        <el-table-column prop="name" label="规格名称" width="150" />
        <el-table-column prop="categoryName" label="商品分类" width="120" />
        <el-table-column prop="goodsName" label="商品" width="120" />
        <el-table-column prop="type" label="规格类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.type === 'text' ? '文本' : '数字' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="responseNumber" label="响应数字" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="toggleSpecStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editSpec(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteSpec(row)">删除</el-button>
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

    <!-- 添加/编辑规格弹窗 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="isEditing ? '编辑规格' : '添加规格'" 
      width="500px"
    >
      <el-form :model="currentSpec" label-width="80px" :rules="formRules" ref="specForm">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="currentSpec.name" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="currentSpec.categoryId" placeholder="请选择商品分类" @change="handleFormCategoryChange">
            <el-option 
              v-for="category in categories" 
              :key="category.id" 
              :label="category.name" 
              :value="category.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="goodsId">
          <el-select v-model="currentSpec.goodsId" placeholder="请选择商品" :disabled="!currentSpec.categoryId">
            <el-option 
              v-for="goods in formFilteredGoods" 
              :key="goods.id" 
              :label="goods.name" 
              :value="goods.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格类型">
          <el-select v-model="currentSpec.type" placeholder="请选择规格类型">
            <el-option label="文本" value="text" />
            <el-option label="数字" value="number" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="currentSpec.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入规格描述" 
          />
        </el-form-item>
        <el-form-item label="响应数字" prop="responseNumber">
          <el-input-number 
            v-model="currentSpec.responseNumber" 
            :min="0" 
            :max="999" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSpec">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')
const filterCategory = ref('')
const filterGoods = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)
const showAddDialog = ref(false)
const isEditing = ref(false)
const specForm = ref(null)

const currentSpec = ref({
  id: '',
  name: '',
  categoryId: '',
  goodsId: '',
  type: 'text',
  description: '',
  responseNumber: 0,
  status: 'active'
})

const formRules = {
  name: [
    { required: true, message: '请输入规格名称', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  goodsId: [
    { required: true, message: '请选择商品', trigger: 'change' }
  ],
  responseNumber: [
    { required: true, message: '请输入响应数字', trigger: 'blur' }
  ]
}

// 模拟商品分类数据
const categories = ref([
  {
    id: 1,
    name: '会员卡',
    code: 'VIP'
  },
  {
    id: 2,
    name: '礼品卡',
    code: 'GIFT'
  },
  {
    id: 3,
    name: '测试卡',
    code: 'TEST'
  }
])

// 模拟商品数据
const goodsList = ref([
  {
    id: 1,
    name: '月卡会员',
    categoryId: 1,
    categoryName: '会员卡',
    status: 'active'
  },
  {
    id: 2,
    name: '季卡会员',
    categoryId: 1,
    categoryName: '会员卡',
    status: 'active'
  },
  {
    id: 3,
    name: '年卡会员',
    categoryId: 1,
    categoryName: '会员卡',
    status: 'active'
  },
  {
    id: 4,
    name: '生日礼品卡',
    categoryId: 2,
    categoryName: '礼品卡',
    status: 'active'
  },
  {
    id: 5,
    name: '节日礼品卡',
    categoryId: 2,
    categoryName: '礼品卡',
    status: 'active'
  },
  {
    id: 6,
    name: '测试卡A',
    categoryId: 3,
    categoryName: '测试卡',
    status: 'active'
  }
])

// 模拟规格数据
const specifications = ref([
  {
    id: 1,
    name: '月卡',
    categoryId: 1,
    categoryName: '会员卡',
    goodsId: 1,
    goodsName: '月卡会员',
    type: 'text',
    description: '30天有效期的卡密',
    responseNumber: 1,
    status: 'active',
    createdAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '季卡',
    categoryId: 1,
    categoryName: '会员卡',
    goodsId: 2,
    goodsName: '季卡会员',
    type: 'text',
    description: '90天有效期的卡密',
    responseNumber: 2,
    status: 'active',
    createdAt: '2024-01-15 09:15:00'
  },
  {
    id: 3,
    name: '年卡',
    categoryId: 1,
    categoryName: '会员卡',
    goodsId: 3,
    goodsName: '年卡会员',
    type: 'text',
    description: '365天有效期的卡密',
    responseNumber: 3,
    status: 'inactive',
    createdAt: '2024-01-14 16:45:00'
  },
  {
    id: 4,
    name: '生日卡',
    categoryId: 2,
    categoryName: '礼品卡',
    goodsId: 4,
    goodsName: '生日礼品卡',
    type: 'text',
    description: '生日礼品卡',
    responseNumber: 4,
    status: 'active',
    createdAt: '2024-01-13 14:20:00'
  }
])

// 根据分类筛选的商品列表
const filteredGoods = computed(() => {
  if (!filterCategory.value) return []
  return goodsList.value.filter(goods => goods.categoryId === filterCategory.value)
})

// 表单中根据分类筛选的商品列表
const formFilteredGoods = computed(() => {
  if (!currentSpec.value.categoryId) return []
  return goodsList.value.filter(goods => goods.categoryId === currentSpec.value.categoryId)
})

const filteredSpecs = computed(() => {
  return specifications.value.filter(spec => {
    const matchesKeyword = !searchKeyword.value || 
      spec.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesCategory = !filterCategory.value || spec.categoryId === filterCategory.value
    const matchesGoods = !filterGoods.value || spec.goodsId === filterGoods.value
    const matchesStatus = !filterStatus.value || spec.status === filterStatus.value
    return matchesKeyword && matchesCategory && matchesGoods && matchesStatus
  })
})

// 处理分类变化
const handleCategoryChange = () => {
  filterGoods.value = '' // 重置商品筛选
}

// 处理表单分类变化
const handleFormCategoryChange = () => {
  currentSpec.value.goodsId = '' // 重置商品选择
}

const editSpec = (spec) => {
  isEditing.value = true
  currentSpec.value = { ...spec }
  showAddDialog.value = true
}

const deleteSpec = async (spec) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规格 "${spec.name}" 吗？`,
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

const toggleSpecStatus = (spec) => {
  const action = spec.status === 'active' ? '启用' : '停用'
  ElMessage.success(`${action}成功`)
}

const saveSpec = async () => {
  if (!specForm.value) return
  
  try {
    await specForm.value.validate()
    
    // 检查响应数字是否重复
    const existingSpec = specifications.value.find(
      spec => spec.responseNumber === currentSpec.value.responseNumber && 
               spec.id !== currentSpec.value.id
    )
    
    if (existingSpec) {
      ElMessage.error(`响应数字 ${currentSpec.value.responseNumber} 已存在，请使用其他数字`)
      return
    }
    
    // 查找分类名称和商品名称
    const category = categories.value.find(cat => cat.id === currentSpec.value.categoryId)
    const goods = goodsList.value.find(g => g.id === currentSpec.value.goodsId)
    
    if (isEditing.value) {
      // 更新规格
      const index = specifications.value.findIndex(spec => spec.id === currentSpec.value.id)
      if (index !== -1) {
        specifications.value[index] = {
          ...currentSpec.value,
          categoryName: category ? category.name : '',
          goodsName: goods ? goods.name : ''
        }
      }
      ElMessage.success('规格更新成功')
    } else {
      // 添加新规格
      const newSpec = {
        ...currentSpec.value,
        id: Date.now(),
        categoryName: category ? category.name : '',
        goodsName: goods ? goods.name : '',
        createdAt: new Date().toLocaleString('zh-CN')
      }
      specifications.value.unshift(newSpec)
      ElMessage.success('规格添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const resetForm = () => {
  currentSpec.value = {
    id: '',
    name: '',
    categoryId: '',
    goodsId: '',
    type: 'text',
    description: '',
    responseNumber: 0,
    status: 'active'
  }
  isEditing.value = false
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
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>