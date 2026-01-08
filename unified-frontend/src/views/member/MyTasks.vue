<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">我的任务</h1>
      
      <!-- 任务标签 -->
      <div class="flex space-x-4 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="currentTab = tab.key"
          :class="[
            'px-4 py-2 rounded-md font-medium',
            currentTab === tab.key
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- 任务列表 -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-600"></i>
      </div>
      
      <div v-else-if="myTasks.length === 0" class="card text-center py-12">
        <i class="fas fa-list-check text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">暂无任务</p>
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="taskClaim in myTasks" :key="taskClaim.id" class="card">
          <div class="flex flex-col md:flex-row">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    {{ taskClaim.task_title }}
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      getStatusClass(taskClaim.status)
                    ]">
                      {{ getStatusName(taskClaim.status) }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-primary-600">¥{{ taskClaim.quote || taskClaim.task_budget }}</div>
                  <div class="text-sm text-gray-500">任务报价/预算</div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <i class="fas fa-building mr-1"></i>
                  <span>{{ taskClaim.supplier_name }}</span>
                </div>
                <div>
                  <i class="fas fa-calendar mr-1"></i>
                  <span>认领: {{ formatDate(taskClaim.created_at) }}</span>
                </div>
                <div>
                  <i class="fas fa-percent mr-1"></i>
                  <span>进度: {{ taskClaim.progress || 0 }}%</span>
                </div>
                <div>
                  <i class="fas fa-calendar-check mr-1"></i>
                  <span>预计: {{ taskClaim.estimated_time || '待确定' }}</span>
                </div>
              </div>
              
              <!-- 进度条 -->
              <div v-if="taskClaim.status === 'approved' || taskClaim.status === 'in_progress'" class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>任务进度</span>
                  <span>{{ taskClaim.progress || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full"
                    :style="{ width: `${taskClaim.progress || 0}%` }"
                  ></div>
                </div>
              </div>
              
              <!-- 认领理由 -->
              <div v-if="taskClaim.claim_reason" class="text-sm text-gray-600 mb-4">
                <strong>认领理由:</strong> {{ taskClaim.claim_reason }}
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              v-if="taskClaim.status === 'approved' || taskClaim.status === 'in_progress'"
              @click="updateProgress(taskClaim)"
              class="btn btn-primary"
            >
              <i class="fas fa-tasks mr-2"></i>更新进度
            </button>
            <button
              v-if="taskClaim.status === 'approved' || taskClaim.status === 'in_progress'"
              @click="submitDelivery(taskClaim)"
              class="btn btn-secondary"
            >
              <i class="fas fa-upload mr-2"></i>提交交付物
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const currentTab = ref('all')
const myTasks = ref([])
const loading = ref(false)

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'approved', label: '已通过' },
  { key: 'in_progress', label: '进行中' },
  { key: 'completed', label: '已完成' }
]

function getStatusName(status) {
  const names = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return names[status] || status
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

async function fetchMyTasks() {
  loading.value = true
  try {
    const params = {
      page: 1,
      pageSize: 50
    }
    
    if (currentTab.value !== 'all') {
      params.status = currentTab.value
    }
    
    const response = await api.get('/task-claims', { params })
    
    if (response.code === 200) {
      myTasks.value = response.data.list
    }
  } catch (error) {
    console.error('获取我的任务失败:', error)
  } finally {
    loading.value = false
  }
}

function updateProgress(taskClaim) {
  const progress = prompt(`当前进度: ${taskClaim.progress}%\n请输入新的进度 (0-100):`)
  if (progress !== null) {
    const progressNum = parseInt(progress)
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      alert('请输入0-100之间的数字')
      return
    }
    
    // 调用API更新进度
    api.put(`/tasks/${taskClaim.task_id}/progress`, { progress: progressNum })
      .then(response => {
        if (response.code === 200) {
          alert('进度更新成功')
          fetchMyTasks()
        } else {
          alert(response.message || '更新失败')
        }
      })
      .catch(error => {
        alert(error.message || '更新失败')
      })
  }
}

function submitDelivery(taskClaim) {
  const url = prompt('请输入交付物URL:')
  if (url) {
    api.put(`/tasks/${taskClaim.task_id}/progress`, {
      progress: 100,
      delivery_url: url
    })
      .then(response => {
        if (response.code === 200) {
          alert('交付物提交成功')
          fetchMyTasks()
        } else {
          alert(response.message || '提交失败')
        }
      })
      .catch(error => {
        alert(error.message || '提交失败')
      })
  }
}

// 监听标签切换
onMounted(() => {
  fetchMyTasks()
})

// 当标签切换时重新获取数据
function onTabChange() {
  fetchMyTasks()
}

// 使用watch监听currentTab变化
import { watch } from 'vue'
watch(currentTab, () => {
  fetchMyTasks()
})
</script>
