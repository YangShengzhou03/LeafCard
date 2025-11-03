<template>
  <div class="product-add">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>新增商品</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            保存
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入商品名称"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品SKU" prop="sku">
              <el-input
                v-model="formData.sku"
                placeholder="请输入商品SKU"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="商品分类" prop="categoryId">
              <el-cascader
                v-model="formData.categoryId"
                :options="categoryOptions"
                :props="{ checkStrictly: true, emitPath: false }"
                placeholder="请选择分类"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="上架" value="active" />
                <el-option label="下架" value="inactive" />
                <el-option label="草稿" value="draft" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="商品价格" prop="price">
              <el-input-number
                v-model="formData.price"
                :min="0"
                :precision="2"
                placeholder="请输入价格"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价" prop="originalPrice">
              <el-input-number
                v-model="formData.originalPrice"
                :min="0"
                :precision="2"
                placeholder="请输入原价"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number
                v-model="formData.stock"
                :min="0"
                placeholder="请输入库存数量"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number
                v-model="formData.sortOrder"
                :min="0"
                :max="9999"
                placeholder="请输入排序值"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="商品图片" prop="images">
          <el-upload
            v-model:file-list="fileList"
            action=""
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            :limit="10"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">
            支持 jpg/png 格式，单个文件不超过 5MB，最多上传 10 张图片
          </div>
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="5"
            placeholder="请输入商品描述"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="商品详情" prop="details">
          <el-input
            v-model="formData.details"
            type="textarea"
            :rows="8"
            placeholder="请输入商品详情"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>

        <el-divider>商品属性</el-divider>

        <el-form-item label="商品特色">
          <el-checkbox-group v-model="formData.features">
            <el-checkbox label="isFeatured">推荐商品</el-checkbox>
            <el-checkbox label="isHot">热销商品</el-checkbox>
            <el-checkbox label="isNew">新品</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="商品规格">
          <div class="spec-container">
            <div
              v-for="(spec, index) in formData.specifications"
              :key="index"
              class="spec-item"
            >
              <el-form-item
                :label="`规格 ${index + 1}`"
                :prop="`specifications.${index}.name`"
                :rules="{ required: true, message: '请输入规格名称', trigger: 'blur' }"
              >
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-input
                      v-model="spec.name"
                      placeholder="规格名称"
                    />
                  </el-col>
                  <el-col :span="12">
                    <el-input
                      v-model="spec.value"
                      placeholder="规格值"
                    />
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      type="danger"
                      icon="Delete"
                      circle
                      @click="removeSpecification(index)"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
            <el-button
              type="primary"
              icon="Plus"
              @click="addSpecification"
            >
              添加规格
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { productApi, createProduct } from '@/api/product'
import { getCategoryTree } from '@/api/category'

const router = useRouter()

// 表单引用
const formRef = ref()

// 保存状态
const saving = ref(false)

// 文件列表
const fileList = ref([])

// 分类选项
const categoryOptions = ref([])

// 表单数据
const formData = reactive({
  name: '',
  sku: '',
  categoryId: undefined,
  status: 'draft',
  price: 0,
  originalPrice: 0,
  stock: 0,
  sortOrder: 0,
  images: [],
  thumbnail: '',
  description: '',
  details: '',
  features: [],
  specifications: [
    { name: '', value: '' }
  ]
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 1, max: 100, message: '商品名称长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  sku: [
    { required: true, message: '请输入商品SKU', trigger: 'blur' },
    { min: 1, max: 50, message: 'SKU长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
  ]
}

onMounted(() => {
  loadCategories()
})

// 加载分类列表
const loadCategories = async () => {
  try {
    const response = await getCategoryTree()
    if (response.success && response.data) {
      // 将分类数据转换为级联选择器需要的格式
      categoryOptions.value = formatCategoryOptions(response.data)
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
    // 使用模拟数据作为后备
    categoryOptions.value = [
      { value: 1, label: '电子产品' },
      { value: 2, label: '服装' },
      { value: 3, label: '食品' }
    ]
  }
}

// 格式化分类选项
const formatCategoryOptions = (categories) => {
  return categories.map(category => {
    const option = {
      value: category.id,
      label: category.name
    }
    
    if (category.children && category.children.length > 0) {
      option.children = formatCategoryOptions(category.children)
    }
    
    return option
  })
}

// 图片变化处理
const handleImageChange = (file, fileList) => {
  // 这里可以添加图片预览逻辑
}

// 图片移除处理
const handleImageRemove = (file, fileList) => {
  // 这里可以添加图片移除逻辑
}

// 添加规格
const addSpecification = () => {
  formData.specifications.push({ name: '', value: '' })
}

// 移除规格
const removeSpecification = (index) => {
  if (formData.specifications.length > 1) {
    formData.specifications.splice(index, 1)
  }
}

// 保存商品
const handleSave = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    saving.value = true

    // 处理图片数据
    const images = fileList.value.map(file => file.url || file.response?.url || '').filter(Boolean)
    if (images.length > 0) {
      formData.images = images
      formData.thumbnail = images[0] // 第一张图片作为缩略图
    }

    // 处理特色数据
    const features = {}
    formData.features.forEach(feature => {
      features[feature] = true
    })

    // 过滤空规格
    const specifications = formData.specifications.filter(spec => spec.name && spec.value)

    // 提交数据
    const submitData = {
      ...formData,
      features,
      specifications
    }

    const response = await createProduct(submitData)
    if (response.success) {
      ElMessage.success('商品创建成功')
      router.push('/products/list')
    } else {
      ElMessage.error(response.message || '商品创建失败')
    }
  } catch (error) {
    console.error('保存商品失败:', error)
    ElMessage.error('商品创建失败')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.product-add {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-tip {
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
}

.spec-container {
  width: 100%;
}

.spec-item {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.spec-item:last-child {
  margin-bottom: 16px;
}
</style>