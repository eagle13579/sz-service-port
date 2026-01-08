<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(card, index) in cards" :key="index">
        <el-card class="card">
          <div class="card-content">
            <div class="card-icon" :style="{ background: card.color }">
              <el-icon :size="30"><component :is="card.icon" /></el-icon>
            </div>
            <div class="card-text">
              <div class="card-value">{{ card.value }}</div>
              <div class="card-label">{{ card.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="router.push('/supplier/products')">
              发布产品
            </el-button>
            <el-button type="success" @click="router.push('/supplier/tasks')">
              发布任务
            </el-button>
            <el-button type="warning" @click="router.push('/supplier/profile')">
              完善信息
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最新通知</span>
          </template>
          <el-empty description="暂无通知" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Goods, List, Document, Warning } from '@element-plus/icons-vue'

const router = useRouter()

const cards = ref([
  {
    icon: Goods,
    label: '产品数量',
    value: 0,
    color: '#409eff'
  },
  {
    icon: List,
    label: '任务数量',
    value: 0,
    color: '#67c23a'
  },
  {
    icon: Document,
    label: '订单数量',
    value: 0,
    color: '#e6a23c'
  },
  {
    icon: Warning,
    label: '待处理',
    value: 0,
    color: '#f56c6c'
  }
])
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.card-text {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.card-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quick-actions .el-button {
  width: 100%;
}
</style>
