<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-globe-americas text-white text-2xl"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">登录数智服务港</h2>
        <p class="mt-2 text-gray-600">
          还没有账号？
          <router-link to="/register" class="text-primary-600 hover:text-primary-500 font-medium">
            立即注册
          </router-link>
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input"
              placeholder="请输入用户名"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input"
              placeholder="请输入密码"
            >
          </div>
        </div>
        
        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>
        
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary flex justify-center"
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </button>
        </div>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-500">
        <router-link to="/" class="text-primary-600 hover:text-primary-500">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const result = await authStore.login(form.username, form.password)
    
    if (result.success) {
      // 获取用户完整信息
      await authStore.fetchUserInfo()
      
      // 跳转到重定向页面或首页
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
