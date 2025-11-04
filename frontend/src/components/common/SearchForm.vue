<template>
  <div class="search-form">
    <el-form
      ref="searchFormRef"
      :model="formData"
      :inline="inline"
      :label-width="labelWidth"
      @submit.prevent="handleSearch"
    >
      <el-form-item
        v-for="field in fields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
        :rules="field.rules"
      >
        <!-- 输入框 -->
        <el-input
          v-if="field.type === 'input'"
          v-model="formData[field.prop]"
          :placeholder="field.placeholder"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :prefix-icon="field.prefixIcon"
          :suffix-icon="field.suffixIcon"
          :size="field.size || 'default'"
          @keyup.enter="handleSearch"
        />

        <!-- 选择框 -->
        <el-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.prop]"
          :placeholder="field.placeholder"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :multiple="field.multiple"
          :size="field.size || 'default'"
          style="width: 100%;"
        >
          <el-option
            v-for="option in field.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :disabled="option.disabled"
          />
        </el-select>

        <!-- 日期选择器 -->
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="formData[field.prop]"
          :type="field.dateType || 'date'"
          :placeholder="field.placeholder"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :format="field.format"
          :value-format="field.valueFormat"
          :size="field.size || 'default'"
          style="width: 100%;"
        />

        <!-- 数字输入框 -->
        <el-input-number
          v-else-if="field.type === 'number'"
          v-model="formData[field.prop]"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :precision="field.precision"
          :disabled="field.disabled"
          :size="field.size || 'default'"
          controls-position="right"
          style="width: 100%;"
        />

        <!-- 开关 -->
        <el-switch
          v-else-if="field.type === 'switch'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
          :active-text="field.activeText"
          :inactive-text="field.inactiveText"
        />

        <!-- 自定义插槽 -->
        <slot
          v-else-if="field.type === 'custom'"
          :name="field.slot"
          :field="field"
          :value="formData[field.prop]"
          :updateValue="(val) => updateFieldValue(field.prop, val)"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item class="search-form-actions">
        <el-button
          type="primary"
          :icon="Search"
          @click="handleSearch"
          :loading="loading"
          :size="buttonSize"
        >
          搜索
        </el-button>
        <el-button
          :icon="Refresh"
          @click="handleReset"
          :size="buttonSize"
        >
          重置
        </el-button>
        <slot name="extra-actions"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  // 表单字段配置
  fields: {
    type: Array,
    required: true
  },
  // 表单数据
  modelValue: {
    type: Object,
    default: () => ({})
  },
  // 是否行内显示
  inline: {
    type: Boolean,
    default: true
  },
  // 标签宽度
  labelWidth: {
    type: String,
    default: '80px'
  },
  // 按钮大小
  buttonSize: {
    type: String,
    default: 'default'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits定义
const emit = defineEmits(['search', 'reset', 'update:modelValue'])

// 内部状态
const searchFormRef = ref()
const formData = reactive({})

// 初始化表单数据
const initFormData = () => {
  props.fields.forEach(field => {
    formData[field.prop] = props.modelValue[field.prop] || field.defaultValue || ''
  })
}

// 监听字段变化
watch(() => props.fields, initFormData, { immediate: true })

// 监听表单数据变化
watch(formData, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

// 方法
const updateFieldValue = (prop, value) => {
  formData[prop] = value
}

const handleSearch = () => {
  searchFormRef.value?.validate((valid) => {
    if (valid) {
      emit('search', { ...formData })
    }
  })
}

const handleReset = () => {
  searchFormRef.value?.resetFields()
  // 重置为默认值
  props.fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      formData[field.prop] = field.defaultValue
    }
  })
  emit('reset', { ...formData })
}

// 暴露方法给父组件
defineExpose({
  validate: () => searchFormRef.value?.validate(),
  resetFields: () => searchFormRef.value?.resetFields(),
  getFormData: () => ({ ...formData })
})
</script>

<style scoped>
.search-form {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.search-form-actions {
  margin-bottom: 0;
}

.search-form-actions .el-button {
  margin-right: 8px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .search-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 16px;
    width: 100%;
  }
  
  .search-form :deep(.el-form-item__content) {
    width: 100%;
  }
  
  .search-form-actions {
    text-align: right;
  }
}
</style>