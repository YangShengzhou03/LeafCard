<template>
  <div class="admin-dashboard">
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span>管理员仪表盘</span>
        </div>
      </template>
      
      <div class="dashboard-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><Key /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">卡密总数</div>
                  <div class="stat-value">{{ stats.cardKeyCount }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><CircleCheck /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">已使用卡密</div>
                  <div class="stat-value">{{ stats.usedCardKeys }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><Document /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">操作日志</div>
                  <div class="stat-value">{{ stats.logCount }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 商品规格使用统计 -->
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>商品规格使用统计</span>
                </div>
              </template>
              <div class="spec-stats">
                <el-table :data="specStats" style="width: 100%" v-loading="loading" :scroll="{ x: 'max-content' }">
                  <el-table-column prop="productName" label="商品名称" width="150" />
                  <el-table-column prop="specName" label="规格名称" width="120" />
                  <el-table-column prop="price" label="价格" width="100">
                    <template #default="scope">
                      ¥{{ scope.row.price }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalKeys" label="卡密总数" width="100" />
                  <el-table-column prop="usedKeys" label="已使用" width="80" />
                  <el-table-column prop="usageRate" label="使用率" width="100">
                    <template #default="scope">
                      <el-progress 
                        :percentage="scope.row.usageRate" 
                        :show-text="false"
                        :color="getUsageColor(scope.row.usageRate)"
                      />
                      <span style="margin-left: 8px">{{ scope.row.usageRate }}%</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="revenue" label="收入" width="120">
                    <template #default="scope">
                      ¥{{ scope.row.revenue }}
                    </template>
                  </el-table-column>
                  <el-table-column label="趋势" width="100">
                    <template #default="scope">
                      <el-tag :type="scope.row.trend > 0 ? 'success' : scope.row.trend < 0 ? 'danger' : 'info'">
                        {{ scope.row.trend > 0 ? '↑' : scope.row.trend < 0 ? '↓' : '→' }}
                        {{ Math.abs(scope.row.trend) }}%
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>系统信息</span>
                </div>
              </template>
              <div class="system-info">
                <div class="info-item">
                  <span class="info-label">系统版本：</span>
                  <span class="info-value">枫叶卡管 v1.0.0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">运行时间：</span>
                  <span class="info-value">{{ uptime }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">系统状态：</span>
                  <span class="info-value">正常运行</span>
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
import { Key, CircleCheck, Document } from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  cardKeyCount: 0,
  usedCardKeys: 0,
  logCount: 0
})

// 系统运行时间
const uptime = ref('0天0小时0分钟')
const loading = ref(false)

// 商品规格使用统计
const specStats = ref([
  {
    productName: 'VIP会员',
    specName: '月卡',
    price: 29.9,
    totalKeys: 200,
    usedKeys: 156,
    usageRate: 78,
    revenue: 4680,
    trend: 12
  },
  {
    productName: 'VIP会员',
    specName: '季卡',
    price: 79.9,
    totalKeys: 150,
    usedKeys: 89,
    usageRate: 59,
    revenue: 7111,
    trend: 8
  },
  {
    productName: 'VIP会员',
    specName: '年卡',
    price: 199.9,
    totalKeys: 80,
    usedKeys: 45,
    usageRate: 56,
    revenue: 8995,
    trend: 5
  },
  {
    productName: '高级功能',
    specName: '基础版',
    price: 49.9,
    totalKeys: 120,
    usedKeys: 67,
    usageRate: 56,
    revenue: 3343,
    trend: -3
  },
  {
    productName: '高级功能',
    specName: '专业版',
    price: 99.9,
    totalKeys: 60,
    usedKeys: 28,
    usageRate: 47,
    revenue: 2797,
    trend: 15
  }
])

const getUsageColor = (rate) => {
  if (rate >= 80) return '#67C23A'
  if (rate >= 60) return '#E6A23C'
  if (rate >= 40) return '#409EFF'
  return '#F56C6C'
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true
    // 模拟数据加载
    stats.value = {
      cardKeyCount: 500,
      usedCardKeys: 325,
      logCount: 1200
    }
    
    uptime.value = '15天8小时30分钟'
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
  min-height: 100vh;
  background-color: #f0f2f5;
}

.dashboard-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #409EFF;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  margin-right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409EFF;
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
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

/* 商品规格统计样式 */
.spec-stats {
  width: 100%;
  overflow-x: auto;
}

.spec-stats .el-table {
  width: 100% !important;
  min-width: 100%;
}

/* 系统信息卡片样式 */
.system-info {
  padding: 16px 0;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 120px;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.info-label::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #409EFF;
  border-radius: 50%;
  margin-right: 8px;
}

.info-value {
  color: #303133;
  font-weight: 600;
  font-size: 15px;
  padding: 4px 12px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stat-item {
    padding: 20px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 24px;
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
    font-size: 22px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px;
  }
  
  .info-label {
    width: auto;
    margin-bottom: 6px;
  }
  
  .info-value {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .stat-item {
    padding: 12px;
  }
  
  .stat-icon {
    width: 44px;
    height: 44px;
  }
  
  .stat-icon .el-icon {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-title {
    font-size: 13px;
  }
}
</style>