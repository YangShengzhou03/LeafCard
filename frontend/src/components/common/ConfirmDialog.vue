<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="400px"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    center
  >
    <div class="confirm-dialog-content">
      <div class="confirm-icon" v-if="type">
        <el-icon :size="48" :color="iconColor">
          <component :is="iconComponent" />
        </el-icon>
      </div>
      <div class="confirm-message">
        <p v-if="message">{{ message }}</p>
        <slot v-else></slot>
      </div>
    </div>
    
    <template #footer>
      <div class="confirm-dialog-footer">
        <el-button @click="handleCancel" :size="buttonSize">
          {{ cancelText }}
        </el-button>
        <el-button 
          type="primary" 
          @click="handleConfirm" 
          :loading="loading"
          :size="buttonSize"
        >
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Warning, 
  QuestionFilled, 
  InfoFilled, 
  SuccessFilled, 
  CircleCloseFilled 
} from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'warning', // warning, info, success, error, question
    validator: (value) => ['warning', 'info', 'success', 'error', 'question'].includes(value)
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  buttonSize: {
    type: String,
    default: 'default'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits定义
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const iconComponent = computed(() => {
  const iconMap = {
    warning: Warning,
    info: InfoFilled,
    success: SuccessFilled,
    error: CircleCloseFilled,
    question: QuestionFilled
  }
  return iconMap[props.type] || Warning
})

const iconColor = computed(() => {
  const colorMap = {
    warning: '#E6A23C',
    info: '#409EFF',
    success: '#67C23A',
    error: '#F56C6C',
    question: '#409EFF'
  }
  return colorMap[props.type] || '#E6A23C'
})

// 方法
const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}
</script>

<style scoped>
.confirm-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.confirm-icon {
  margin-bottom: 16px;
}

.confirm-message {
  text-align: center;
  line-height: 1.5;
  color: #606266;
}

.confirm-dialog-footer {
  text-align: center;
}

.confirm-dialog-footer .el-button {
  margin: 0 10px;
}
</style>