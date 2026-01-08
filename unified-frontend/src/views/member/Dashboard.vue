<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <!-- Page Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">会员中心</h1>
          <p class="text-gray-600 mt-2">欢迎回来，{{ authStore.user?.username }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <StatusBadge status="success" label="正常" />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="积分"
          :value="stats.points"
          icon="fas fa-star"
          color="yellow"
          :change="12"
          :progress="75"
        />
        <StatCard
          label="已完成任务"
          :value="stats.completedTasks"
          icon="fas fa-check-circle"
          color="green"
          :change="8"
          :progress="60"
        />
        <StatCard
          label="进行中任务"
          :value="stats.inProgressTasks"
          icon="fas fa-clock"
          color="blue"
          :change="5"
          :progress="40"
        />
        <StatCard
          label="信用分"
          :value="stats.creditScore"
          icon="fas fa-award"
          color="purple"
          :change="3"
          :progress="90"
        />
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link 
          to="/member/tasks" 
          class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <i class="fas fa-tasks text-blue-600 text-3xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">任务大厅</h3>
            <p class="text-gray-600 text-sm">浏览和领取可用任务</p>
          </div>
        </router-link>
        <router-link 
          to="/member/my-tasks" 
          class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <i class="fas fa-list-check text-green-600 text-3xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">我的任务</h3>
            <p class="text-gray-600 text-sm">查看任务进度和完成情况</p>
          </div>
        </router-link>
        <router-link 
          to="/member/activities" 
          class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <i class="fas fa-calendar-alt text-purple-600 text-3xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">活动中心</h3>
            <p class="text-gray-600 text-sm">参与平台活动赚取积分</p>
          </div>
        </router-link>
      </div>

      <!-- Recent Tasks -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">最近任务</h2>
          <router-link to="/member/my-tasks" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            查看全部 <i class="fas fa-arrow-right ml-1"></i>
          </router-link>
        </div>
        <div class="p-6">
          <div v-if="recentTasks.length === 0" class="text-center py-12 text-gray-500">
            <i class="fas fa-inbox text-5xl mb-4 opacity-50"></i>
            <p class="text-lg">暂无任务记录</p>
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="task in recentTasks" 
              :key="task.id" 
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 mb-1">{{ task.title }}</h3>
                <p class="text-sm text-gray-600">{{ task.description }}</p>
              </div>
              <StatusBadge 
                :status="task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'processing' : 'default'"
                :label="getStatusText(task.status)"
              />
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
import StatCard from '@/components/ui/StatCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const authStore = useAuthStore()

const stats = ref({
  points: 0,
  completedTasks: 0,
  inProgressTasks: 0,
  creditScore: 0
})

const recentTasks = ref([])

const loadStats = async () => {
  // 模拟数据
  stats.value = {
    points: Math.floor(Math.random() * 1000) + 500,
    completedTasks: Math.floor(Math.random() * 50) + 10,
    inProgressTasks: Math.floor(Math.random() * 10) + 1,
    creditScore: Math.floor(Math.random() * 20) + 80
  }
  
  // 模拟任务
  recentTasks.value = []
}

onMounted(() => {
  loadStats()
})

const getStatusText = (status) => {
  const texts = {
    pending: '待领取',
    in_progress: '进行中',
    completed: '已完成'
  }
  return texts[status] || status
}
</script>
