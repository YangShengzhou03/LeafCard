<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-cards">
              <el-icon><CreditCard /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalCards }}</div>
              <div class="stat-label">总卡密数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon used-cards">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.usedCards }}</div>
              <div class="stat-label">已使用数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon today-cards">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.todayCards }}</div>
              <div class="stat-label">今日新增</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon specs">
              <el-icon><List /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalSpecs }}</div>
              <div class="stat-label">规格类型</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card header="卡密使用趋势">
          <div class="chart-container">
            <div class="placeholder-chart">
              <el-icon><TrendCharts /></el-icon>
              <p>卡密使用趋势图表</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="规格分布">
          <div class="chart-container">
            <div class="placeholder-chart">
              <el-icon><PieChart /></el-icon>
              <p>规格分布图表</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card header="最近操作">
          <el-table :data="recentOperations" style="width: 100%">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="action" label="操作" />
            <el-table-column prop="details" label="详情" />
            <el-table-column prop="user" label="操作人" width="120" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  totalCards: 1250,
  usedCards: 843,
  todayCards: 15,
  totalSpecs: 8
})

const recentOperations = ref([
  {
    time: '2024-01-15 14:30',
    action: '添加卡密',
    details: '添加了50张VIP会员卡',
    user: 'admin'
  },
  {
    time: '2024-01-15 13:15',
    action: '验证卡密',
    details: '卡密验证成功 - 规格类型: 月卡',
    user: 'user001'
  },
  {
    time: '2024-01-15 11:20',
    action: '删除规格',
    details: '删除了"测试规格"类型',
    user: 'admin'
  },
  {
    time: '2024-01-15 10:05',
    action: '添加规格',
    details: '新增了"年卡"规格类型',
    user: 'admin'
  }
])

onMounted(() => {
  // 这里可以调用API获取实时数据
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  margin-bottom: 0;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon.total-cards {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.used-cards {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.today-cards {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.specs {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.mt-20 {
  margin-top: 20px;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-chart {
  text-align: center;
  color: #909399;
}

.placeholder-chart .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>