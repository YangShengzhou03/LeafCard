<template>
  <div class="admin-dashboard">
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span>管理员仪表盘</span>
          <el-button type="text" @click="refreshData" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      
      <div class="dashboard-content">
        <!-- 第一行：核心统计数据 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <div class="stat-card primary">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><Key /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">卡密总数</div>
                  <div class="stat-value">{{ stats.cardKeyCount }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">较上月</span>
                    <span class="trend-value positive">+{{ stats.cardKeyGrowth }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="stat-card success">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">已使用卡密</div>
                  <div class="stat-value">{{ stats.usedCardKeys }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">使用率</span>
                    <span class="trend-value">{{ stats.usageRate }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="stat-card warning">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">操作日志</div>
                  <div class="stat-value">{{ stats.logCount }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">今日新增</span>
                    <span class="trend-value">{{ stats.todayLogs }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="stat-card info">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">活跃用户</div>
                  <div class="stat-value">{{ stats.activeUsers }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">本月新增</span>
                    <span class="trend-value">{{ stats.newUsers }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 第二行：图表和详细数据 -->
        <el-row :gutter="20" class="charts-row">
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>卡密使用趋势</span>
                </div>
              </template>
              <div class="chart-container">
                <div class="trend-chart">
                  <div class="trend-item" v-for="(item, index) in usageTrend" :key="index">
                    <div class="trend-label">{{ item.date }}</div>
                    <div class="trend-bar">
                      <div 
                        class="trend-fill" 
                        :style="{ width: (item.usage / maxUsage) * 100 + '%' }"
                        :class="{ increasing: item.trend === 'up', decreasing: item.trend === 'down' }"
                      ></div>
                    </div>
                    <div class="trend-value">{{ item.usage }}</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>销量前五的商品-规格</span>
                </div>
              </template>
              <div class="top-products">
                <div class="product-item" v-for="(product, index) in topProducts" :key="index">
                  <div class="product-rank">{{ index + 1 }}</div>
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-spec">{{ product.spec }}</div>
                  </div>
                  <div class="product-sales">{{ product.sales }} 张</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>


      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Refresh, Key, Check, Document, User, Plus, List 
} from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  cardKeyCount: 0,
  usedCardKeys: 0,
  logCount: 0,
  activeUsers: 0,
  newUsers: 0,
  cardKeyGrowth: 0,
  usageRate: 0,
  todayLogs: 0,
  apiResponseTime: 0
})

// 系统运行时间
const uptime = ref('0天0小时0分钟')
const loading = ref(false)

// 使用趋势数据
const usageTrend = ref([])

// 销量前五的商品数据
const topProducts = ref([])

// 计算最大使用量用于图表显示
const maxUsage = ref(100)

// 刷新数据
const refreshData = async () => {
  await loadDashboardData()
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true
    // 模拟数据加载
    stats.value = {
      cardKeyCount: 1568,
      usedCardKeys: 892,
      logCount: 3421,
      activeUsers: 156,
      newUsers: 45,
      cardKeyGrowth: 12.5,
      usageRate: 56.9,
      todayLogs: 45,
      apiResponseTime: 128
    }
    
    // 模拟使用趋势数据（实际使用数量）
    usageTrend.value = [
      { date: '周一', usage: 156, trend: 'up' },
      { date: '周二', usage: 189, trend: 'up' },
      { date: '周三', usage: 142, trend: 'down' },
      { date: '周四', usage: 201, trend: 'up' },
      { date: '周五', usage: 234, trend: 'up' },
      { date: '周六', usage: 278, trend: 'up' },
      { date: '周日', usage: 195, trend: 'down' }
    ]
    
    // 计算最大使用量
    maxUsage.value = Math.max(...usageTrend.value.map(item => item.usage))
    
    // 模拟销量前五的商品数据
    topProducts.value = [
      { name: 'VIP会员月卡', spec: '月卡', sales: 568 },
      { name: '在线课程服务', spec: '标准版', sales: 423 },
      { name: '实体礼品卡', spec: '豪华版', sales: 289 },
      { name: 'VIP会员月卡', spec: '季卡', sales: 156 },
      { name: '在线课程服务', spec: '高级版', sales: 98 }
    ]
    
  } catch (error) {
    ElMessage.error('加载仪表盘数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
  background-color: #f5f7fa;
}

.dashboard-card {
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.dashboard-card :deep(.el-card__body) {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

/* 统计卡片样式 - 简约风格 */
.stat-card {
  height: 100%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  padding: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.primary {
  border-left: 4px solid #409eff;
}

.stat-card.success {
  border-left: 4px solid #67c23a;
}

.stat-card.warning {
  border-left: 4px solid #e6a23c;
}

.stat-card.info {
  border-left: 4px solid #909399;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  margin-right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #409eff, #79bbff);
}

.stat-icon .el-icon {
  color: #fff;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.trend-text {
  color: #909399;
}

.trend-value {
  font-weight: 500;
}

.trend-value.positive {
  color: #67c23a;
}

/* 图表卡片样式 */
.chart-card {
  margin-top: 20px;
  border-radius: 4px;
}

.chart-header {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.chart-container {
  padding: 16px 0;
}

/* 趋势图表样式 */
.trend-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trend-label {
  width: 40px;
  font-size: 12px;
  color: #606266;
}

.trend-bar {
  flex: 1;
  height: 8px;
  background-color: #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.trend-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #79bbff);
  transition: width 0.3s ease;
}

.trend-fill.increasing {
  background: linear-gradient(90deg, #67c23a, #95d475);
}

.trend-fill.decreasing {
  background: linear-gradient(90deg, #e6a23c, #eebe77);
}

.trend-value {
  width: 40px;
  font-size: 12px;
  font-weight: 500;
  text-align: right;
}

/* 系统状态样式 */
.system-status {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.status-label {
  font-size: 14px;
  color: #606266;
}

.status-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.status-good {
  color: #67c23a;
}

/* 快速操作样式 */
.actions-card {
  margin-top: 20px;
  border-radius: 4px;
}

.actions-header {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stat-item {
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .stat-item {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .quick-actions {
    justify-content: center;
  }
  
  .trend-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .trend-bar {
    width: 100%;
  }
}

/* 销量前五的商品样式 */
.top-products {
  padding: 16px 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.product-spec {
  font-size: 12px;
  color: #909399;
}

.product-sales {
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
}

@media (max-width: 480px) {
  .stat-item {
    padding: 12px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
  }
  
  .stat-icon .el-icon {
    font-size: 18px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .stat-title {
    font-size: 13px;
  }
}
</style>