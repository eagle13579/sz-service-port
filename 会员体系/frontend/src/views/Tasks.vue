<template>
  <div class="tasks-page">
    <div class="page-header">
      <h2>任务大厅</h2>
      <div class="filters">
        <el-select v-model="filters.task_type" placeholder="任务类型" clearable style="width: 150px; margin-right: 10px">
          <el-option label="市场调研" value="market" />
          <el-option label="运营推广" value="operation" />
          <el-option label="投资对接" value="investment" />
          <el-option label="品牌设计" value="design" />
          <el-option label="技术开发" value="tech" />
          <el-option label="翻译服务" value="translation" />
        </el-select>
        <el-input
          v-model="filters.keyword"
          placeholder="搜索任务"
          clearable
          style="width: 200px; margin-right: 10px"
          @keyup.enter="loadTasks"
        />
        <el-button type="primary" @click="loadTasks">搜索</el-button>
      </div>
    </div>

    <div class="task-list">
      <el-card v-for="task in tasks" :key="task.id" class="task-card" shadow="hover" @click="goToDetail(task.id)">
        <div class="task-header">
          <h3>{{ task.task_title }}</h3>
          <el-tag :type="getTypeTag(task.task_type)">{{ getTypeName(task.task_type) }}</el-tag>
        </div>
        <div class="task-info">
          <div class="info-item">
            <el-icon><Money /></el-icon>
            <span>预算：¥{{ task.budget || '面议' }}</span>
          </div>
          <div class="info-item">
            <el-icon><Clock /></el-icon>
            <span>截止：{{ formatDate(task.deadline) }}</span>
          </div>
        </div>
        <div class="task-desc">
          {{ task.task_desc }}
        </div>
        <div class="task-footer">
          <span class="company">{{ task.company_name }}</span>
          <el-button type="primary" size="small">查看详情</el-button>
        </div>
      </el-card>
    </div>

    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="loadTasks"
      @current-change="loadTasks"
      style="margin-top: 20px; text-align: center"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTasks } from '../api/task';

const router = useRouter();

const tasks = ref([]);
const filters = reactive({
  task_type: '',
  keyword: ''
});
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
});

const loadTasks = async () => {
  try {
    const res = await getTasks({
      page: pagination.page,
      pageSize: pagination.pageSize,
      task_type: filters.task_type,
      keyword: filters.keyword
    });

    tasks.value = res.data.list;
    pagination.total = res.data.total;
  } catch (error) {
    console.error('加载任务列表失败:', error);
  }
};

const formatDate = (date) => {
  if (!date) return '未设置';
  return new Date(date).toLocaleDateString('zh-CN');
};

const getTypeName = (type) => {
  const typeMap = {
    market: '市场调研',
    operation: '运营推广',
    investment: '投资对接',
    design: '品牌设计',
    tech: '技术开发',
    translation: '翻译服务',
    other: '其他'
  };
  return typeMap[type] || '其他';
};

const getTypeTag = (type) => {
  const tagMap = {
    market: '',
    operation: 'success',
    investment: 'warning',
    design: 'danger',
    tech: 'info',
    translation: ''
  };
  return tagMap[type] || '';
};

const goToDetail = (id) => {
  router.push(`/tasks/${id}`);
};

onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
.tasks-page {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.filters {
  display: flex;
  align-items: center;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.task-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-5px);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.task-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  flex: 1;
  padding-right: 10px;
}

.task-info {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-desc {
  color: #999;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.company {
  color: #999;
  font-size: 13px;
}
</style>
