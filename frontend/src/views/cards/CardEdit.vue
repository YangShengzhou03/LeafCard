<template>
  <div class="card-edit-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h3>编辑卡</h3>
          <div class="header-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="cardFormRef"
        :model="cardForm"
        :rules="cardRules"
        label-width="120px"
        class="card-form"
        v-loading="loading"
      >
        <el-form-item label="卡ID">
          <el-input v-model="cardForm.id" disabled />
        </el-form-item>

        <el-form-item label="卡名称" prop="name">
          <el-input
            v-model="cardForm.name"
            placeholder="请输入卡名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="cardForm.description"
            type="textarea"
            placeholder="请输入卡描述"
            :rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="cardForm.price"
            :min="0"
            :precision="2"
            :step="0.01"
            placeholder="请输入价格"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="cardForm.status">
            <el-radio value="active">上架</el-radio>
            <el-radio value="inactive">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="关联商品" prop="products">
          <div class="product-selector">
            <el-button type="primary" @click="showProductSelector = true">
              选择商品
            </el-button>
            <div v-if="selectedProducts.length > 0" class="selected-products">
              <el-tag
                v-for="product in selectedProducts"
                :key="product.id"
                closable
                @close="removeProduct(product.id)"
                class="product-tag"
              >
                {{ product.name }}
              </el-tag>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="卡图片" prop="image">
          <el-upload
            class="card-image-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
            :headers="uploadHeaders"
          >
            <img v-if="cardForm.image" :src="cardForm.image" class="card-image" />
            <el-icon v-else class="card-image-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：300x300px，支持jpg、png格式，大小不超过2MB</div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 商品选择对话框 -->
    <el-dialog
      v-model="showProductSelector"
      title="选择商品"
      width="800px"
    >
      <div class="product-selector-content">
        <el-input
          v-model="productSearchKeyword"
          placeholder="搜索商品名称"
          @input="searchProducts"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-table
          v-loading="productsLoading"
          :data="filteredProducts"
          style="width: 100%; margin-top: 20px"
          @selection-change="handleProductSelectionChange"
          :row-key="row => row.id"
          :default-selection="selectedProducts"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="商品名称" min-width="150" />
          <el-table-column prop="price" label="价格" width="100" />
          <el-table-column prop="category_name" label="分类" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                {{ scope.row.status === 'active' ? '上架' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="dialog-footer">
          <el-button @click="showProductSelector = false">取消</el-button>
          <el-button type="primary" @click="confirmProductSelection">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { getCardDetail, updateCard } from '@/api/card'
import { getProducts } from '@/api/product'

const router = useRouter()
const route = useRoute()
const cardFormRef = ref()
const loading = ref(false)
const saving = ref(false)
const showProductSelector = ref(false)
const productsLoading = ref(false)
const productSearchKeyword = ref('')
const allProducts = ref([])
const tempSelectedProducts = ref([])
const selectedProducts = ref([])

// 获取卡ID
const cardId = route.params.id

// 上传相关
const uploadUrl = '/api/upload/image'
const uploadHeaders = computed(() => {
  // 这里可以添加认证token等
  return {}
})

// 卡表单
const cardForm = reactive({
  id: '',
  name: '',
  description: '',
  price: 0,
  status: 'active',
  image: '',
  product_ids: []
})

// 表单验证规则
const cardRules = {
  name: [
    { required: true, message: '请输入卡名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入卡描述', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 过滤后的商品列表
const filteredProducts = computed(() => {
  if (!productSearchKeyword.value) {
    return allProducts.value
  }
  return allProducts.value.filter(product =>
    product.name.toLowerCase().includes(productSearchKeyword.value.toLowerCase())
  )
})

// 获取卡详情
const fetchCardDetail = async () => {
  loading.value = true
  try {
    const response = await getCardDetail(cardId)
    if (response.success) {
      const cardData = response.data
      
      // 填充表单
      Object.keys(cardForm).forEach(key => {
        if (cardData[key] !== undefined) {
          cardForm[key] = cardData[key]
        }
      })
      
      // 处理关联商品
      if (cardData.products && cardData.products.length > 0) {
        selectedProducts.value = cardData.products
        cardForm.product_ids = selectedProducts.value.map(product => product.id)
      }
    } else {
      ElMessage.error(response.message || '获取卡详情失败')
      router.push('/cards/list')
    }
  } catch (error) {
    console.error('获取卡详情失败:', error)
    ElMessage.error('获取卡详情失败，请检查网络连接')
    router.push('/cards/list')
  } finally {
    loading.value = false
  }
}

// 获取商品列表
const fetchProducts = async () => {
  productsLoading.value = true
  try {
    const response = await getProducts({ page: 1, limit: 1000 })
    if (response.success) {
      allProducts.value = response.data.list
    } else {
      ElMessage.error(response.message || '获取商品列表失败')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败，请检查网络连接')
  } finally {
    productsLoading.value = false
  }
}

// 搜索商品
const searchProducts = () => {
  // 由于使用了computed，这里不需要额外操作
}

// 商品选择变化
const handleProductSelectionChange = (selection) => {
  tempSelectedProducts.value = selection
}

// 确认商品选择
const confirmProductSelection = () => {
  selectedProducts.value = [...tempSelectedProducts.value]
  cardForm.product_ids = selectedProducts.value.map(product => product.id)
  showProductSelector.value = false
}

// 移除已选商品
const removeProduct = (productId) => {
  selectedProducts.value = selectedProducts.value.filter(product => product.id !== productId)
  cardForm.product_ids = selectedProducts.value.map(product => product.id)
}

// 图片上传成功
const handleImageSuccess = (response) => {
  if (response.success) {
    cardForm.image = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '图片上传失败')
  }
}

// 图片上传前校验
const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传图片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 保存卡
const handleSave = async () => {
  if (!cardFormRef.value) return

  try {
    await cardFormRef.value.validate()
    saving.value = true

    const response = await updateCard(cardId, cardForm)
    if (response.success) {
      ElMessage.success('卡更新成功')
      router.push('/cards/list')
    } else {
      ElMessage.error(response.message || '更新卡失败')
    }
  } catch (error) {
    if (error !== 'validation failed') {
      console.error('更新卡失败:', error)
      ElMessage.error('更新卡失败，请检查网络连接')
    }
  } finally {
    saving.value = false
  }
}

// 取消
const handleCancel = () => {
  router.push('/cards/list')
}

// 初始化
onMounted(async () => {
  await fetchCardDetail()
  fetchProducts()
})
</script>

<style scoped>
.card-edit-container {
  padding: 20px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.card-form {
  padding: 20px 0;
}

.product-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-products {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.product-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.card-image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-image-uploader:hover {
  border-color: #409eff;
}

.card-image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.card-image {
  width: 178px;
  height: 178px;
  object-fit: cover;
  display: block;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.product-selector-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-edit-container {
    padding: 10px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>