<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-purple-600 py-12 px-4">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <i class="fas fa-globe text-primary-600 text-5xl mb-4"></i>
        <h1 class="text-2xl font-bold text-gray-800">创建账号</h1>
        <p class="text-gray-600 mt-2">加入数智服务港，开启数字化之旅</p>
      </div>

      <!-- Register Tabs -->
      <div class="flex space-x-4 mb-6 border-b">
        <button
          v-for="role in roles"
          :key="role.value"
          @click="form.role = role.value"
          :class="[
            'flex-1 py-2 text-center font-medium transition',
            form.role === role.value
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          ]"
        >
          <i :class="role.icon + ' mr-2'"></i>
          {{ role.label }}
        </button>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
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

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
          <div class="relative">
            <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入邮箱"
            />
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
          <div class="relative">
            <i class="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入手机号"
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
              minlength="6"
              class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入密码（至少6位）"
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

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请再次输入密码"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Agreement -->
        <div class="flex items-start">
          <input v-model="form.agree" type="checkbox" required class="mt-1 rounded text-primary-600" />
          <label class="ml-2 text-sm text-gray-600">
            我已阅读并同意
            <a href="#" class="text-primary-600 hover:text-primary-700">《用户协议》</a>
            和
            <a href="#" class="text-primary-600 hover:text-primary-700">《隐私政策》</a>
          </label>
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
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <!-- Login Link -->
      <div class="text-center mt-6">
        <span class="text-gray-600">已有账号？</span>
        <router-link to="/login" class="text-primary-600 font-semibold hover:text-primary-700 ml-1">
          立即登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const roles = [
  { label: '会员', value: 'member', icon: 'fas fa-user' },
  { label: '供应商', value: 'supplier', icon: 'fas fa-building' }
]

const form = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'member',
  agree: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''

    // Validate password match
    if (form.value.password !== form.value.confirmPassword) {
      throw new Error('两次输入的密码不一致')
    }

    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      role: form.value.role
    })

    router.push('/login')
  } catch (err) {
    error.value = err.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
