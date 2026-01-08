<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">管理后台</h1>
      
      <!-- Admin Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">总用户</p>
              <p class="text-2xl font-bold text-primary-600">{{ stats.users }}</p>
            </div>
            <i class="fas fa-users text-blue-500 text-3xl opacity-80"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">供应商</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.suppliers }}</p>
            </div>
            <i class="fas fa-building text-green-500 text-3xl opacity-80"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">总任务</p>
              <p class="text-2xl font-bold text-yellow-600">{{ stats.tasks }}</p>
            </div>
            <i class="fas fa-tasks text-yellow-500 text-3xl opacity-80"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">产品</p>
              <p class="text-2xl font-bold text-purple-600">{{ stats.products }}</p>
            </div>
            <i class="fas fa-box text-purple-500 text-3xl opacity-80"></i>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div class="text-center">
            <i class="fas fa-user-check text-primary-600 text-4xl mb-4"></i>
            <h3 class="text-lg font-bold text-gray-800 mb-2">用户管理</h3>
            <p class="text-gray-600 text-sm">管理平台用户和权限</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div class="text-center">
            <i class="fas fa-building text-green-600 text-4xl mb-4"></i>
            <h3 class="text-lg font-bold text-gray-800 mb-2">供应商审核</h3>
            <p class="text-gray-600 text-sm">审核供应商入驻申请</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div class="text-center">
            <i class="fas fa-chart-line text-purple-600 text-4xl mb-4"></i>
            <h3 class="text-lg font-bold text-gray-800 mb-2">数据统计</h3>
            <p class="text-gray-600 text-sm">查看平台运营数据</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">最近活动</h2>
        </div>
        <div class="p-6">
          <div class="text-center py-8 text-gray-500">
            <i class="fas fa-history text-4xl mb-4"></i>
            <p>暂无最近活动</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const stats = ref({
  users: 0,
  suppliers: 0,
  tasks: 0,
  products: 0
})

const loadStats = async () => {
  try {
    const response = await api.get('/api/stats/overview')
    stats.value = response.data.data
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>
