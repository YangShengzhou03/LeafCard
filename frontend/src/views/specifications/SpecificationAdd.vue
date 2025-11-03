<template>
  <div class="spec-add">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>新增规格</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规格名称" />
        </el-form-item>

        <el-form-item label="规格编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入规格编码" />
        </el-form-item>

        <el-form-item label="规格类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择规格类型" @change="handleTypeChange">
            <el-option label="文本" value="text" />
            <el-option label="数字" value="number" />
            <el-option label="选项" value="option" />
            <el-option label="布尔" value="boolean" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否必填" prop="required">
          <el-switch v-model="form.required" />
        </el-form-item>

        <el-form-item label="默认值" prop="defaultValue">
          <!-- 文本类型 -->
          <el-input
            v-if="form.type === 'text'"
            v-model="form.defaultValue"
            placeholder="请输入默认值"
          />
          <!-- 数字类型 -->
          <el-input-number
            v-else-if="form.type === 'number'"
            v-model="form.defaultValue"
            placeholder="请输入默认值"
            style="width: 100%"
          />
          <!-- 选项类型 -->
          <el-select
            v-else-if="form.type === 'option'"
            v-model="form.defaultValue"
            placeholder="请选择默认值"
            style="width: 100%"
          >
            <el-option
              v-for="option in form.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <!-- 布尔类型 -->
          <el-switch
            v-else-if="form.type === 'boolean'"
            v-model="form.defaultValue"
          />
          <!-- 未选择类型 -->
          <el-input
            v-else
            placeholder="请先选择规格类型"
            disabled
          />
        </el-form-item>

        <!-- 选项类型的选项列表 -->
        <el-form-item
          v-if="form.type === 'option'"
          label="选项列表"
          prop="options"
        >
          <div class="options-list">
            <div
              v-for="(option, index) in form.options"
              :key="index"
              class="option-item"
            >
              <el-input
                v-model="option.label"
                placeholder="选项名称"
                style="width: 150px; margin-right: 10px"
              />
              <el-input
                v-model="option.value"
                placeholder="选项值"
                style="width: 150px; margin-right: 10px"
              />
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="removeOption(index)"
                :disabled="form.options.length <= 1"
              />
            </div>
            <el-button
              type="primary"
              icon="Plus"
              @click="addOption"
              style="margin-top: 10px"
            >
              添加选项
            </el-button>
          </div>
        </el-form-item>

        <!-- 数字类型的数值范围 -->
        <template v-if="form.type === 'number'">
          <el-form-item label="最小值" prop="minValue">
            <el-input-number
              v-model="form.minValue"
              placeholder="请输入最小值"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="最大值" prop="maxValue">
            <el-input-number
              v-model="form.maxValue"
              placeholder="请输入最大值"
              style="width: 100%"
            />
          </el-form-item>
        </template>

        <el-form-item label="排序" prop="sortOrder">
          <el-input-number
            v-model="form.sortOrder"
            :min="0"
            placeholder="请输入排序值"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saving">
            保存
          </el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'```
import { createSpecification } from '@/api/specification'
```
const router = useRouter()
const formRef = ref(null)
const saving = ref(false)

// 表单数据
const form = reactive({
  name: '',
  code: '',
  type: '',
  required: false,
  defaultValue: '',
  options: [{ label: '', value: '' }],
  minValue: null,
  maxValue: null,
  sortOrder: 0,
  status: 'active',
  remark: ''
})

// 表单验证规则
const rules = computed(() => {
  const baseRules = {
    name: [
      { required: true, message: '请输入规格名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入规格编码', trigger: 'blur' },
      { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '编码只能包含字母、数字和下划线，且以字母开头', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择规格类型', trigger: 'change' }
    ],
    sortOrder: [
      { required: true, message: '请输入排序值', trigger: 'blur' },
      { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  }

  // 选项类型的特殊验证
  if (form.type === 'option') {
    baseRules.options = [
      {
        validator: (rule, value, callback) => {
          if (!value || value.length === 0) {
            callback(new Error('请至少添加一个选项'))
          } else {
            const hasEmptyOption = value.some(option => !option.label || !option.value)
            if (hasEmptyOption) {
              callback(new Error('选项名称和值不能为空'))
            } else {
              const values = value.map(option => option.value)
              const uniqueValues = new Set(values)
              if (values.length !== uniqueValues.size) {
                callback(new Error('选项值不能重复'))
              } else {
                callback()
              }
            }
          }
        },
        trigger: 'change'
      }
    ]
  }

  // 数字类型的特殊验证
  if (form.type === 'number') {
    baseRules.minValue = [
      { type: 'number', message: '最小值必须为数字', trigger: 'blur' }
    ]
    baseRules.maxValue = [
      { type: 'number', message: '最大值必须为数字', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (form.minValue !== null && value !== null && form.minValue > value) {
            callback(new Error('最大值不能小于最小值'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  return baseRules
})

// 类型改变处理
const handleTypeChange = (value) => {
  // 重置默认值
  form.defaultValue = value === 'boolean' ? false : ''
  
  // 重置选项
  if (value !== 'option') {
    form.options = [{ label: '', value: '' }]
  }
  
  // 重置数值范围
  if (value !== 'number') {
    form.minValue = null
    form.maxValue = null
  }
}

// 添加选项
const addOption = () => {
  form.options.push({ label: '', value: '' })
}

// 移除选项
const removeOption = (index) => {
  form.options.splice(index, 1)
}

// 保存
const handleSave = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    saving.value = true

    // 准备提交数据
    const submitData = {
      name: form.name,
      code: form.code,
      type: form.type,
      required: form.required,
      defaultValue: form.defaultValue,
      sortOrder: form.sortOrder,
      status: form.status,
      remark: form.remark
    }

    // 根据类型添加特定数据
    if (form.type === 'option') {
      submitData.options = form.options
    } else if (form.type === 'number') {
      submitData.minValue = form.minValue
      submitData.maxValue = form.maxValue
    }

    const response = await createSpecification(submitData)
    if (response.success) {
      ElMessage.success('规格添加成功')
      router.push('/specifications/list')
    } else {
      ElMessage.error(response.message || '规格添加失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
  form.options = [{ label: '', value: '' }]
}

// 返回列表
const handleBack = () => {
  router.push('/specifications/list')
}
</script>

<style scoped>
.spec-add {
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

.options-list {
  width: 100%;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>