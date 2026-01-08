<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部横幅 -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">供应商中心</h1>
            <p class="text-gray-100">
              {{ supplier?.company_name || '欢迎' }} | {{ getSupplierLevel(supplier?.supplier_level) }}
            </p>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-4">
            <div class="text-center bg-white/10 rounded-lg p-4">
              <div class="text-2xl font-bold">{{ stats.productCount || 0 }}</div>
              <div class="text-sm">产品数</div>
            </div>
            <div class="text-center bg-white/10 rounded-lg p-4">
              <div class="text-2xl font-bold">{{ stats.taskCount || 0 }}</div>
              <div class="text-sm">任务数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主要内容 -->
    <div class="container mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧导航 -->
        <div class="lg:col-span-1">
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">供应商中心</h3>
            <nav class="space-y-2">
              <router-link to="/supplier" class="block px-4 py-2 rounded-md bg-blue-50 text-blue-700">
                <i class="fas fa-home mr-2"></i>概览
              </router-link>
              <router-link to="/supplier/products" class="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <i class="fas fa-box mr-2"></i>产品管理
              </router-link>
              <router-link to="/supplier/tasks" class="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <i class="fas fa-tasks mr-2"></i>任务管理
              </router-link>
            </nav>
          </div>
        </div>
        
        <!-- 右侧内容 -->
        <div class="lg:col-span-2">
          <!-- 审核状态 -->
          <div v-if="supplier?.verification_status !== 'approved'" class="card mb-8" :class="{
            'bg-yellow-50 border-yellow-200': supplier?.verification_status === 'pending',
            'bg-red-50 border-red-200': supplier?.verification_status === 'rejected'
          }">
            <div class="flex items-center">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800 mb-2">
                  {{ getVerificationStatus(supplier?.verification_status) }}
                </h4>
                <p v-if="supplier?.verification_remark" class="text-sm text-gray-600">
                  备注: {{ supplier.verification_remark }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- 我的任务 -->
          <div class="card mb-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">我的任务</h3>
              <router-link to="/supplier/tasks" class="text-primary-600 hover:text-primary-700 font-medium">
                查看全部 <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
            <div v-if="tasks.length === 0" class="text-center py-8 text-gray-500">
              暂无发布的任务
            </div>
            <div v-else class="space-y-4">
              <div v-for="task in tasks" :key="task.id" class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-2">{{ task.task_title }}</h4>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span><i class="fas fa-coins mr-1"></i>¥{{ task.budget }}</span>
                      <span><i class="fas fa-user-check mr-1"></i>{{ task.claimed_member_nickname || '未认领' }}</span>
                      <span :class="[
                        'px-2 py-1 rounded text-xs',
                        task.status === 'published' ? 'bg-green-100 text-green-700' :
                        task.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      ]">
                        {{ getStatusName(task.status) }}
                      </span>
                    </div>
                  </div>
                  <router-link :to="`/supplier/tasks/${task.id}`" class="btn btn-primary ml-4 text-sm">
                    查看
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 我的产品 -->
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">我的产品</h3>
              <router-link to="/supplier/products" class="text-primary-600 hover:text-primary-700 font-medium">
                查看全部 <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
            <div v-if="products.length === 0" class="text-center py-8 text-gray-500">
              暂无发布的产品
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="product in products" :key="product.id" class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-800 mb-2">{{ product.product_name }}</h4>
                <div class="text-sm text-gray-600 mb-2">{{ product.product_desc }}</div>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span><i class="fas fa-coins mr-1"></i>¥{{ product.price }}</span>
                  <span><i class="fas fa-box mr-1"></i>库存: {{ product.stock }}</span>
                  <span><i class="fas fa-eye mr-1"></i>{{ product.view_count }}</span>
                </div>
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
import api from '@/utils/api'

const supplier = ref(null)
const tasks = ref([])
const products = ref([])
const stats = reactive({
  productCount: 0,
  taskCount: 0
})

function getSupplierLevel(level) {
  const levels = {
    normal: '普通供应商',
    excellent: '优质供应商',
    strategic: '战略合作伙伴'
  }
  return levels[level] || level
}

function getVerificationStatus(status) {
  const statuses = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statuses[status] || status
}

function getStatusName(status) {
  const names = {
    draft: '草稿',
    published: '已发布',
    claimed: '已认领',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return names[status] || status
}

async function fetchData() {
  try {
    // 获取供应商信息
    const supplierRes = await api.get('/suppliers/me')
    if (supplierRes.code === 200) {
      supplier.value = supplierRes.data
    }
    
    // 获取我的任务
    const tasksRes = await api.get('/tasks?supplier_id=' + (supplier.value?.id) + '&page=1&pageSize=5')
    if (tasksRes.code === 200) {
      tasks.value = tasksRes.data.list
      stats.taskCount = tasksRes.data.pagination.total
    }
    
    // 获取我的产品
    const productsRes = await api.get('/products?supplier_id=' + (supplier.value?.id) + '&page=1&pageSize=4')
    if (productsRes.code === 200) {
      products.value = productsRes.data.list
      stats.productCount = productsRes.data.pagination.total
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>
