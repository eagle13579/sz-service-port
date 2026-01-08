import axios from 'axios'

// 判断是否使用模拟数据
const USE_MOCK_DATA = true // 设置为 true 使用模拟数据

// 基础配置
const BASE_URL = 'http://localhost:3002'
const TIMEOUT = 10000

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== 统计数据相关 ====================

// 获取统计数据
export const getStats = async () => {
  if (USE_MOCK_DATA) {
    return {
      members: Math.floor(Math.random() * 5000) + 5000,
      suppliers: Math.floor(Math.random() * 100) + 150,
      products: Math.floor(Math.random() * 5000) + 8000,
      tasks: Math.floor(Math.random() * 5000) + 8000
    }
  }
  const response = await api.get('/api/stats')
  return response.data
}

// ==================== 认证相关 ====================

// 用户登录
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials)
  return response.data
}

// 用户注册
export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData)
  return response.data
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me')
  return response.data
}

// 用户登出
export const logout = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

// ==================== 产品相关 ====================

// 获取产品列表
export const getProducts = async (params = {}) => {
  const response = await api.get('/api/products', { params })
  return response.data
}

// 获取产品详情
export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`)
  return response.data
}

// 创建产品
export const createProduct = async (productData) => {
  const response = await api.post('/api/products', productData)
  return response.data
}

// 更新产品
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/api/products/${id}`, productData)
  return response.data
}

// 删除产品
export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`)
  return response.data
}

// ==================== 任务相关 ====================

// 获取任务列表
export const getTasks = async (params = {}) => {
  const response = await api.get('/api/tasks', { params })
  return response.data
}

// 获取任务详情
export const getTaskById = async (id) => {
  const response = await api.get(`/api/tasks/${id}`)
  return response.data
}

// 创建任务
export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData)
  return response.data
}

// 更新任务
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/api/tasks/${id}`, taskData)
  return response.data
}

// 删除任务
export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`)
  return response.data
}

// 领取任务
export const claimTask = async (id) => {
  const response = await api.post(`/api/tasks/${id}/claim`)
  return response.data
}

// 完成任务
export const completeTask = async (id, report) => {
  const response = await api.post(`/api/tasks/${id}/complete`, { report })
  return response.data
}

// ==================== 活动相关 ====================

// 获取活动列表
export const getActivities = async (params = {}) => {
  const response = await api.get('/api/activities', { params })
  return response.data
}

// 获取活动详情
export const getActivityById = async (id) => {
  const response = await api.get(`/api/activities/${id}`)
  return response.data
}

// 参与活动
export const joinActivity = async (id) => {
  const response = await api.post(`/api/activities/${id}/join`)
  return response.data
}

// ==================== 订单相关 ====================

// 获取订单列表
export const getOrders = async (params = {}) => {
  const response = await api.get('/api/orders', { params })
  return response.data
}

// 获取订单详情
export const getOrderById = async (id) => {
  const response = await api.get(`/api/orders/${id}`)
  return response.data
}

// 创建订单
export const createOrder = async (orderData) => {
  const response = await api.post('/api/orders', orderData)
  return response.data
}

// ==================== 文件上传 ====================

// 上传文件
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export default api
