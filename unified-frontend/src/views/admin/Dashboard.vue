<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">管理后台</h1>
      
      <!-- 统计数据 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">用户总数</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.memberCount }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">供应商数</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.supplierCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-building text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">活跃任务</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.activeTaskCount }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-tasks text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">总交易额</p>
              <p class="text-3xl font-bold text-gray-900">¥{{ stats.totalTransaction }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-coins text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 待审核 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">待审核供应商 ({{ pendingSuppliers.length }})</h3>
          <div v-if="pendingSuppliers.length === 0" class="text-center py-8 text-gray-500">
            暂无待审核供应商
          </div>
          <div v-else class="space-y-4">
            <div v-for="supplier in pendingSuppliers" :key="supplier.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold text-gray-800">{{ supplier.company_name }}</h4>
                  <p class="text-sm text-gray-600">联系人: {{ supplier.contact_person }}</p>
                  <p class="text-sm text-gray-600">电话: {{ supplier.contact_phone }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="verifySupplier(supplier.id, 'approved')" class="btn bg-green-600 text-white hover:bg-green-700 text-sm">
                    通过
                  </button>
                  <button @click="verifySupplier(supplier.id, 'rejected')" class="btn bg-red-600 text-white hover:bg-red-700 text-sm">
                    拒绝
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">待审核产品 ({{ pendingProducts.length }})</h3>
          <div v-if="pendingProducts.length === 0" class="text-center py-8 text-gray-500">
            暂无待审核产品
          </div>
          <div v-else class="space-y-4">
            <div v-for="product in pendingProducts" :key="product.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold text-gray-800">{{ product.product_name }}</h4>
                  <p class="text-sm text-gray-600">{{ product.product_desc }}</p>
                  <p class="text-sm text-gray-600">价格: ¥{{ product.price }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="reviewProduct(product.id, 'approved')" class="btn bg-green-600 text-white hover:bg-green-700 text-sm">
                    通过
                  </button>
                  <button @click="reviewProduct(product.id, 'rejected')" class="btn bg-red-600 text-white hover:bg-red-700 text-sm">
                    拒绝
                  </button>
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
import { ref, reactive, onMounted } from 'vue'
import api from '@/utils/api'

const stats = reactive({
  memberCount: 0,
  supplierCount: 0,
  activeTaskCount: 0,
  totalTransaction: 0
})

const pendingSuppliers = ref([])
const pendingProducts = ref([])

async function fetchDashboard() {
  try {
    const response = await api.get('/admin/dashboard')
    if (response.code === 200) {
      Object.assign(stats, response.data.overview)
    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}

async function fetchPendingItems() {
  try {
    const suppliersRes = await api.get('/suppliers?verification_status=pending&page=1&pageSize=10')
    if (suppliersRes.code === 200) {
      pendingSuppliers.value = suppliersRes.data.list
    }
    
    const productsRes = await api.get('/products?review_status=pending&page=1&pageSize=10')
    if (productsRes.code === 200) {
      pendingProducts.value = productsRes.data.list
    }
  } catch (error) {
    console.error('获取待审核项失败:', error)
  }
}

async function verifySupplier(supplierId, status) {
  try {
    const response = await api.put(`/admin/suppliers/${supplierId}/verify`, {
      verification_status: status,
      verification_remark: status === 'approved' ? '审核通过' : '审核拒绝'
    })
    
    if (response.code === 200) {
      alert(`供应商${status === 'approved' ? '审核通过' : '审核拒绝'}`)
      await fetchPendingItems()
    } else {
      alert(response.message || '操作失败')
    }
  } catch (error) {
    alert(error.message || '操作失败')
  }
}

async function reviewProduct(productId, status) {
  try {
    const response = await api.put(`/admin/products/${productId}/review`, {
      review_status: status,
      review_remark: status === 'approved' ? '审核通过' : '审核拒绝'
    })
    
    if (response.code === 200) {
      alert(`产品${status === 'approved' ? '审核通过' : '审核拒绝'}`)
      await fetchPendingItems()
    } else {
      alert(response.message || '操作失败')
    }
  } catch (error) {
    alert(error.message || '操作失败')
  }
}

onMounted(() => {
  fetchDashboard()
  fetchPendingItems()
})
</script>
