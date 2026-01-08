<template>
  <div class="tasks">
    <el-card>
      <template #header>
        <div class="header-actions">
          <span>任务管理</span>
          <el-button type="primary" @click="handleAdd">发布任务</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="task_title" label="任务标题" />
        <el-table-column prop="task_type" label="任务类型" />
        <el-table-column prop="budget" label="预算" />
        <el-table-column prop="deadline" label="截止日期" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button text @click="handleEdit(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="fetchData"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0
})

const fetchData = async () => {
  console.log('获取任务列表', pagination.value)
}

const handleAdd = () => {
  ElMessage.success('任务发布功能待实现')
}

const handleEdit = (row) => {
  ElMessage.success('编辑功能待实现')
}

const handleDelete = (row) => {
  ElMessage.success('删除功能待实现')
}

const getStatusType = (status) => {
  const map = {
    draft: 'info',
    published: 'success',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    draft: '草稿',
    published: '已发布',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
