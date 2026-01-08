<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="container mx-auto px-6">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-globe-americas text-white text-xl"></i>
          </div>
          <span class="text-xl font-bold text-gray-800">数智服务港</span>
        </router-link>
        
        <!-- 导航链接 -->
        <div class="hidden md:flex space-x-8">
          <router-link to="/" class="text-gray-700 hover:text-primary-600 transition">首页</router-link>
          <router-link to="/member/tasks" class="text-gray-700 hover:text-primary-600 transition">任务大厅</router-link>
          <router-link to="/member/activities" class="text-gray-700 hover:text-primary-600 transition">活动中心</router-link>
        </div>
        
        <!-- 用户操作 -->
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <!-- 根据角色显示不同菜单 -->
            <router-link 
              v-if="authStore.isSupplier" 
              to="/supplier" 
              class="btn btn-primary"
            >
              供应商中心
            </router-link>
            <router-link 
              v-if="authStore.isMember" 
              to="/member" 
              class="btn btn-primary"
            >
              会员中心
            </router-link>
            <router-link 
              v-if="authStore.isAdmin" 
              to="/admin" 
              class="btn btn-primary"
            >
              管理后台
            </router-link>
            
            <!-- 用户菜单 -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
              >
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-user"></i>
                </div>
                <span class="hidden md:inline">{{ authStore.user?.username }}</span>
              </button>
              
              <!-- 下拉菜单 -->
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
              >
                <div class="px-4 py-2 border-b">
                  <p class="font-semibold">{{ authStore.user?.username }}</p>
                  <p class="text-sm text-gray-500">{{ getRoleName(authStore.user?.role) }}</p>
                </div>
                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                  退出登录
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <router-link to="/login" class="text-gray-700 hover:text-primary-600 transition">登录</router-link>
            <router-link to="/register" class="btn btn-primary">注册</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

function getRoleName(role) {
  const roleNames = {
    admin: '管理员',
    supplier: '供应商',
    member: '会员'
  }
  return roleNames[role] || role
}

async function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  router.push('/')
}
</script>
