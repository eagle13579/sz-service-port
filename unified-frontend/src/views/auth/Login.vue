<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-purple-600 py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <i class="fas fa-globe text-primary-600 text-5xl mb-4"></i>
        <h1 class="text-2xl font-bold text-gray-800">欢迎回来</h1>
        <p class="text-gray-600 mt-2">登录数智服务港账号</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
          <div class="relative">
            <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入用户名"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入密码"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input v-model="form.remember" type="checkbox" class="rounded text-primary-600 focus:ring-primary-500" />
            <span class="ml-2 text-sm text-gray-600">记住我</span>
          </label>
          <a href="#" class="text-sm text-primary-600 hover:text-primary-700">忘记密码？</a>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- Register Link -->
      <div class="text-center mt-6">
        <span class="text-gray-600">还没有账号？</span>
        <router-link to="/register" class="text-primary-600 font-semibold hover:text-primary-700 ml-1">
          立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    await authStore.login({
      username: form.value.username,
      password: form.value.password
    })

    // Redirect to the page they were trying to access or home
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    error.value = err.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>
