<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <!-- Page Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">任务大厅</h1>
          <p class="text-gray-600 mt-2">浏览并领取可用任务</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">搜索</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="搜索任务..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务类型</label>
            <select
              v-model="filters.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            >
              <option value="">全部类型</option>
              <option value="promotion">推广</option>
              <option value="review">评价</option>
              <option value="data">数据采集</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">奖励范围</label>
            <select
              v-model="filters.reward"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            >
              <option value="">全部</option>
              <option value="0-50">0-50积分</option>
              <option value="50-100">50-100积分</option>
              <option value="100+">100+积分</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="loadTasks"
              class="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
            >
              <i class="fas fa-search mr-2"></i>搜索
            </button>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-primary-600 text-4xl"></i>
      </div>

      <div v-else-if="tasks.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <i class="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">暂无任务</h3>
        <p class="text-gray-600">当前没有符合条件的任务</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span :class="getTypeClass(task.type)" class="px-3 py-1 rounded-full text-xs font-medium mr-3">
                  {{ getTypeText(task.type) }}
                </span>
                <h3 class="text-lg font-bold text-gray-800">{{ task.title }}</h3>
              </div>
              <p class="text-gray-600 mb-3">{{ task.description }}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span><i class="fas fa-star text-yellow-500 mr-1"></i>{{ task.points }}积分</span>
                <span><i class="fas fa-clock mr-1"></i>截止: {{ formatDate(task.deadline) }}</span>
                <span><i class="fas fa-user mr-1"></i>已领: {{ task.claimed }}/{{ task.quota }}</span>
              </div>
            </div>
            <div class="mt-4 md:mt-0 md:ml-6">
              <button
                @click="claimTask(task.id)"
                :disabled="task.claimed >= task.quota"
                class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ task.claimed >= task.quota ? '已抢完' : '领取任务' }}
              </button>
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
import { useRouter } from 'vue-router'
import api from '@/utils/api'

const authStore = useAuthStore()
const router = useRouter()

const tasks = ref([])
const loading = ref(false)

const filters = ref({
  search: '',
  type: '',
  reward: ''
})

const loadTasks = async () => {
  try {
    loading.value = true
    const params = {}
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.type) params.type = filters.value.type

    const response = await api.get('/api/tasks', { params })
    tasks.value = response.data.data
  } catch (error) {
    console.error('Failed to load tasks:', error)
  } finally {
    loading.value = false
  }
}

const claimTask = async (taskId) => {
  try {
    await api.post(`/api/tasks/${taskId}/claim`)
    alert('任务领取成功！')
    router.push('/member/my-tasks')
  } catch (error) {
    alert(error.response?.data?.message || '领取失败，请稍后重试')
  }
}

const getTypeClass = (type) => {
  const classes = {
    promotion: 'bg-blue-100 text-blue-800',
    review: 'bg-green-100 text-green-800',
    data: 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getTypeText = (type) => {
  const texts = {
    promotion: '推广',
    review: '评价',
    data: '数据采集'
  }
  return texts[type] || type
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadTasks()
})
</script>
