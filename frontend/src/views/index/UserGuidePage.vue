<template>
  <div class="user-guide-page">
    <!-- 简洁的头部区域 -->
    <header class="page-header">
      <div class="container">
        <h1>使用指南</h1>
        <p>LeafCard枫叶卡管系统快速入门指南</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <div class="guide-sections">
          <!-- 快速入门部分 -->
          <section class="guide-section">
            <div class="section-header">
              <h2>快速入门</h2>
              <p>新手用户快速上手LeafCard枫叶卡管系统</p>
            </div>
            <div class="guide-content">
              <el-collapse v-model="activeNames" accordion>
                <el-collapse-item name="register" title="注册账号">
                  <div class="collapse-content">
                    <p>注册LeafCard枫叶卡管系统账号需要满足以下要求：</p>
                    <ul>
                      <li>用户名：3-20个字符，支持中文、英文、数字和下划线</li>
                      <li>密码：8-20个字符，必须包含字母和数字</li>
                      <li>邮箱：用于验证和找回密码</li>
                    </ul>
                    <p>注册成功后，系统会自动发送验证邮件到您的邮箱，请及时验证。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="login" title="登录系统">
                  <div class="collapse-content">
                    <p>在登录页面输入用户名/邮箱和密码即可登录。支持记住登录状态和自动登录功能，登录失败超过5次会暂时锁定账户。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="card" title="卡管理">
                  <div class="collapse-content">
                    <p>LeafCard枫叶卡管系统支持多种卡管理操作：</p>
                    <ul>
                      <li>添加卡片：点击"添加卡片"按钮填写卡信息</li>
                      <li>编辑卡片：点击卡片列表中的编辑按钮修改信息</li>
                      <li>删除卡片：选择需要删除的卡片进行移除</li>
                    </ul>
                    <p>支持功能：卡号验证、持卡人信息管理、有效期跟踪、批量导入导出等。</p>
                  </div>
                </el-collapse-item>
                
                <el-collapse-item name="manage" title="管理文件">
                  <div class="collapse-content">
                    <p>在文件列表中可以创建文件夹、移动文件、重命名、删除等操作。支持多选、拖拽移动，搜索功能可以按文件名和内容搜索，删除文件会在回收站保留30天。</p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'UserGuidePage',
  setup() {
    const activeNames = ref(['register']);
    
    return {
      activeNames
    };
  }
}
</script>

<style scoped>
.user-guide-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-header {
  background: #2c5aa0;
  color: white;
  padding: 40px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 600;
}

.page-header p {
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.page-content {
  padding: 40px 0 60px;
}

.guide-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.guide-section {
  background: white;
  border-radius: 4px;
  padding: 0;
}

.section-header {
  background: #2c5aa0;
  padding: 20px 24px;
  color: white;
}

.section-header h2 {
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.guide-content {
  padding: 24px;
}

.collapse-content {
  padding: 12px 0;
}

.collapse-content p {
  color: #606266;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }
  
  .page-header p {
    font-size: 14px;
  }
  
  .section-header {
    padding: 16px 20px;
  }
  
  .section-header h2 {
    font-size: 18px;
  }
  
  .guide-content {
    padding: 20px;
  }
}
</style>