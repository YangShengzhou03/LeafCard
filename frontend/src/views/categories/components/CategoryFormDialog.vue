<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="父分类" prop="parentId" v-if="showParentSelect">
        <el-select
          v-model="formData.parentId"
          placeholder="请选择父分类"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="category in categoryOptions"
            :key="category.id"
            :label="category.name"
            :value="category.id"
            :disabled="category.id === category?.id"
          >
            <div style="display: flex; align-items: center; gap: 8px">
              <el-icon><component :is="category.icon" /></el-icon>
              <span>{{ category.name }}</span>
              <el-tag size="small" :type="getLevelTagType(category.level)">
                {{ `L${category.level}` }}
              </el-tag>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入分类名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="分类图标" prop="icon">
        <el-select
          v-model="formData.icon"
          placeholder="请选择图标"
          style="width: 100%"
        >
          <el-option
            v-for="icon in iconOptions"
            :key="icon.value"
            :label="icon.label"
            :value="icon.value"
          >
            <div style="display: flex; align-items: center; gap: 8px">
              <el-icon><component :is="icon.value" /></el-icon>
              <span>{{ icon.label }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入分类描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="排序" prop="sortOrder">
        <el-input-number
          v-model="formData.sortOrder"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>

      <el-form-item label="设为默认" prop="isDefault">
        <el-switch
          v-model="formData.isDefault"
          :active-value="true"
          :inactive-value="false"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item label="颜色" prop="color">
        <el-color-picker
          v-model="formData.color"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { CardCategory, CreateCardCategoryParams, UpdateCardCategoryParams } from '@/types'
import categoryApi from '@/api/category'

// 图标选项
const iconOptions = [
  { value: 'Folder', label: '文件夹' },
  { value: 'Document', label: '文档' },
  { value: 'Collection', label: '收藏' },
  { value: 'Star', label: '星星' },
  { value: 'Flag', label: '旗帜' },
  { value: 'Location', label: '位置' },
  { value: 'Calendar', label: '日历' },
  { value: 'Clock', label: '时钟' },
  { value: 'User', label: '用户' },
  { value: 'Setting', label: '设置' },
  { value: 'Lock', label: '锁' },
  { value: 'Unlock', label: '解锁' },
  { value: 'CreditCard', label: '卡片' },
  { value: 'Wallet', label: '钱包' },
  { value: 'ShoppingBag', label: '购物袋' },
  { value: 'Gift', label: '礼物' },
  { value: 'Trophy', label: '奖杯' },
  { value: 'Heart', label: '爱心' },
  { value: 'Like', label: '点赞' },
  { value: 'ChatDotRound', label: '聊天' },
  { value: 'Phone', label: '电话' }
]

// 预定义颜色
const predefineColors = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#FF9D6F',
  '#5AB1EF',
  '#B6A2DE',
  '#2EC7C9',
  '#FFB980',
  '#D87A80',
  '#8D98B3',
  '#E5CF0D',
  '#97B552',
  '#95706D',
  '#DC69AA',
  '#07A2A4',
  '#9A7FD1',
  '#588DD5',
  '#F5994E'
]

// Props
interface Props {
  modelValue: boolean
  category?: CardCategory | null
  mode?: 'add' | 'edit'
  parentCategory?: CardCategory | null
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  parentCategory: null
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// 响应式数据
const visible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()
const categoryOptions = ref<CardCategory[]>([])

const formData = reactive<CreateCardCategoryParams | UpdateCardCategoryParams>({
  name: '',
  icon: 'Folder',
  description: '',
  sortOrder: 0,
  status: 1,
  isDefault: false,
  color: '#409EFF',
  parentId: undefined
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '分类描述不能超过 200 个字符', trigger: 'blur' }
  ],
  sortOrder: [
    { type: 'number', min: 0, max: 999, message: '排序值必须在 0-999 之间', trigger: 'blur' }
  ]
}

// 计算属性
const dialogTitle = computed(() => {
  return props.mode === 'add' ? '添加分类' : '编辑分类'
})

const showParentSelect = computed(() => {
  // 添加模式时显示父分类选择，或者编辑模式时显示（除非是顶级分类）
  return props.mode === 'add' || (props.mode === 'edit' && props.category?.level !== 0)
})

// 方法
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    icon: 'Folder',
    description: '',
    sortOrder: 0,
    status: 1,
    isDefault: false,
    color: '#409EFF',
    parentId: undefined
  })
  formRef.value?.clearValidate()
}

const loadCategoryOptions = async () => {
  try {
    const response = await categoryApi.getCategories()
    categoryOptions.value = response.data
  } catch (error) {
    console.error('加载分类选项失败:', error)
  }
}

const getLevelTagType = (level: number) => {
  const types = ['', 'primary', 'success', 'warning', 'danger', 'info']
  return types[level] || 'info'
}

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
  resetForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    if (props.mode === 'add') {
      await categoryApi.createCategory(formData as CreateCardCategoryParams)
      ElMessage.success('添加分类成功')
    } else {
      if (props.category?.id) {
        await categoryApi.updateCategory(props.category.id, formData as UpdateCardCategoryParams)
        ElMessage.success('更新分类成功')
      }
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(props.mode === 'add' ? '添加分类失败' : '更新分类失败')
  } finally {
    loading.value = false
  }
}

// 监听props变化
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    
    if (val) {
      // 加载分类选项
      loadCategoryOptions()
      
      // 重置表单
      resetForm()
      
      // 如果是添加模式且有父分类，设置父分类ID
      if (props.mode === 'add' && props.parentCategory) {
        formData.parentId = props.parentCategory.id
      }
      
      // 如果是编辑模式，填充数据
      if (props.mode === 'edit' && props.category) {
        Object.assign(formData, {
          name: props.category.name,
          icon: props.category.icon,
          description: props.category.description || '',
          sortOrder: props.category.sortOrder,
          status: props.category.status,
          isDefault: props.category.isDefault || false,
          color: props.category.color || '#409EFF',
          parentId: props.category.parentId
        })
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>