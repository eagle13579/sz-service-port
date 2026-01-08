<template>
  <div class="task-publish">
    <div class="page-header">
      <h2>发布任务</h2>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 基本信息 -->
      <el-card class="form-card">
        <template #header>
          <h3>基本信息</h3>
        </template>

        <el-form-item label="任务标题" prop="task_title">
          <el-input
            v-model="formData.task_title"
            placeholder="请输入任务标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="任务类型" prop="task_type">
          <el-select
            v-model="formData.task_type"
            placeholder="请选择任务类型"
            style="width: 100%"
          >
            <el-option label="市场调研" value="market" />
            <el-option label="运营推广" value="operation" />
            <el-option label="投资融资" value="investment" />
            <el-option label="设计创作" value="design" />
            <el-option label="技术开发" value="tech" />
            <el-option label="翻译服务" value="translation" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="预算" prop="budget">
          <el-input-number
            v-model="formData.budget"
            :min="0"
            :precision="2"
            :step="100"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">元</span>
        </el-form-item>

        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker
            v-model="formData.deadline"
            type="date"
            placeholder="请选择截止日期"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
        </el-form-item>
      </el-card>

      <!-- 任务详情 -->
      <el-card class="form-card">
        <template #header>
          <h3>任务详情</h3>
        </template>

        <el-form-item label="任务描述" prop="task_desc">
          <el-input
            v-model="formData.task_desc"
            type="textarea"
            :rows="10"
            placeholder="请详细描述任务需求、目标、交付物等"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="技能要求" prop="skill_requirements">
          <el-input
            v-model="formData.skill_requirements"
            type="textarea"
            :rows="4"
            placeholder="请描述任务需要的专业技能"
            maxlength="1000"
          />
        </el-form-item>

        <el-form-item label="资质要求" prop="qualification_requirements">
          <el-input
            v-model="formData.qualification_requirements"
            type="textarea"
            :rows="4"
            placeholder="请描述任务需要的资质证书等要求"
            maxlength="1000"
          />
        </el-form-item>
      </el-card>

      <!-- 工作量与交付 -->
      <el-card class="form-card">
        <template #header>
          <h3>工作量与交付</h3>
        </template>

        <el-form-item label="工作量估算" prop="workload_estimate">
          <el-input
            v-model="formData.workload_estimate"
            placeholder="例如：预计需要5个工作日，每天8小时"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item label="交付标准" prop="delivery_standards">
          <el-input
            v-model="formData.delivery_standards"
            type="textarea"
            :rows="4"
            placeholder="请描述任务完成后的交付标准和验收要求"
            maxlength="2000"
          />
        </el-form-item>

        <el-form-item label="地点类型" prop="location_type">
          <el-radio-group v-model="formData.location_type">
            <el-radio label="online">线上</el-radio>
            <el-radio label="offline">线下</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.location_type === 'offline'"
          label="具体地点"
          prop="location"
        >
          <el-input
            v-model="formData.location"
            placeholder="请输入具体工作地点"
            maxlength="255"
          />
        </el-form-item>
      </el-card>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleSubmit"
        >
          发布任务
        </el-button>
        <el-button
          size="large"
          @click="handleReset"
        >
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createTask } from '../../api/task';

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const formData = reactive({
  task_title: '',
  task_type: '',
  budget: null,
  deadline: null,
  task_desc: '',
  skill_requirements: '',
  qualification_requirements: '',
  workload_estimate: '',
  delivery_standards: '',
  location_type: 'online',
  location: ''
});

const rules = {
  task_title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' }
  ],
  task_type: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  task_desc: [
    { required: true, message: '请输入任务描述', trigger: 'blur' },
    { min: 50, message: '任务描述不能少于50个字符', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止日期', trigger: 'change' }
  ]
};

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    loading.value = true;

    const dataToSend = { ...formData };
    if (dataToSend.deadline) {
      dataToSend.deadline = new Date(dataToSend.deadline).toISOString().split('T')[0];
    }

    await createTask(dataToSend);

    ElMessage.success('任务发布成功');
    router.push('/supplier/tasks');
  } catch (error) {
    if (error.response) {
      ElMessage.error(error.response.data.message || '发布失败');
    } else {
      console.error('发布失败:', error);
    }
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formRef.value.resetFields();
  }).catch(() => {});
};
</script>

<style scoped>
.task-publish {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.form-card {
  margin-bottom: 20px;
}

.form-card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.form-actions {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 4px;
}

.form-actions .el-button {
  margin: 0 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
