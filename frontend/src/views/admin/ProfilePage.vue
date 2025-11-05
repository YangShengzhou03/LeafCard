<template>
  <div class="admin-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人资料</span>
        </div>
      </template>

      <div class="profile-content">
        <!-- 头像和基本信息 -->
        <div class="basic-info">
          <div class="avatar-section">
            <el-avatar :size="80" :src="userInfo.avatar" class="user-avatar">
              {{ userInfo.nickname ? userInfo.nickname.charAt(0) : 'U' }}
            </el-avatar>
            <div class="avatar-actions">
              <el-button size="small" type="primary" @click="changeAvatar">
                <el-icon><Camera /></el-icon>
                更换头像
              </el-button>
              <input 
                ref="avatarInput" 
                type="file" 
                accept="image/*" 
                style="display: none" 
                @change="handleAvatarChange"
              />
            </div>
          </div>
          
          <div class="info-section">
            <h3 class="user-name">{{ userInfo.nickname || '未设置昵称' }}</h3>
            <p class="user-email">{{ userInfo.email }}</p>
            <p class="user-role">
              <el-tag :type="getRoleType(userInfo.role)">
                {{ getRoleText(userInfo.role) }}
              </el-tag>
            </p>
            <p class="user-join-time">注册时间：{{ formatDate(userInfo.createTime) }}</p>
          </div>
        </div>

        <!-- 编辑表单 -->
        <el-form 
          :model="profileForm" 
          :rules="profileRules" 
          ref="profileFormRef" 
          label-width="100px"
          class="edit-form"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="个人简介" prop="bio">
            <el-input 
              v-model="profileForm.bio" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入个人简介"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="profileForm.gender" placeholder="请选择性别">
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                  <el-option label="保密" value="secret" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item>
            <el-button type="primary" @click="saveProfile" :loading="saving">
              保存修改
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 安全设置 -->
        <div class="security-section">
          <h3 class="section-title">安全设置</h3>
          <div class="security-items">
            <div class="security-item">
              <div class="item-info">
                <h4>登录密码</h4>
                <p>定期更改密码有助于保护账户安全</p>
              </div>
              <el-button type="primary" text @click="changePassword">修改密码</el-button>
            </div>
            
            <div class="security-item">
              <div class="item-info">
                <h4>账户状态</h4>
                <p>当前账户状态：正常</p>
              </div>
              <el-tag type="success">正常</el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog 
      v-model="passwordDialogVisible" 
      title="修改密码" 
      width="400px"
      :before-close="handlePasswordDialogClose"
    >
      <el-form 
        :model="passwordForm" 
        :rules="passwordRules" 
        ref="passwordFormRef" 
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input 
            v-model="passwordForm.currentPassword" 
            type="password" 
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePassword" :loading="changingPassword">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import api from '../../services/api'

// 表单引用
const profileFormRef = ref()
const passwordFormRef = ref()
const avatarInput = ref()

// 对话框状态
const passwordDialogVisible = ref(false)
const saving = ref(false)
const changingPassword = ref(false)

// 用户信息
const userInfo = ref({
  id: '',
  nickname: '',
  email: '',
  role: '',
  avatar: '',
  bio: '',
  phone: '',
  gender: '',
  createTime: ''
})

// 个人资料表单
const profileForm = reactive({
  nickname: '',
  email: '',
  bio: '',
  phone: '',
  gender: ''
})

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证规则
const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 角色类型映射
const getRoleType = (role) => {
  const roleMap = {
    admin: 'danger',
    user: 'primary',
    vip: 'success'
  }
  return roleMap[role] || 'info'
}

// 角色文本映射
const getRoleText = (role) => {
  const roleMap = {
    admin: '管理员',
    user: '普通用户',
    vip: 'VIP用户'
  }
  return roleMap[role] || '未知角色'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 调用API获取用户信息
    const response = await api.user.getUserInfo()
    
    if (response && response.code === 200 && response.data) {
      userInfo.value = response.data
      Object.assign(profileForm, response.data)
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('加载用户信息失败，请检查网络连接')
  }
}

// 保存个人资料
const saveProfile = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    saving.value = true
    
    // 调用API保存个人资料
    const response = await api.user.updateUserInfo(profileForm)
    
    if (response && response.code === 200) {
      // 更新用户信息
      userInfo.value = { ...userInfo.value, ...profileForm }
      ElMessage.success('个人资料保存成功')
    } else {
      ElMessage.error('保存失败，请重试')
    }
  } catch (error) {
    console.error('保存个人资料失败:', error)
    if (error.errors) {
      ElMessage.warning('请检查表单填写是否正确')
    } else {
      ElMessage.error('保存失败，请检查网络连接')
    }
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(profileForm, userInfo.value)
  ElMessage.info('表单已重置')
}

// 更换头像
const changeAvatar = () => {
  avatarInput.value?.click()
}

// 处理头像更改
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  
  // 检查文件大小（限制为2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过2MB')
    return
  }
  
  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.value.avatar = e.target.result
    ElMessage.success('头像更换成功')
  }
  reader.readAsDataURL(file)
  
  // 重置文件输入
  event.target.value = ''
}

// 修改密码
const changePassword = () => {
  passwordDialogVisible.value = true
}

// 保存密码
const savePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true
    
    // 调用API修改密码
    const response = await api.user.changePassword({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    if (response && response.code === 200) {
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
      
      // 重置密码表单
      Object.assign(passwordForm, {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } else {
      ElMessage.error('密码修改失败，请重试')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    if (error.errors) {
      ElMessage.warning('请检查表单填写是否正确')
    } else {
      ElMessage.error('修改失败，请检查网络连接')
    }
  } finally {
    changingPassword.value = false
  }
}

// 处理密码对话框关闭
const handlePasswordDialogClose = (done) => {
  ElMessageBox.confirm('确定要取消修改密码吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    done()
  }).catch(() => {
    // 取消关闭
  })
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.admin-profile {
  padding: 0;
  background-color: #f5f7fa;
}

.profile-card {
  margin-bottom: 16px;
}

.profile-card :deep(.el-card__body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.profile-content {
  max-width: 800px;
}

.basic-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24px;
}

.user-avatar {
  margin-bottom: 8px;
  background-color: #2c5aa0;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-section {
  flex: 1;
}

.user-name {
  margin: 0 0 6px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.user-email {
  margin: 0 0 6px 0;
  color: #606266;
  font-size: 14px;
}

.user-role {
  margin: 0 0 6px 0;
}

.user-join-time {
  margin: 0;
  color: #909399;
  font-size: 12px;
}

.edit-form {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.security-items {
  border: 1px solid #e4e7ed;
  border-radius: 2px;
  overflow: hidden;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
}

.security-item:last-child {
  border-bottom: none;
}

.item-info h4 {
  margin: 0 0 2px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.item-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .basic-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-section {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .edit-form .el-col {
    margin-bottom: 12px;
  }
}
</style>