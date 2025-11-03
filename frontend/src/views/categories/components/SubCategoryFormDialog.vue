<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="子分类名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入子分类名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="等级" prop="level">
        <el-input-number
          v-model="formData.level"
          :min="1"
          :max="10"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入子分类描述"
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
import type { CardSubCategory, CreateCardSubCategoryParams, UpdateCardSubCategoryParams } from '@/types'
import categoryApi from '@/api/category'

// Props
interface Props {
  modelValue: boolean
  subCategory?: CardSubCategory | null
  categoryId?: number
  mode?: 'add' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add'
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

const formData = reactive<CreateCardSubCategoryParams | UpdateCardSubCategoryParams>({
  name: '',
  level: 1,
  description: '',
  sortOrder: 0,
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入子分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '子分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择等级', trigger: 'blur' },
    { type: 'number', min: 1, max: 10, message: '等级必须在 1-10 之间', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '子分类描述不能超过 200 个字符', trigger: 'blur' }
  ],
  sortOrder: [
    { type: 'number', min: 0, max: 999, message: '排序值必须在 0-999 之间', trigger: 'blur' }
  ]
}

// 计算属性
const dialogTitle = computed(() => {
  return props.mode === 'add' ? '添加子分类' : '编辑子分类'
})

// 方法
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    level: 1,
    description: '',
    sortOrder: 0,
    status: 1
  })
  formRef.value?.clearValidate()
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

    // 添加分类ID
    const submitData = { ...formData }
    if (props.mode === 'add' && props.categoryId) {
      (submitData as CreateCardSubCategoryParams).categoryId = props.categoryId
    }

    if (props.mode === 'add') {
      await categoryApi.createSubCategory(submitData as CreateCardSubCategoryParams)
      ElMessage.success('添加子分类成功')
    } else {
      if (props.subCategory?.id) {
        await categoryApi.updateSubCategory(props.subCategory.id, submitData as UpdateCardSubCategoryParams)
        ElMessage.success('更新子分类成功')
      }
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(props.mode === 'add' ? '添加子分类失败' : '更新子分类失败')
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
      // 重置表单
      resetForm()
      
      // 如果是编辑模式，填充数据
      if (props.mode === 'edit' && props.subCategory) {
        Object.assign(formData, {
          name: props.subCategory.name,
          level: props.subCategory.level,
          description: props.subCategory.description || '',
          sortOrder: props.subCategory.sortOrder,
          status: props.subCategory.status
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