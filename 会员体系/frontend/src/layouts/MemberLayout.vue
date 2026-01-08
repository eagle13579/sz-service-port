<template>
  <el-container class="member-layout">
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <h2>会员体系</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :ellipsis="false"
          router
        >
          <el-menu-item index="/tasks">任务大厅</el-menu-item>
          <el-menu-item index="/member/dashboard">会员中心</el-menu-item>
          <el-menu-item index="/member/profile">个人资料</el-menu-item>
          <el-menu-item index="/member/my-tasks">我的任务</el-menu-item>
          <el-menu-item index="/member/rewards">我的收益</el-menu-item>
          <el-menu-item index="/member/reviews">评价管理</el-menu-item>
        </el-menu>
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="32" :src="member?.avatar">
                {{ member?.nickname?.charAt(0) }}
              </el-avatar>
              <span class="username">{{ member?.nickname || '会员' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main class="main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '../stores/user';
import { getProfile } from '../api/member';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const activeMenu = ref(route.path);
const member = ref(null);

const loadMemberInfo = async () => {
  try {
    const res = await getProfile();
    member.value = res.data;
  } catch (error) {
    console.error('获取会员信息失败:', error);
  }
};

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout();
    ElMessage.success('已退出登录');
    router.push('/login');
  }).catch(() => {});
};

onMounted(() => {
  loadMemberInfo();
});
</script>

<style scoped>
.member-layout {
  min-height: 100vh;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
}

.logo h2 {
  margin: 0;
  color: #409eff;
  font-size: 24px;
}

:deep(.el-menu) {
  flex: 1;
  margin: 0 40px;
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #333;
}

.main {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
  background: #f5f7fa;
}
</style>
