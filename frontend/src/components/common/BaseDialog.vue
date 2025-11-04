<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :modal-class="modalClass"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="handleBeforeClose"
    :center="center"
    :align-center="alignCenter"
    :destroy-on-close="destroyOnClose"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <!-- 对话框内容 -->
    <div class="dialog-content" :style="contentStyle">
      <slot></slot>
    </div>

    <!-- 对话框底部 -->
    <template #footer v-if="!hideFooter">
      <div class="dialog-footer">
        <slot name="footer">
          <el-button
            v-if="showCancelButton"
            @click="handleCancel"
            :disabled="loading"
            :size="buttonSize"
          >
            {{ cancelText }}
          </el-button>
          <el-button
            v-if="showConfirmButton"
            type="primary"
            :loading="loading"
            @click="handleConfirm"
            :size="buttonSize"
          >
            {{ confirmText }}
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, watch } from 'vue'

// Props定义
const props = defineProps({
  // 基础属性
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '50%'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  top: {
    type: String,
    default: '15vh'
  },
  modal: {
    type: Boolean,
    default: true
  },
  modalClass: {
    type: String,
    default: ''
  },
  appendToBody: {
    type: Boolean,
    default: false
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  center: {
    type: Boolean,
    default: false
  },
  alignCenter: {
    type: Boolean,
    default: false
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },

  // 底部按钮配置
  hideFooter: {
    type: Boolean,
    default: false
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  buttonSize: {
    type: String,
    default: 'default'
  },
  loading: {
    type: Boolean,
    default: false
  },

  // 内容样式
  contentStyle: {
    type: Object,
    default: () => ({})
  }
})

// Emits定义
const emit = defineEmits([
  'update:modelValue',
  'open',
  'opened',
  'close',
  'closed',
  'before-close',
  'confirm',
  'cancel'
])

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 方法
const handleBeforeClose = (done) => {
  emit('before-close', done)
}

const handleOpen = () => {
  emit('open')
}

const handleOpened = () => {
  emit('opened')
}

const handleClose = () => {
  emit('close')
}

const handleClosed = () => {
  emit('closed')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}
</script>

<style scoped>
.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  margin-left: 10px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .dialog-content {
    max-height: 60vh;
  }
}
</style>