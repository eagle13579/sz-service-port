import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/supplier',
    name: 'Supplier',
    component: () => import('@/views/supplier/Dashboard.vue'),
    meta: { title: '供应商中心', requiresAuth: true, allowedRoles: ['supplier', 'admin'] }
  },
  {
    path: '/supplier/products',
    name: 'SupplierProducts',
    component: () => import('@/views/supplier/Products.vue'),
    meta: { title: '产品管理', requiresAuth: true, allowedRoles: ['supplier', 'admin'] }
  },
  {
    path: '/supplier/tasks',
    name: 'SupplierTasks',
    component: () => import('@/views/supplier/Tasks.vue'),
    meta: { title: '任务管理', requiresAuth: true, allowedRoles: ['supplier', 'admin'] }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/member/Dashboard.vue'),
    meta: { title: '会员中心', requiresAuth: true, allowedRoles: ['member', 'admin'] }
  },
  {
    path: '/member/tasks',
    name: 'MemberTasks',
    component: () => import('@/views/member/Tasks.vue'),
    meta: { title: '任务大厅', requiresAuth: true, allowedRoles: ['member', 'admin'] }
  },
  {
    path: '/member/my-tasks',
    name: 'MyTasks',
    component: () => import('@/views/member/MyTasks.vue'),
    meta: { title: '我的任务', requiresAuth: true, allowedRoles: ['member', 'admin'] }
  },
  {
    path: '/member/activities',
    name: 'Activities',
    component: () => import('@/views/member/Activities.vue'),
    meta: { title: '活动中心', requiresAuth: true, allowedRoles: ['member', 'admin'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { title: '管理后台', requiresAuth: true, allowedRoles: ['admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = `${to.meta.title} - 数智服务港`
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // 检查角色权限
  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(authStore.user?.role)) {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router
