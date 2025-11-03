<template>
  <div class="category-add">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加分类</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 600px"
      >
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            value-key="id"
            placeholder="请选择上级分类（不选则为顶级分类）"
            clearable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码" />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标URL或选择图标">
            <template #append>
              <el-button @click="handleSelectIcon">选择图标</el-button>
            </template>
          </el-input>
          <div v-if="form.icon" class="icon-preview">
            <el-image v-if="isImageUrl(form.icon)" :src="form.icon" style="width: 50px; height: 50px" fit="cover" />
            <el-icon v-else :size="30">
              <component :is="form.icon" />
            </el-icon>
          </div>
        </el-form-item>

        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图标选择对话框 -->
    <el-dialog v-model="iconDialogVisible" title="选择图标" width="800px">
      <div class="icon-grid">
        <div
          v-for="icon in iconList"
          :key="icon"
          class="icon-item"
          :class="{ active: selectedIcon === icon }"
          @click="selectedIcon = icon"
        >
          <el-icon :size="24">
            <component :is="icon" />
          </el-icon>
          <span>{{ icon }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="iconDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmIcon">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCategoryTree, createCategory } from '@/api/category'

// 导入所有Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const loading = ref(false)
const categoryOptions = ref([])
const iconDialogVisible = ref(false)
const selectedIcon = ref('')
const iconList = ref(Object.keys(ElementPlusIconsVue))

// 表单数据
const form = reactive({
  parentId: null,
  name: '',
  code: '',
  icon: '',
  sortOrder: 0,
  description: '',
  status: 1
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能包含字母、数字、下划线和连字符', trigger: 'blur' }
  ],
  sortOrder: [
    { type: 'number', message: '排序必须为数字', trigger: 'blur' }
  ]
}

onMounted(() => {
  // 从路由参数获取父分类ID
  if (route.query.parentId) {
    form.parentId = parseInt(route.query.parentId)
  }
  
  loadCategoryOptions()
})

// 加载分类选项
const loadCategoryOptions = async () => {
  try {
    const response = await getCategoryTree()
    if (response.success && response.data) {
      categoryOptions.value = response.data
    }
  } catch (error) {
    console.error('加载分类选项失败:', error)
  }
}

// 判断是否为图片URL
const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}

// 选择图标
const handleSelectIcon = () => {
  selectedIcon.value = form.icon
  iconDialogVisible.value = true
}

// 确认选择图标
const handleConfirmIcon = () => {
  form.icon = selectedIcon.value
  iconDialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    const response = await createCategory(form)
    
    if (response.success) {
      ElMessage.success('添加分类成功')
      router.push('/categories/list')
    } else {
      ElMessage.error(response.message || '添加分类失败')
    }
  } catch (error) {
    if (error !== false) { // 不是表单验证错误
      console.error('添加分类失败:', error)
      ElMessage.error('添加分类失败')
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 从路由参数获取父分类ID
  if (route.query.parentId) {
    form.parentId = parseInt(route.query.parentId)
  }
}

// 返回列表
const handleBack = () => {
  router.push('/categories/list')
}
</script>

<style scoped>
.category-add {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-preview {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.icon-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.icon-item span {
  margin-top: 5px;
  font-size: 12px;
  text-align: center;
  word-break: break-all;
}
</style>