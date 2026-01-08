import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, getCurrentUser } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('user') || '{}'))

  // 登录
  const login = async (loginData) => {
    const data = await loginApi(loginData)
    token.value = data.token
    userInfo.value = data.user

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    return data
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = {}

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    window.location.href = '/login'
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    const data = await getCurrentUser()
    userInfo.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  return {
    token,
    userInfo,
    login,
    logout,
    fetchUserInfo
  }
})
