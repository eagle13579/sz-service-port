import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';

const routes = [
  {
    path: '/',
    redirect: '/tasks'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/Tasks.vue'),
    meta: { title: '任务大厅' }
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('../views/TaskDetail.vue'),
    meta: { title: '任务详情' }
  },
  {
    path: '/member',
    component: () => import('../layouts/MemberLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'MemberDashboard',
        component: () => import('../views/member/Dashboard.vue'),
        meta: { title: '会员中心' }
      },
      {
        path: 'profile',
        name: 'MemberProfile',
        component: () => import('../views/member/Profile.vue'),
        meta: { title: '个人资料' }
      },
      {
        path: 'my-tasks',
        name: 'MyTasks',
        component: () => import('../views/member/MyTasks.vue'),
        meta: { title: '我的任务' }
      },
      {
        path: 'rewards',
        name: 'Rewards',
        component: () => import('../views/member/Rewards.vue'),
        meta: { title: '我的收益' }
      },
      {
        path: 'reviews',
        name: 'Reviews',
        component: () => import('../views/member/Reviews.vue'),
        meta: { title: '评价管理' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 会员体系` : '会员体系';

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    if (!userStore.token) {
      ElMessage.warning('请先登录');
      next('/login');
      return;
    }
  }

  // 已登录用户访问登录/注册页面，重定向到会员中心
  if (userStore.token && (to.path === '/login' || to.path === '/register')) {
    next('/member/dashboard');
    return;
  }

  next();
});

export default router;
