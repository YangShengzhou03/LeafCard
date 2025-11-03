<template>
  <div class="card-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑卡' : '新增卡' }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        style="max-width: 600px"
      >
        <el-form-item label="卡名称" prop="cardName">
          <el-input
            v-model="formData.cardName"
            placeholder="请输入卡名称"
          />
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类" @change="handleCategoryChange">
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="子分类" prop="subCategoryId">
          <el-select v-model="formData.subCategoryId" placeholder="请选择子分类">
            <el-option
              v-for="subCategory in subCategories"
              :key="subCategory.value"
              :label="subCategory.label"
              :value="subCategory.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="卡描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入卡描述信息"
          />
        </el-form-item>

        <el-form-item label="卡内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="4"
            placeholder="请输入卡的具体内容，如卡号、密码等"
          />
        </el-form-item>

        <el-form-item label="状态" prop="cardStatus">
          <el-radio-group v-model="formData.cardStatus">
            <el-radio value="unused">未使用</el-radio>
            <el-radio value="used">已使用</el-radio>
            <el-radio value="disabled">已禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { CardInfo } from '@/types'
import { cardApi } from '@/api/card'
import { categoryApi } from '@/api/category'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const isEdit = ref(false)
const cardId = ref<number>()

// 分类数据
const categories = ref<{ value: number; label: string }[]>([])
const subCategories = ref<{ value: number; label: string }[]>([])

// 表单数据
const formData = reactive<Partial<CardInfo>>({
  cardName: '',
  categoryId: undefined,
  subCategoryId: undefined,
  description: '',
  content: '',
  cardStatus: 1
})

// 表单验证规则
const formRules: FormRules = {
  cardName: [
    { required: true, message: '请输入卡名称', trigger: 'blur' },
    { min: 1, max: 100, message: '卡名称长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  subCategoryId: [
    { required: true, message: '请选择子分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入卡内容', trigger: 'blur' }
  ]
}

// 加载分类数据
const loadCategories = async () => {
  try {
    const response = await categoryApi.getCategoryList({ page: 1, size: 1000 })
    categories.value = response.records.map(item => ({
      value: item.id!,
      label: item.name
    }))
  } catch (error) {
    console.error('加载分类数据失败:', error)
  }
}

// 分类变化时加载子分类
const handleCategoryChange = async (categoryId: number | undefined) => {
  if (!categoryId) {
    subCategories.value = []
    formData.subCategoryId = undefined
    return
  }
  
  try {
    const response = await categoryApi.getSubCategoryList(categoryId, { page: 1, size: 1000 })
    subCategories.value = response.records.map(item => ({
      value: item.id!,
      label: item.name
    }))
    formData.subCategoryId = undefined
  } catch (error) {
    console.error('加载子分类数据失败:', error)
  }
}

// 加载卡详情
const loadCardDetail = async (id: number) => {
  try {
    const data = await cardApi.getCard(id)
    Object.assign(formData, data)
    
    // 如果卡有分类信息，加载对应的子分类
    if (data.categoryId) {
      await handleCategoryChange(data.categoryId)
    }
  } catch (error) {
    ElMessage.error('加载卡详情失败')
    router.back()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      await cardApi.updateCard(cardId.value!, formData)
      ElMessage.success('更新成功')
    } else {
      await cardApi.createCard(formData)
      ElMessage.success('创建成功')
    }
    
    router.push('/cards')
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadCategories()
  
  const { id } = route.params
  if (id) {
    isEdit.value = true
    cardId.value = Number(id)
    loadCardDetail(cardId.value)
  }
})
</script>

<style scoped>
.card-form {
  padding: 0;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>