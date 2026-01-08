import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSupplier = computed(() => user.value?.role === 'supplier')
  const isMember = computed(() => user.value?.role === 'member')

  // 登录
  async function login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password })
      
      if (response.code === 200) {
        token.value = response.data.token
        user.value = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
          role: response.data.role
        }
        
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message || '登录失败' }
    }
  }

  // 注册
  async function register(data) {
    try {
      const response = await api.post('/auth/register', data)
      
      if (response.code === 200) {
        token.value = response.data.token
        user.value = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
          role: response.data.role
        }
        
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message || '注册失败' }
    }
  }

  // 获取当前用户信息
  async function fetchUserInfo() {
    try {
      const response = await api.get('/auth/me')
      
      if (response.code === 200) {
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message || '获取用户信息失败' }
    }
  }

  // 登出
  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 检查认证状态
  function checkAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isSupplier,
    isMember,
    login,
    register,
    fetchUserInfo,
    logout,
    checkAuth
  }
})
