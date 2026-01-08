<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">供应商中心</h1>
        <p class="text-gray-600 mt-2">欢迎回来，{{ supplierInfo.companyName }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">产品总数</p>
              <p class="text-2xl font-bold text-primary-600">{{ stats.products }}</p>
            </div>
            <i class="fas fa-box text-blue-500 text-3xl opacity-80"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">发布任务</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.tasks }}</p>
            </div>
            <i class="fas fa-tasks text-green-500 text-3xl opacity-80"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">进行中</p>
              <p class="text-2xl font-bold text-yellow-600">{{ stats.activeTasks }}</p>
            </div>
            <i class="fas fa-clock text-yellow-500 text-3xl opacity-80"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">已完成</p>
              <p class="text-2xl font-bold text-purple-600">{{ stats.completedTasks }}</p>
            </div>
            <i class="fas fa-check-circle text-purple-500 text-3xl opacity-80"></i>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link to="/supplier/products" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div class="text-center">
            <i class="fas fa-box-open text-primary-600 text-4xl mb-4"></i>
            <h3 class="text-lg font-bold text-gray-800 mb-2">产品管理</h3>
            <p class="text-gray-600 text-sm">管理您的产品信息</p>
          </div>
        </router-link>
        <router-link to="/supplier/tasks" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div class="text-center">
            <i class="fas fa-plus-circle text-green-600 text-4xl mb-4"></i>
            <h3 class="text-lg font-bold text-gray-800 mb-2">发布任务</h3>
            <p class="text-gray-600 text-sm">发布新任务给会员</p>
          </div>
        </router-link>
        <button class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div class="text-center">
            <i class="fas fa-user-cog text-purple-600 text-4xl mb-4"></i>
            <h3 class="text-lg font-bold text-gray-800 mb-2">企业设置</h3>
            <p class="text-gray-600 text-sm">管理企业信息</p>
          </div>
        </button>
      </div>

      <!-- Verification Status -->
      <div v-if="supplierInfo.verificationStatus !== 'approved'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div class="flex items-start">
          <i class="fas fa-exclamation-triangle text-yellow-600 text-2xl mr-4 mt-1"></i>
          <div>
            <h3 class="text-lg font-bold text-yellow-800 mb-2">企业认证状态</h3>
            <p class="text-yellow-700">
              {{ getVerificationText(supplierInfo.verificationStatus) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Recent Products -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">最近产品</h2>
          <router-link to="/supplier/products" class="text-primary-600 hover:text-primary-700">
            查看全部 <i class="fas fa-arrow-right ml-1"></i>
          </router-link>
        </div>
        <div class="p-6">
          <div v-if="recentProducts.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-box-open text-4xl mb-4"></i>
            <p>暂无产品</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="product in recentProducts" :key="product.id" class="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <div class="h-48 bg-gray-200 flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-4xl"></i>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ product.description }}</p>
                <p class="text-lg font-bold text-primary-600">¥{{ product.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/api'

const authStore = useAuthStore()

const stats = ref({
  products: 0,
  tasks: 0,
  activeTasks: 0,
  completedTasks: 0
})

const supplierInfo = ref({
  companyName: '未认证',
  verificationStatus: 'pending'
})

const recentProducts = ref([])

const loadStats = async () => {
  try {
    const response = await api.get('/api/suppliers/stats')
    stats.value = response.data.data
    supplierInfo.value = response.data.supplier
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const loadRecentProducts = async () => {
  try {
    const response = await api.get('/api/products/my')
    recentProducts.value = response.data.data.slice(0, 6)
  } catch (error) {
    console.error('Failed to load recent products:', error)
  }
}

const getVerificationText = (status) => {
  const texts = {
    pending: '企业认证审核中，请耐心等待',
    approved: '企业已通过认证',
    rejected: '企业认证未通过，请重新提交'
  }
  return texts[status] || status
}

onMounted(() => {
  loadStats()
  loadRecentProducts()
})
</script>
