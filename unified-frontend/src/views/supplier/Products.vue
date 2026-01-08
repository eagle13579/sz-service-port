<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">产品管理</h1>
          <p class="text-gray-600">管理您的产品信息</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i>发布产品
        </button>
      </div>
      
      <!-- 产品列表 -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-600"></i>
      </div>
      
      <div v-else-if="products.length === 0" class="card text-center py-12">
        <i class="fas fa-box text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">暂无产品</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in products" :key="product.id" class="card hover:shadow-lg transition-shadow">
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span :class="[
                'px-2 py-1 rounded text-xs',
                product.status === 'published' ? 'bg-green-100 text-green-700' :
                product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                'bg-red-100 text-red-700'
              ]">
                {{ getStatusName(product.status) }}
              </span>
              <span :class="[
                'px-2 py-1 rounded text-xs',
                product.review_status === 'approved' ? 'bg-green-100 text-green-700' :
                product.review_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              ]">
                {{ getReviewStatusName(product.review_status) }}
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ product.product_name }}</h3>
            <p class="text-gray-600 text-sm">{{ product.product_desc }}</p>
          </div>
          
          <div class="space-y-2 text-sm text-gray-600 mb-4">
            <div class="flex items-center">
              <i class="fas fa-coins w-5"></i>
              <span class="ml-2 text-primary-600 font-semibold">¥{{ product.price }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-box w-5"></i>
              <span class="ml-2">库存: {{ product.stock }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-eye w-5"></i>
              <span class="ml-2">浏览: {{ product.view_count }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-shopping-cart w-5"></i>
              <span class="ml-2">销量: {{ product.sales_count }}</span>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button class="btn btn-secondary flex-1">编辑</button>
            <button class="btn bg-red-600 text-white hover:bg-red-700 flex-1">下架</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建产品模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold">发布产品</h3>
        </div>
        <form @submit.prevent="createProduct" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">产品名称 *</label>
            <input v-model="productForm.product_name" type="text" required class="input" placeholder="请输入产品名称">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">产品描述 *</label>
            <textarea v-model="productForm.product_desc" required class="input" rows="3" placeholder="请输入产品描述"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">价格 *</label>
              <input v-model.number="productForm.price" type="number" step="0.01" required class="input" placeholder="请输入价格">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">库存 *</label>
              <input v-model.number="productForm.stock" type="number" required class="input" placeholder="请输入库存">
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">取消</button>
            <button type="submit" class="btn btn-primary">发布</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/utils/api'

const products = ref([])
const loading = ref(false)
const showCreateModal = ref(false)

const productForm = reactive({
  product_name: '',
  product_desc: '',
  price: 0,
  stock: 0
})

function getStatusName(status) {
  const names = {
    draft: '草稿',
    published: '已发布',
    offline: '已下架'
  }
  return names[status] || status
}

function getReviewStatusName(status) {
  const names = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return names[status] || status
}

async function fetchProducts() {
  loading.value = true
  try {
    const response = await api.get('/products?page=1&pageSize=50')
    if (response.code === 200) {
      products.value = response.data.list
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
  } finally {
    loading.value = false
  }
}

async function createProduct() {
  try {
    const response = await api.post('/products', productForm)
    if (response.code === 200) {
      alert('产品发布成功！')
      showCreateModal.value = false
      // 重置表单
      Object.assign(productForm, {
        product_name: '',
        product_desc: '',
        price: 0,
        stock: 0
      })
      await fetchProducts()
    } else {
      alert(response.message || '发布失败')
    }
  } catch (error) {
    alert(error.message || '发布失败，请稍后重试')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
