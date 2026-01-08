<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">任务管理</h1>
          <p class="text-gray-600">管理您发布的任务</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i>发布任务
        </button>
      </div>
      
      <!-- 任务列表 -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-600"></i>
      </div>
      
      <div v-else-if="tasks.length === 0" class="card text-center py-12">
        <i class="fas fa-tasks text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">暂无发布的任务</p>
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="task in tasks" :key="task.id" class="card hover:shadow-lg transition-shadow">
          <div class="flex flex-col md:flex-row">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-900">{{ task.task_title }}</h3>
                    <span :class="[
                      'px-2 py-1 rounded text-xs',
                      task.status === 'published' ? 'bg-green-100 text-green-700' :
                      task.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    ]">
                      {{ getStatusName(task.status) }}
                    </span>
                    <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                      {{ getTaskType(task.task_type) }}
                    </span>
                  </div>
                  <p class="text-gray-600">{{ task.task_desc }}</p>
                </div>
                <div class="text-right ml-4">
                  <div class="text-2xl font-bold text-primary-600">¥{{ task.budget }}</div>
                  <div class="text-sm text-gray-500">任务预算</div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <i class="fas fa-calendar w-5"></i>
                  <span class="ml-2">截止: {{ task.deadline || '不限' }}</span>
                </div>
                <div>
                  <i class="fas fa-user-check w-5"></i>
                  <span class="ml-2">{{ task.claimed_member_nickname || '未认领' }}</span>
                </div>
                <div>
                  <i class="fas fa-eye w-5"></i>
                  <span class="ml-2">浏览: {{ task.view_count }}</span>
                </div>
                <div>
                  <i class="fas fa-clock w-5"></i>
                  <span class="ml-2">发布: {{ formatDate(task.created_at) }}</span>
                </div>
              </div>
              
              <div v-if="task.skill_requirements" class="text-sm text-gray-600 mb-4">
                <strong>技能要求:</strong> {{ task.skill_requirements }}
              </div>
              
              <!-- 认领信息 -->
              <div v-if="task.task_claims && task.task_claims.length > 0" class="mt-4 pt-4 border-t">
                <h4 class="font-semibold text-gray-800 mb-3">认领申请 ({{ task.task_claims.length }})</h4>
                <div class="space-y-2">
                  <div v-for="claim in task.task_claims" :key="claim.id" class="bg-gray-50 rounded p-3">
                    <div class="flex justify-between items-start">
                      <div>
                        <div class="flex items-center space-x-2 mb-1">
                          <span class="font-medium">{{ claim.member_nickname }}</span>
                          <span :class="[
                            'px-2 py-1 rounded text-xs',
                            claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          ]">
                            {{ getClaimStatusName(claim.status) }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600">{{ claim.claim_reason }}</p>
                        <div class="text-sm text-gray-500 mt-1">
                          <span>报价: ¥{{ claim.quote }}</span>
                          <span class="ml-4">预计: {{ claim.estimated_time || '待确定' }}</span>
                        </div>
                      </div>
                      <div v-if="claim.status === 'pending'" class="flex space-x-2">
                        <button @click="approveClaim(task.id, claim.id)" class="btn btn-primary text-sm py-1">
                          通过
                        </button>
                        <button @click="rejectClaim(task.id, claim.id)" class="btn bg-red-600 text-white hover:bg-red-700 text-sm py-1">
                          拒绝
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="mt-4 pt-4 border-t flex justify-end space-x-3">
            <button class="btn btn-secondary">编辑</button>
            <button class="btn bg-red-600 text-white hover:bg-red-700">取消</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建任务模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold">发布任务</h3>
        </div>
        <form @submit.prevent="createTask" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务标题 *</label>
            <input v-model="taskForm.task_title" type="text" required class="input" placeholder="请输入任务标题">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务描述 *</label>
            <textarea v-model="taskForm.task_desc" required class="input" rows="3" placeholder="请输入任务描述"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">任务类型 *</label>
              <select v-model="taskForm.task_type" required class="input">
                <option value="market">市场调研</option>
                <option value="operation">运营推广</option>
                <option value="investment">投资对接</option>
                <option value="design">品牌设计</option>
                <option value="tech">技术开发</option>
                <option value="translation">翻译服务</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">预算 *</label>
              <input v-model.number="taskForm.budget" type="number" step="0.01" required class="input" placeholder="请输入预算">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">截止日期</label>
            <input v-model="taskForm.deadline" type="date" class="input">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">技能要求</label>
            <textarea v-model="taskForm.skill_requirements" class="input" rows="2" placeholder="请输入技能要求"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">交付标准</label>
            <textarea v-model="taskForm.delivery_standards" class="input" rows="2" placeholder="请输入交付标准"></textarea>
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

const tasks = ref([])
const loading = ref(false)
const showCreateModal = ref(false)

const taskForm = reactive({
  task_title: '',
  task_desc: '',
  task_type: 'market',
  budget: 0,
  deadline: '',
  skill_requirements: '',
  delivery_standards: ''
})

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

function getClaimStatusName(status) {
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

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

async function fetchTasks() {
  loading.value = true
  try {
    const response = await api.get('/tasks?page=1&pageSize=50')
    if (response.code === 200) {
      tasks.value = response.data.list
    }
  } catch (error) {
    console.error('获取任务列表失败:', error)
  } finally {
    loading.value = false
  }
}

async function createTask() {
  try {
    const response = await api.post('/tasks', taskForm)
    if (response.code === 200) {
      alert('任务发布成功！')
      showCreateModal.value = false
      // 重置表单
      Object.assign(taskForm, {
        task_title: '',
        task_desc: '',
        task_type: 'market',
        budget: 0,
        deadline: '',
        skill_requirements: '',
        delivery_standards: ''
      })
      await fetchTasks()
    } else {
      alert(response.message || '发布失败')
    }
  } catch (error) {
    alert(error.message || '发布失败，请稍后重试')
  }
}

async function approveClaim(taskId, claimId) {
  if (!confirm('确定要通过这个认领申请吗？')) {
    return
  }
  
  try {
    const response = await api.post(`/tasks/${taskId}/claims/${claimId}/approve`, {
      status: 'approved',
      remark: '同意认领'
    })
    
    if (response.code === 200) {
      alert('认领已通过')
      await fetchTasks()
    } else {
      alert(response.message || '操作失败')
    }
  } catch (error) {
    alert(error.message || '操作失败')
  }
}

async function rejectClaim(taskId, claimId) {
  const remark = prompt('请输入拒绝理由:')
  if (!remark) return
  
  try {
    const response = await api.post(`/tasks/${taskId}/claims/${claimId}/approve`, {
      status: 'rejected',
      remark
    })
    
    if (response.code === 200) {
      alert('认领已拒绝')
      await fetchTasks()
    } else {
      alert(response.message || '操作失败')
    }
  } catch (error) {
    alert(error.message || '操作失败')
  }
}

onMounted(() => {
  fetchTasks()
})
</script>
