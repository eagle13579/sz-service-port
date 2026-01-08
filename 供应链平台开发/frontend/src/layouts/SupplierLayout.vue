<template>
  <el-container class="supplier-layout">
    <el-header class="header">
      <div class="logo">供应链平台</div>
      <div class="header-right">
        <span>{{ userStore.userInfo.username }}</span>
        <el-button @click="handleLogout" text>退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <el-menu-item index="/supplier/dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="/supplier/products">
            <el-icon><Goods /></el-icon>
            <span>产品管理</span>
          </el-menu-item>
          <el-menu-item index="/supplier/tasks">
            <el-icon><List /></el-icon>
            <span>任务管理</span>
          </el-menu-item>
          <el-menu-item index="/supplier/profile">
            <el-icon><User /></el-icon>
            <span>企业信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  userStore.logout()
}
</script>

<style scoped>
.supplier-layout {
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-aside {
  background-color: #304156;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
