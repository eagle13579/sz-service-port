<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">任务大厅</h1>
        <p class="text-gray-600">浏览并认领供应商发布的任务</p>
      </div>
      
      <!-- 筛选器 -->
      <div class="card mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务类型</label>
            <select v-model="filters.task_type" class="input">
              <option value="">全部</option>
              <option value="market">市场调研</option>
              <option value="operation">运营推广</option>
              <option value="investment">投资对接</option>
              <option value="design">品牌设计</option>
              <option value="tech">技术开发</option>
              <option value="translation">翻译服务</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务状态</label>
            <select v-model="filters.status" class="input">
              <option value="">全部</option>
              <option value="published">已发布</option>
              <option value="claimed">已认领</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">预算范围</label>
            <select v-model="filters.budget_range" class="input">
              <option value="">全部</option>
              <option value="0-1000">1000元以下</option>
              <option value="1000-5000">1000-5000元</option>
              <option value="5000-10000">5000-10000元</option>
              <option value="10000+">10000元以上</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <button @click="fetchTasks" class="btn btn-primary w-full">
              <i class="fas fa-search mr-2"></i>搜索
            </button>
          </div>
        </div>
      </div>
      
      <!-- 任务列表 -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-600"></i>
      </div>
      
      <div v-else-if="tasks.length === 0" class="card text-center py-12">
        <i class="fas fa-tasks text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">暂无符合条件的任务</p>
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="task in tasks" :key="task.id" class="card hover:shadow-lg transition-shadow">
          <div class="flex flex-col md:flex-row">
            <!-- 任务信息 -->
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    {{ task.task_title }}
                  </h3>
                  <div class="flex items-center space-x-2 mb-3">
                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                      {{ getTaskType(task.task_type) }}
                    </span>
                    <span :class="[
                      'px-2 py-1 rounded text-sm',
                      task.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    ]">
                      {{ getStatusName(task.status) }}
                    </span>
                  </div>
                </div>
                <div class="text-right mb-4">
                  <div class="text-2xl font-bold text-primary-600">¥{{ task.budget }}</div>
                  <div class="text-sm text-gray-500">任务预算</div>
                </div>
              </div>
              
              <p class="text-gray-600 mb-4">{{ task.task_desc }}</p>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                <div>
                  <i class="fas fa-building mr-1"></i>
                  <span>{{ task.company_name }}</span>
                </div>
                <div>
                  <i class="fas fa-clock mr-1"></i>
                  <span>截止: {{ task.deadline }}</span>
                </div>
                <div>
                  <i class="fas fa-eye mr-1"></i>
                  <span>浏览: {{ task.view_count }}</span>
                </div>
                <div>
                  <i class="fas fa-calendar mr-1"></i>
                  <span>发布: {{ formatDate(task.created_at) }}</span>
                </div>
              </div>
              
              <div v-if="task.skill_requirements" class="text-sm text-gray-600">
                <strong>技能要求:</strong> {{ task.skill_requirements }}
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <router-link :to="`/member/tasks/${task.id}`" class="btn btn-secondary">
              查看详情
            </router-link>
            <button
              v-if="task.status === 'published'"
              @click="claimTask(task.id)"
              class="btn btn-primary"
            >
              <i class="fas fa-hand-paper mr-2"></i>认领任务
            </button>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center space-x-2">
        <button
          v-for="page in pagination.totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 rounded-md',
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/api'

const router = useRouter()

const filters = reactive({
  task_type: '',
  status: 'published',
  budget_range: ''
})

const tasks = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pagination = reactive({
  total: 0,
  totalPages: 0
})

function getTaskType(type) {
  const types = {
    market: '市场调研',
    operation: '运营推广',
    investment: '投资对接',
    design: '品牌设计',
    tech: '技术开发',
    translation: '翻译服务',
    other: '其他'
  }
  return types[type] || type
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

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

async function fetchTasks() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: 10,
      ...filters
    }
    
    const response = await api.get('/tasks', { params })
    
    if (response.code === 200) {
      tasks.value = response.data.list
      pagination.total = response.data.pagination.total
      pagination.totalPages = response.data.pagination.totalPages
    }
  } catch (error) {
    console.error('获取任务列表失败:', error)
  } finally {
    loading.value = false
  }
}

async function claimTask(taskId) {
  if (!confirm('确定要认领这个任务吗？')) {
    return
  }
  
  try {
    const response = await api.post(`/tasks/${taskId}/claim`, {
      claim_reason: '我有信心完成这个任务',
      quote: 0,
      estimated_time: '待确定'
    })
    
    if (response.code === 200) {
      alert('任务认领申请已提交，等待供应商审核')
      await fetchTasks()
    } else {
      alert(response.message || '认领失败')
    }
  } catch (error) {
    alert(error.message || '认领失败，请稍后重试')
  }
}

function goToPage(page) {
  currentPage.value = page
  fetchTasks()
}

onMounted(() => {
  fetchTasks()
})
</script>
