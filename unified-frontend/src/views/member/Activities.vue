<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">活动中心</h1>
      
      <!-- 活动筛选 -->
      <div class="card mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">活动类型</label>
            <select v-model="filters.activity_type" class="input">
              <option value="">全部</option>
              <option value="lunch">大咖午餐会</option>
              <option value="course">专项课程培训</option>
              <option value="event">共建活动</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">活动状态</label>
            <select v-model="filters.status" class="input">
              <option value="">全部</option>
              <option value="published">已发布</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <button @click="fetchActivities" class="btn btn-primary w-full">
              <i class="fas fa-search mr-2"></i>搜索
            </button>
          </div>
        </div>
      </div>
      
      <!-- 活动列表 -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-600"></i>
      </div>
      
      <div v-else-if="activities.length === 0" class="card text-center py-12">
        <i class="fas fa-calendar-alt text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">暂无符合条件的活动</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="activity in activities" :key="activity.id" class="card hover:shadow-lg transition-shadow">
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span :class="[
                'px-2 py-1 rounded text-sm',
                activity.activity_type === 'lunch' ? 'bg-orange-100 text-orange-700' :
                activity.activity_type === 'course' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              ]">
                {{ getActivityType(activity.activity_type) }}
              </span>
              <span class="text-sm text-gray-500">{{ getStatusName(activity.status) }}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ activity.activity_title }}</h3>
            <p class="text-gray-600 text-sm">{{ activity.activity_desc }}</p>
          </div>
          
          <div class="space-y-2 text-sm text-gray-600 mb-4">
            <div class="flex items-center">
              <i class="fas fa-user-tie w-5"></i>
              <span class="ml-2">{{ activity.speaker || '待定' }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-calendar w-5"></i>
              <span class="ml-2">{{ formatDateTime(activity.start_time) }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt w-5"></i>
              <span class="ml-2">{{ activity.location || '线上' }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-users w-5"></i>
              <span class="ml-2">{{ activity.current_participants }}/{{ activity.max_participants || '不限' }}人</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-coins w-5"></i>
              <span class="ml-2 text-primary-600 font-semibold">¥{{ activity.fee || 0 }}</span>
            </div>
          </div>
          
          <button
            v-if="!activity.isRegistered && activity.status === 'published'"
            @click="registerActivity(activity)"
            class="btn btn-primary w-full"
            :disabled="activity.max_participants && activity.current_participants >= activity.max_participants"
          >
            <i class="fas fa-user-plus mr-2"></i>
            {{ activity.max_participants && activity.current_participants >= activity.max_participants ? '名额已满' : '立即报名' }}
          </button>
          
          <button
            v-else-if="activity.isRegistered"
            class="btn btn-secondary w-full"
            disabled
          >
            <i class="fas fa-check mr-2"></i>已报名
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/utils/api'

const filters = reactive({
  activity_type: '',
  status: 'published'
})

const activities = ref([])
const loading = ref(false)

function getActivityType(type) {
  const types = {
    lunch: '大咖午餐会',
    course: '专项课程培训',
    event: '共建活动'
  }
  return types[type] || type
}

function getStatusName(status) {
  const names = {
    draft: '草稿',
    published: '已发布',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return names[status] || status
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function fetchActivities() {
  loading.value = true
  try {
    const params = {
      page: 1,
      pageSize: 50,
      ...filters
    }
    
    const response = await api.get('/activities', { params })
    
    if (response.code === 200) {
      activities.value = response.data.list
    }
  } catch (error) {
    console.error('获取活动列表失败:', error)
  } finally {
    loading.value = false
  }
}

async function registerActivity(activity) {
  if (!confirm(`确定要报名「${activity.activity_title}」吗？费用: ¥${activity.fee || 0}`)) {
    return
  }
  
  try {
    const response = await api.post(`/activities/${activity.id}/register`)
    
    if (response.code === 200) {
      alert('报名成功！')
      await fetchActivities()
    } else {
      alert(response.message || '报名失败')
    }
  } catch (error) {
    alert(error.message || '报名失败，请稍后重试')
  }
}

onMounted(() => {
  fetchActivities()
})
</script>
