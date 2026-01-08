import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMember = computed(() => user.value?.role === 'member')
  const isSupplier = computed(() => user.value?.role === 'supplier')

  // 初始化时检查认证状态
  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      try {
        const response = await api.get('/api/auth/me')
        user.value = response.data.data
      } catch (error) {
        logout()
      }
    }
  }

  // 登录
  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '登录失败')
    }
  }

  // 注册
  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '注册失败')
    }
  }

  // 登出
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isMember,
    isSupplier,
    checkAuth,
    login,
    register,
    logout
  }
})
