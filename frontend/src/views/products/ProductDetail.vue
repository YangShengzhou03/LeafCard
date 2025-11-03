<template>
  <div class="product-detail" v-loading="loading">
    <el-card v-if="product">
      <template #header>
        <div class="card-header">
          <span>商品详情</span>
          <div>
            <el-button @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="24">
        <el-col :span="12">
          <!-- 商品图片 -->
          <div class="product-images">
            <el-carousel :interval="4000" type="card" height="300px">
              <el-carousel-item v-for="(image, index) in product.images" :key="index">
                <el-image
                  :src="image"
                  fit="cover"
                  style="width: 100%; height: 300px"
                />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
        <el-col :span="12">
          <!-- 商品基本信息 -->
          <div class="product-info">
            <h2>{{ product.name }}</h2>
            <div class="info-item">
              <span class="label">SKU：</span>
              <span>{{ product.sku }}</span>
            </div>
            <div class="info-item">
              <span class="label">分类：</span>
              <span>{{ product.categoryName }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态：</span>
              <el-tag :type="getStatusTagType(product.status)">
                {{ getStatusLabel(product.status) }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">价格：</span>
              <span class="price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
            </div>
            <div class="info-item">
              <span class="label">库存：</span>
              <span :class="{ 'low-stock': product.stock < 10 }">{{ product.stock }}</span>
            </div>
            <div class="info-item">
              <span class="label">销量：</span>
              <span>{{ product.saleCount }}</span>
            </div>
            <div class="info-item">
              <span class="label">浏览量：</span>
              <span>{{ product.viewCount }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span>{{ formatDate(product.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">更新时间：</span>
              <span>{{ formatDate(product.updatedAt) }}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <!-- 商品描述 -->
      <div class="product-description">
        <h3>商品描述</h3>
        <p>{{ product.description || '暂无描述' }}</p>
      </div>

      <el-divider />

      <!-- 商品详情 -->
      <div class="product-details">
        <h3>商品详情</h3>
        <div v-html="product.details || '暂无详情'"></div>
      </div>

      <el-divider />

      <!-- 商品特色 -->
      <div class="product-features">
        <h3>商品特色</h3>
        <div class="feature-tags">
          <el-tag v-if="product.isFeatured" type="success">推荐商品</el-tag>
          <el-tag v-if="product.isHot" type="danger">热销商品</el-tag>
          <el-tag v-if="product.isNew" type="warning">新品</el-tag>
        </div>
      </div>

      <el-divider />

      <!-- 商品规格 -->
      <div class="product-specifications">
        <h3>商品规格</h3>
        <el-table :data="product.specifications" border>
          <el-table-column prop="name" label="规格名称" />
          <el-table-column prop="value" label="规格值" />
        </el-table>
      </div>
    </el-card>

    <!-- 空状态 -->
    <el-empty v-else description="商品不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductDetail } from '@/api/product'

const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(false)

// 商品数据
const product = ref(null)

// 商品ID
const productId = ref(null)

onMounted(() => {
  // 获取商品ID
  productId.value = route.params.id
  
  // 加载商品详情
  loadProductDetail()
})

// 加载商品详情
const loadProductDetail = async () => {
  if (!productId.value) return
  
  loading.value = true
  try {
    const response = await getProductDetail(productId.value)
    if (response.success && response.data) {
      product.value = response.data
    } else {
      ElMessage.error(response.message || '获取商品详情失败')
    }
  } catch (error) {
    console.error('加载商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

// 返回列表
const handleBack = () => {
  router.push('/products/list')
}

// 编辑商品
const handleEdit = () => {
  router.push(`/products/edit/${productId.value}`)
}

// 状态标签类型
const getStatusTagType = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'info'
    case 'draft': return 'warning'
    default: return 'info'
  }
}

// 状态标签文本
const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return '上架'
    case 'inactive': return '下架'
    case 'draft': return '草稿'
    default: return status
  }
}

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<style scoped>
.product-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-images {
  margin-bottom: 20px;
}

.product-info {
  padding: 0 20px;
}

.product-info h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  color: #303133;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.label {
  width: 80px;
  color: #606266;
  font-weight: 500;
}

.price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
  margin-right: 10px;
}

.original-price {
  color: #909399;
  text-decoration: line-through;
  font-size: 14px;
}

.low-stock {
  color: #f56c6c;
  font-weight: bold;
}

.product-description,
.product-details,
.product-features,
.product-specifications {
  margin-top: 20px;
}

.product-description h3,
.product-details h3,
.product-features h3,
.product-specifications h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
}

.feature-tags {
  display: flex;
  gap: 10px;
}
</style>