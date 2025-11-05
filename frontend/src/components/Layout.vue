<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <h3>Leaf Card</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
          <i class="el-icon-s-home"></i>
          <span>仪表盘</span>
        </el-menu-item>
        <el-submenu index="product">
          <template slot="title">
            <i class="el-icon-s-goods"></i>
            <span>产品管理</span>
          </template>
          <el-menu-item index="/products">产品列表</el-menu-item>
          <el-menu-item index="/products/add">添加产品</el-menu-item>
        </el-submenu>
        <el-submenu index="specification">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>规格管理</span>
          </template>
          <el-menu-item index="/specifications">规格列表</el-menu-item>
          <el-menu-item index="/specifications/add">添加规格</el-menu-item>
        </el-submenu>
        <el-submenu index="card">
          <template slot="title">
            <i class="el-icon-s-claim"></i>
            <span>卡密管理</span>
          </template>
          <el-menu-item index="/card-keys">卡密列表</el-menu-item>
          <el-menu-item index="/card-keys/add">添加卡密</el-menu-item>
        </el-submenu>
        <el-menu-item index="/users">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/logs">
          <i class="el-icon-document"></i>
          <span>操作日志</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleSidebar"
            class="collapse-btn"
          >
            <i :class="sidebarCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
          </el-button>
          <span class="header-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar"></el-avatar>
              <span>{{ userInfo.username }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      sidebarCollapsed: false,
      userInfo: {
        username: '管理员',
        avatar: ''
      },
      pageTitle: '仪表盘'
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  created() {
    // 从localStorage获取用户信息
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
    }
    // 设置页面标题
    this.setPageTitle()
  },
  watch: {
    '$route': 'setPageTitle'
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    setPageTitle() {
      const route = this.$route
      const titleMap = {
        '/dashboard': '仪表盘',
        '/products': '产品列表',
        '/products/add': '添加产品',
        '/specifications': '规格列表',
        '/specifications/add': '添加规格',
        '/card-keys': '卡密列表',
        '/card-keys/add': '添加卡密',
        '/users': '用户管理',
        '/logs': '操作日志'
      }
      this.pageTitle = titleMap[route.path] || 'Leaf Card'
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout()
      } else if (command === 'profile') {
        this.$router.push('/profile')
      }
    },
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        this.$router.push('/login')
        this.$message.success('已退出登录')
      })
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-bottom: 1px solid #2b3848;
}

.sidebar-menu {
  border: none;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 18px;
  margin-right: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span {
  margin-left: 8px;
  margin-right: 4px;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>