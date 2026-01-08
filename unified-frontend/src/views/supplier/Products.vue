<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <!-- Page Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">产品管理</h1>
          <p class="text-gray-600 mt-2">管理您的产品信息</p>
        </div>
        <button
          @click="showAddModal = true"
          class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
        >
          <i class="fas fa-plus mr-2"></i>添加产品
        </button>
      </div>

      <!-- Product List -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-primary-600 text-4xl"></i>
      </div>

      <div v-else-if="products.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <i class="fas fa-box-open text-gray-400 text-5xl mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">暂无产品</h3>
        <p class="text-gray-600 mb-4">您还没有发布任何产品</p>
        <button
          @click="showAddModal = true"
          class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
        >
          添加第一个产品
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
        >
          <div class="h-48 bg-gray-200 flex items-center justify-center relative">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <i v-else class="fas fa-image text-gray-400 text-4xl"></i>
            <span :class="getStatusClass(product.status)" class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium">
              {{ getStatusText(product.status) }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ product.description }}</p>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span class="text-lg font-bold text-primary-600">¥{{ product.price }}</span>
              <div class="flex space-x-2 w-full sm:w-auto">
                <button
                  @click="editProduct(product)"
                  class="flex-1 sm:flex-none px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition text-sm"
                >
                  <i class="fas fa-edit mr-1"></i>编辑
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="flex-1 sm:flex-none px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-sm"
                >
                  <i class="fas fa-trash mr-1"></i>删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">{{ editingProduct ? '编辑产品' : '添加产品' }}</h2>
        </div>
        <form @submit.prevent="saveProduct" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
            <input
              v-model="productForm.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="请输入产品名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">产品描述</label>
            <textarea
              v-model="productForm.description"
              rows="4"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="请输入产品描述"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">价格</label>
              <input
                v-model="productForm.price"
                type="number"
                step="0.01"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="请输入价格"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">库存</label>
              <input
                v-model="productForm.stock"
                type="number"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="请输入库存"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">产品图片</label>
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              class="w-full"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:opacity-50"
            >
              <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const products = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const editingProduct = ref(null)
const saving = ref(false)
const imageInput = ref(null)

const productForm = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  image: null
})

const loadProducts = async () => {
  try {
    loading.value = true
    const response = await api.get('/api/products/my')
    products.value = response.data.data
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: null
  }
  showAddModal.value = true
}

const saveProduct = async () => {
  try {
    saving.value = true

    const formData = new FormData()
    formData.append('name', productForm.value.name)
    formData.append('description', productForm.value.description)
    formData.append('price', productForm.value.price)
    formData.append('stock', productForm.value.stock)
    if (productForm.value.image) {
      formData.append('image', productForm.value.image)
    }

    if (editingProduct.value) {
      await api.put(`/api/products/${editingProduct.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await api.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    closeModal()
    loadProducts()
  } catch (error) {
    alert(error.response?.data?.message || '保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (id) => {
  if (!confirm('确定要删除这个产品吗？')) return

  try {
    await api.delete(`/api/products/${id}`)
    loadProducts()
  } catch (error) {
    alert(error.response?.data?.message || '删除失败，请稍后重试')
  }
}

const handleImageChange = (e) => {
  productForm.value.image = e.target.files[0]
}

const closeModal = () => {
  showAddModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null
  }
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: '审核中',
    approved: '已上架',
    rejected: '已下架'
  }
  return texts[status] || status
}

onMounted(() => {
  loadProducts()
})
</script>
