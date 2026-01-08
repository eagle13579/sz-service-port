<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="6" v-for="stat in statistics" :key="stat.key">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon :size="40" :color="stat.color">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 信用评分 -->
      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <h3>信用评分</h3>
              <el-tag :type="getCreditTag(creditScore)">{{ getCreditLevel(creditScore) }}</el-tag>
            </div>
          </template>
          <div class="credit-score">
            <el-progress
              type="circle"
              :percentage="creditScore"
              :color="getCreditColor(creditScore)"
              :stroke-width="12"
            />
            <div class="credit-desc">
              当前信用分：{{ creditScore }}<br>
              等级：{{ getCreditLevel(creditScore) }}
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 技能标签 -->
      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <h3>我的技能</h3>
              <el-button type="primary" size="small" @click="showAddSkillDialog">添加技能</el-button>
            </div>
          </template>
          <div class="skills-list">
            <el-tag
              v-for="skill in skills"
              :key="skill.id"
              :type="skill.verified ? 'success' : 'info'"
              closable
              @close="handleDeleteSkill(skill.id)"
              style="margin: 5px"
            >
              {{ skill.skill_name }} (Lv.{{ skill.skill_level }})
            </el-tag>
            <el-empty v-if="!skills || skills.length === 0" description="暂无技能" :image-size="80" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加技能对话框 -->
    <el-dialog v-model="addSkillDialogVisible" title="添加技能" width="500px">
      <el-form :model="skillForm" label-width="100px">
        <el-form-item label="技能名称">
          <el-input v-model="skillForm.skill_name" placeholder="请输入技能名称" />
        </el-form-item>
        <el-form-item label="技能等级">
          <el-select v-model="skillForm.skill_level" placeholder="请选择技能等级">
            <el-option label="初级" :value="1" />
            <el-option label="中级" :value="2" />
            <el-option label="高级" :value="3" />
            <el-option label="专家" :value="4" />
            <el-option label="大师" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="证书链接">
          <el-input v-model="skillForm.certificate_url" placeholder="请输入技能证书链接" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addSkillDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSkill" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getProfile, addSkill, getSkills, deleteSkill, getCreditScore, getRewardStatistics } from '../../api/member';

const statistics = ref([
  { key: 'tasks', label: '认领任务', value: 0, icon: 'Briefcase', color: '#409eff' },
  { key: 'income', label: '总收益', value: '¥0.00', icon: 'Money', color: '#67c23a' },
  { key: 'reviews', label: '收到评价', value: 0, icon: 'Star', color: '#e6a23c' },
  { key: 'points', label: '积分', value: 0, icon: 'Medal', color: '#f56c6c' }
]);

const creditScore = ref(100);
const skills = ref([]);
const addSkillDialogVisible = ref(false);
const loading = ref(false);

const skillForm = reactive({
  skill_name: '',
  skill_level: 1,
  certificate_url: ''
});

const getCreditLevel = (score) => {
  if (score >= 900) return 'A';
  if (score >= 750) return 'B';
  if (score >= 600) return 'C';
  return 'D';
};

const getCreditColor = (score) => {
  if (score >= 900) return '#67c23a';
  if (score >= 750) return '#e6a23c';
  if (score >= 600) return '#f56c6c';
  return '#909399';
};

const getCreditTag = (score) => {
  const level = getCreditLevel(score);
  return level === 'A' ? 'success' : level === 'B' ? 'warning' : level === 'C' ? 'danger' : 'info';
};

const loadData = async () => {
  try {
    const [profileRes, creditRes, rewardRes] = await Promise.all([
      getProfile(),
      getCreditScore(),
      getRewardStatistics()
    ]);

    skills.value = profileRes.data.skills || [];
    creditScore.value = creditRes.data.credit_score;
    statistics.value[0].value = profileRes.data.task_claim_count || 0;
    statistics.value[1].value = `¥${(rewardRes.data.total_income || 0).toFixed(2)}`;
    statistics.value[3].value = rewardRes.data.total_points || 0;

    // 获取评价数量
    const ratingStats = creditRes.data.rating_stats;
    statistics.value[2].value = ratingStats.total_reviews || 0;
  } catch (error) {
    console.error('加载数据失败:', error);
  }
};

const showAddSkillDialog = () => {
  addSkillDialogVisible.value = true;
};

const handleAddSkill = async () => {
  try {
    if (!skillForm.skill_name) {
      ElMessage.warning('请输入技能名称');
      return;
    }

    loading.value = true;
    await addSkill(skillForm);

    ElMessage.success('技能添加成功');
    addSkillDialogVisible.value = false;

    // 重置表单
    Object.assign(skillForm, {
      skill_name: '',
      skill_level: 1,
      certificate_url: ''
    });

    // 重新加载数据
    await loadData();
  } catch (error) {
    console.error('添加技能失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleDeleteSkill = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个技能吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await deleteSkill(id);
    ElMessage.success('技能删除成功');

    await loadData();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除技能失败:', error);
    }
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.info-card {
  min-height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.credit-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.credit-desc {
  text-align: center;
  color: #666;
  line-height: 1.8;
}

.skills-list {
  min-height: 150px;
}
</style>
