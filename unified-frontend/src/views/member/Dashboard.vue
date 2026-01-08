<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部横幅 -->
    <div class="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-8">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">欢迎，{{ member?.nickname || user?.username }}</h1>
            <p class="text-gray-100">
              {{ getMemberType(member?.member_type) }} | 信用分: {{ member?.credit_score || 0 }} | 积分: {{ member?.points || 0 }}
            </p>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-4">
            <div class="text-center bg-white/10 rounded-lg p-4">
              <div class="text-2xl font-bold">{{ member?.task_count || 0 }}</div>
              <div class="text-sm">完成任务</div>
            </div>
            <div class="text-center bg-white/10 rounded-lg p-4">
              <div class="text-2xl font-bold">¥{{ member?.total_income || 0 }}</div>
              <div class="text-sm">总收益</div>
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
            <h3 class="text-lg font-semibold mb-4">会员中心</h3>
            <nav class="space-y-2">
              <router-link to="/member" class="block px-4 py-2 rounded-md bg-primary-50 text-primary-700">
                <i class="fas fa-home mr-2"></i>概览
              </router-link>
              <router-link to="/member/tasks" class="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <i class="fas fa-tasks mr-2"></i>任务大厅
              </router-link>
              <router-link to="/member/my-tasks" class="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <i class="fas fa-list-check mr-2"></i>我的任务
              </router-link>
              <router-link to="/member/activities" class="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <i class="fas fa-calendar-alt mr-2"></i>活动中心
              </router-link>
            </nav>
          </div>
        </div>
        
        <!-- 右侧内容 -->
        <div class="lg:col-span-2">
          <!-- 最新任务 -->
          <div class="card mb-8">
            <h3 class="text-lg font-semibold mb-4">最新推荐任务</h3>
            <div v-if="loading" class="text-center py-8">
              <i class="fas fa-spinner fa-spin text-3xl text-primary-600"></i>
            </div>
            <div v-else-if="tasks.length === 0" class="text-center py-8 text-gray-500">
              暂无推荐任务
            </div>
            <div v-else class="space-y-4">
              <div v-for="task in tasks" :key="task.id" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-2">{{ task.task_title }}</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ task.task_desc }}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span><i class="fas fa-building mr-1"></i>{{ task.company_name }}</span>
                      <span><i class="fas fa-coins mr-1"></i>¥{{ task.budget }}</span>
                      <span><i class="fas fa-clock mr-1"></i>{{ task.deadline }}</span>
                    </div>
                  </div>
                  <router-link :to="`/member/tasks/${task.id}`" class="btn btn-primary ml-4">
                    查看详情
                  </router-link>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <router-link to="/member/tasks" class="text-primary-600 hover:text-primary-700 font-medium">
                查看更多任务 <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
          </div>
          
          <!-- 我的活动 -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">我的活动</h3>
            <div v-if="activities.length === 0" class="text-center py-8 text-gray-500">
              暂无报名活动
            </div>
            <div v-else class="space-y-4">
              <div v-for="activity in activities" :key="activity.id" class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-800 mb-2">{{ activity.activity_title }}</h4>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span><i class="fas fa-calendar mr-1"></i>{{ formatDate(activity.start_time) }}</span>
                  <span><i class="fas fa-map-marker-alt mr-1"></i>{{ activity.location }}</span>
                  <span><i class="fas fa-coins mr-1"></i>¥{{ activity.fee }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <router-link to="/member/activities" class="text-primary-600 hover:text-primary-700 font-medium">
                查看更多活动 <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
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
const user = authStore.user

const member = ref(null)
const tasks = ref([])
const activities = ref([])
const loading = ref(false)

function getMemberType(type) {
  const types = {
    normal: '普通会员',
    excellent: '优质会员',
    expert: '专家会员',
    vip: 'VIP会员'
  }
  return types[type] || '会员'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

async function fetchData() {
  loading.value = true
  try {
    // 获取会员信息
    const memberRes = await api.get('/members/me')
    if (memberRes.code === 200) {
      member.value = memberRes.data
    }
    
    // 获取推荐任务
    const tasksRes = await api.get('/tasks?status=published&page=1&pageSize=3')
    if (tasksRes.code === 200) {
      tasks.value = tasksRes.data.list
    }
    
    // 获取我的活动
    const activitiesRes = await api.get('/activities?status=published&page=1&pageSize=3')
    if (activitiesRes.code === 200) {
      activities.value = activitiesRes.data.list
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
