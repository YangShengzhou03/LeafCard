<template>
  <div class="data-table">
    <!-- 表格工具栏 -->
    <div class="table-toolbar" v-if="showToolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left"></slot>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right"></slot>
        <el-input
          v-if="searchable"
          v-model="searchQuery"
          placeholder="搜索..."
          prefix-icon="Search"
          clearable
          @input="handleSearch"
          style="width: 200px; margin-left: 10px;"
        />
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      :data="data"
      v-loading="loading"
      :height="height"
      :stripe="stripe"
      :border="border"
      :size="size"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        :reserve-selection="true"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        :index="getIndex"
      />

      <!-- 数据列 -->
      <template v-for="column in columns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :sortable="column.sortable"
          :align="column.align || 'left'"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        >
          <template #default="scope">
            <!-- 自定义列内容 -->
            <slot
              v-if="column.slot"
              :name="column.slot"
              :row="scope.row"
              :column="column"
              :$index="scope.$index"
            />
            <!-- 默认列内容 -->
            <span v-else>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="hasActions"
        label="操作"
        :width="actionWidth"
        :fixed="actionFixed"
        align="center"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :$index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="table-pagination" v-if="paginated">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props定义
const props = defineProps({
  // 数据相关
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },

  // 表格配置
  columns: {
    type: Array,
    required: true
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  stripe: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default' // large, default, small
  },

  // 功能配置
  selectable: {
    type: Boolean,
    default: false
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  paginated: {
    type: Boolean,
    default: true
  },
  showToolbar: {
    type: Boolean,
    default: true
  },

  // 分页配置
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },

  // 操作列配置
  hasActions: {
    type: Boolean,
    default: false
  },
  actionWidth: {
    type: [String, Number],
    default: 200
  },
  actionFixed: {
    type: String,
    default: 'right' // true, left, right
  }
})

// Emits定义
const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'selection-change',
  'sort-change',
  'search',
  'refresh'
])

// 内部状态
const searchQuery = ref('')

// 计算属性
const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

// 方法
const getIndex = (index) => {
  return (props.currentPage - 1) * props.pageSize + index + 1
}

const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

const handleSortChange = (sort) => {
  emit('sort-change', sort)
}

const handleSizeChange = (size) => {
  emit('update:pageSize', size)
  emit('refresh')
}

const handleCurrentChange = (page) => {
  emit('update:currentPage', page)
  emit('refresh')
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

// 监听搜索框变化
watch(searchQuery, (newVal) => {
  if (!newVal) {
    emit('search', '')
  }
})
</script>

<style scoped>
.data-table {
  width: 100%;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>