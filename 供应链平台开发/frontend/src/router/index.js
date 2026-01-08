import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';

const routes = [
  {
    path: '/',
    redirect: '/login'
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
    path: '/supplier-register',
    name: 'SupplierRegister',
    component: () => import('../views/SupplierRegister.vue'),
    meta: { title: '供应商入驻', requiresAuth: true }
  },
  {
    path: '/supplier',
    component: () => import('../layouts/SupplierLayout.vue'),
    meta: { requiresAuth: true, roles: ['supplier', 'admin'] },
    children: [
      {
        path: 'dashboard',
        name: 'SupplierDashboard',
        component: () => import('../views/supplier/Dashboard.vue'),
        meta: { title: '工作台' }
      },
      {
        path: 'profile',
        name: 'SupplierProfile',
        component: () => import('../views/supplier/Profile.vue'),
        meta: { title: '企业信息' }
      },
      {
        path: 'products',
        name: 'SupplierProducts',
        component: () => import('../views/supplier/Products.vue'),
        meta: { title: '产品管理' }
      },
      {
        path: 'products/publish',
        name: 'ProductPublish',
        component: () => import('../views/supplier/ProductPublish.vue'),
        meta: { title: '发布产品' }
      },
      {
        path: 'tasks',
        name: 'SupplierTasks',
        component: () => import('../views/supplier/Tasks.vue'),
        meta: { title: '任务管理' }
      },
      {
        path: 'tasks/publish',
        name: 'TaskPublish',
        component: () => import('../views/supplier/TaskPublish.vue'),
        meta: { title: '发布任务' }
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
  document.title = to.meta.title ? `${to.meta.title} - 供应链平台` : '供应链平台';

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    if (!userStore.token) {
      ElMessage.warning('请先登录');
      next('/login');
      return;
    }

    // 检查角色权限
    if (to.meta.roles && !to.meta.roles.includes(userStore.user.role)) {
      ElMessage.error('您没有权限访问此页面');
      next('/');
      return;
    }
  }

  // 已登录用户访问登录/注册页面，重定向到工作台
  if (userStore.token && (to.path === '/login' || to.path === '/register')) {
    next('/supplier/dashboard');
    return;
  }

  next();
});

export default router;
