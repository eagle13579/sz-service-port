<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-globe-americas text-white text-2xl"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">注册数智服务港</h2>
        <p class="mt-2 text-gray-600">
          已有账号？
          <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
            立即登录
          </router-link>
        </p>
      </div>
      
      <!-- 角色选择 -->
      <div class="card mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">选择您的角色</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            @click="form.role = 'supplier'"
            :class="[
              'p-4 rounded-lg border-2 transition-all',
              form.role === 'supplier' 
                ? 'border-primary-600 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-building text-blue-600 text-xl"></i>
              </div>
              <div class="text-left">
                <h4 class="font-semibold text-gray-800">供应商</h4>
                <p class="text-sm text-gray-600">发布产品，发布任务</p>
              </div>
            </div>
          </button>
          
          <button
            @click="form.role = 'member'"
            :class="[
              'p-4 rounded-lg border-2 transition-all',
              form.role === 'member' 
                ? 'border-primary-600 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-users text-green-600 text-xl"></i>
              </div>
              <div class="text-left">
                <h4 class="font-semibold text-gray-800">会员</h4>
                <p class="text-sm text-gray-600">认领任务，参加活动</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <form @submit.prevent="handleRegister" class="card">
        <div class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              用户名 *
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input"
              placeholder="请输入用户名（3-50字符）"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              邮箱 *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="请输入邮箱"
            >
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              手机号 *
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="input"
              placeholder="请输入手机号"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              密码 *
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="input"
              placeholder="请输入密码（至少6位）"
            >
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              确认密码 *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input"
              placeholder="请再次输入密码"
            >
          </div>
          
          <div v-if="errorMessage" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>
          
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn btn-primary"
            >
              <span v-if="!loading">注册</span>
              <span v-else>注册中...</span>
            </button>
          </div>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'member' // 默认选择会员
})

const loading = ref(false)
const errorMessage = ref('')

async function handleRegister() {
  // 验证密码
  if (form.password !== form.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const result = await authStore.register({
      username: form.username,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role
    })
    
    if (result.success) {
      // 获取用户完整信息
      await authStore.fetchUserInfo()
      
      // 跳转到对应的中心
      if (form.role === 'supplier') {
        router.push('/supplier')
      } else {
        router.push('/member')
      }
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
