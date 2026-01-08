<template>
  <nav class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <i class="fas fa-globe text-primary-600 text-2xl"></i>
          <span class="text-xl font-bold text-gray-800">数智服务港</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-700 hover:text-primary-600 transition">首页</router-link>
          <router-link to="/member/tasks" class="text-gray-700 hover:text-primary-600 transition">任务大厅</router-link>
          <router-link to="/member/activities" class="text-gray-700 hover:text-primary-600 transition">活动中心</router-link>
          
          <!-- Authenticated User -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <div class="relative group">
              <button class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                <i class="fas fa-user-circle text-2xl"></i>
                <span>{{ authStore.user?.username || '用户' }}</span>
                <i class="fas fa-chevron-down text-sm"></i>
              </button>
              
              <!-- Dropdown -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block">
                <router-link 
                  v-if="authStore.isMember" 
                  to="/member" 
                  class="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  <i class="fas fa-home mr-2"></i>会员中心
                </router-link>
                <router-link 
                  v-if="authStore.isSupplier" 
                  to="/supplier" 
                  class="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  <i class="fas fa-building mr-2"></i>供应商中心
                </router-link>
                <router-link 
                  v-if="authStore.isAdmin" 
                  to="/admin" 
                  class="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  <i class="fas fa-cog mr-2"></i>管理后台
                </router-link>
                <hr class="my-2">
                <button @click="handleLogout" class="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600">
                  <i class="fas fa-sign-out-alt mr-2"></i>退出登录
                </button>
              </div>
            </div>
          </div>

          <!-- Not Authenticated -->
          <div v-else class="flex items-center space-x-4">
            <router-link to="/login" class="text-gray-700 hover:text-primary-600 transition">登录</router-link>
            <router-link to="/register" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">
              免费注册
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-700">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t">
          <router-link to="/" @click="mobileMenuOpen = false" class="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition">首页</router-link>
          <router-link to="/member/tasks" @click="mobileMenuOpen = false" class="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition">任务大厅</router-link>
          <router-link to="/member/activities" @click="mobileMenuOpen = false" class="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition">活动中心</router-link>
          
          <div v-if="authStore.isAuthenticated" class="py-2 border-t mt-2">
            <div class="text-gray-700 mb-2 px-4">
              <i class="fas fa-user mr-2"></i>{{ authStore.user?.username || '用户' }}
            </div>
            <router-link v-if="authStore.isMember" to="/member" @click="mobileMenuOpen = false" class="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition">
              <i class="fas fa-home mr-2"></i>会员中心
            </router-link>
            <router-link v-if="authStore.isSupplier" to="/supplier" @click="mobileMenuOpen = false" class="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition">
              <i class="fas fa-building mr-2"></i>供应商中心
            </router-link>
            <router-link v-if="authStore.isAdmin" to="/admin" @click="mobileMenuOpen = false" class="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition">
              <i class="fas fa-cog mr-2"></i>管理后台
            </router-link>
            <button @click="handleLogout" class="w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 transition mt-2">
              <i class="fas fa-sign-out-alt mr-2"></i>退出登录
            </button>
          </div>
          
          <div v-else class="py-2 border-t mt-2 space-y-2">
            <router-link to="/login" @click="mobileMenuOpen = false" class="block py-2 px-4 text-gray-700 hover:bg-gray-50 transition">登录</router-link>
            <router-link to="/register" @click="mobileMenuOpen = false" class="block py-2 mx-4 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition">
              免费注册
            </router-link>
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
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  mobileMenuOpen.value = false
}
</script>
