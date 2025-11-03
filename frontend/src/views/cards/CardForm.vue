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
        <el-form-item label="卡号" prop="cardNumber">
          <el-input
            v-model="formData.cardNumber"
            placeholder="请输入卡号"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="卡等级" prop="cardLevel">
          <el-select v-model="formData.cardLevel" placeholder="请选择卡等级">
            <el-option
              v-for="level in cardLevels"
              :key="level.value"
              :label="level.label"
              :value="level.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品类别" prop="productCategory">
          <el-select v-model="formData.productCategory" placeholder="请选择商品类别">
            <el-option
              v-for="category in productCategories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker
            v-model="formData.expireTime"
            type="datetime"
            placeholder="选择过期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
          <div class="form-tip">留空表示永久有效</div>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
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
import type { Card } from '@/api/card'
import { addCard, updateCard, getCardDetail } from '@/api/card'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const isEdit = ref(false)
const cardId = ref<number>()

// 表单数据
const formData = reactive<Card>({
  cardNumber: '',
  cardLevel: '',
  productCategory: '',
  cardStatus: 0,
  expireTime: '',
  remark: '',
  rechargeTimes: 0
})

// 表单验证规则
const formRules: FormRules = {
  cardNumber: [
    { required: true, message: '请输入卡号', trigger: 'blur' },
    { min: 6, max: 50, message: '卡号长度在 6 到 50 个字符', trigger: 'blur' }
  ],
  cardLevel: [
    { required: true, message: '请选择卡等级', trigger: 'change' }
  ],
  productCategory: [
    { required: true, message: '请选择商品类别', trigger: 'change' }
  ]
}

// 枚举数据
const cardLevels = [
  { value: '普通会员', label: '普通会员' },
  { value: '超级会员', label: '超级会员' },
  { value: '钻石会员', label: '钻石会员' }
]

const productCategories = [
  { value: '视频会员', label: '视频会员' },
  { value: '音乐会员', label: '音乐会员' },
  { value: '电商优惠券', label: '电商优惠券' },
  { value: '游戏点卡', label: '游戏点卡' }
]

// 加载卡详情
const loadCardDetail = async (id: number) => {
  try {
    const data = await getCardDetail(id)
    Object.assign(formData, data)
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
      await updateCard(formData)
      ElMessage.success('更新成功')
    } else {
      await addCard(formData)
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