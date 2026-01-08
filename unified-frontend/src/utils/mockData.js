// 数智服务港 - 模拟数据
// 用于在没有数据库的情况下测试前端功能

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  phone: '13800138000',
  role: 'member',
  status: 1,
  last_login_at: new Date().toISOString(),
  created_at: new Date().toISOString()
}

export const mockStats = {
  users: 1523,
  suppliers: 45,
  members: 1478,
  tasks: 892,
  products: 2341,
  activities: 56
}

export const mockMemberStats = {
  points: 1250,
  completedTasks: 45,
  inProgressTasks: 8,
  creditScore: 85
}

export const mockSupplierStats = {
  products: 156,
  tasks: 23,
  orders: 89,
  revenue: 156780
}

export const mockProducts = [
  {
    id: 1,
    name: '智能仓储管理系统',
    description: '基于物联网技术的智能仓储管理解决方案',
    category: '软件',
    price: 50000,
    supplier_id: 1,
    status: 'active',
    created_at: '2026-01-01'
  },
  {
    id: 2,
    name: '物流追踪平台',
    description: '实时物流信息追踪和路径优化',
    category: '软件',
    price: 35000,
    supplier_id: 1,
    status: 'active',
    created_at: '2026-01-02'
  },
  {
    id: 3,
    name: '供应链协同平台',
    description: '企业间供应链协同和资源整合',
    category: '软件',
    price: 80000,
    supplier_id: 2,
    status: 'active',
    created_at: '2026-01-03'
  }
]

export const mockTasks = [
  {
    id: 1,
    title: '产品调研报告',
    description: '调研智能仓储系统市场需求',
    reward: 200,
    status: 'open',
    deadline: '2026-01-15',
    created_at: '2026-01-08'
  },
  {
    id: 2,
    title: '用户反馈收集',
    description: '收集物流平台用户反馈意见',
    reward: 150,
    status: 'open',
    deadline: '2026-01-12',
    created_at: '2026-01-07'
  },
  {
    id: 3,
    title: '功能测试任务',
    description: '测试供应链平台核心功能',
    reward: 300,
    status: 'in_progress',
    deadline: '2026-01-20',
    created_at: '2026-01-05'
  }
]

export const mockActivities = [
  {
    id: 1,
    title: '新用户注册奖励',
    description: '完成注册即可获得100积分',
    reward: 100,
    status: 'active',
    start_time: '2026-01-01',
    end_time: '2026-12-31'
  },
  {
    id: 2,
    title: '任务完成挑战',
    description: '本月完成10个任务额外奖励500积分',
    reward: 500,
    status: 'active',
    start_time: '2026-01-01',
    end_time: '2026-01-31'
  }
]

// 模拟API响应延迟
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟登录
export const mockLogin = async (username, password) => {
  await delay()
  if (username === 'test' && password === 'test123') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock_token_123456',
        user: mockUser
      }
    }
  }
  return {
    code: 401,
    message: '用户名或密码错误'
  }
}

// 模拟注册
export const mockRegister = async (userData) => {
  await delay()
  return {
    code: 200,
    message: '注册成功',
    data: {
      user: { ...mockUser, ...userData }
    }
  }
}

// 模拟获取统计数据
export const mockGetStats = async () => {
  await delay()
  return {
    code: 200,
    data: mockStats
  }
}

// 模拟获取产品列表
export const mockGetProducts = async () => {
  await delay()
  return {
    code: 200,
    data: mockProducts
  }
}

// 模拟获取任务列表
export const mockGetTasks = async () => {
  await delay()
  return {
    code: 200,
    data: mockTasks
  }
}

// 模拟获取活动列表
export const mockGetActivities = async () => {
  await delay()
  return {
    code: 200,
    data: mockActivities
  }
}
