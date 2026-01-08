const express = require('express');
const cors = require('cors');
const path = require('path');
const { query } = require('./config/database');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 健康检查
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await query('SELECT 1 as test');
    res.json({ 
      status: 'ok', 
      message: '数智服务港统一后端服务运行正常',
      database: dbStatus.length > 0 ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: '服务异常',
      error: error.message 
    });
  }
});

// 统计信息
app.get('/api/stats/overview', async (req, res) => {
  try {
    const [userCount, supplierCount, memberCount, taskCount, productCount, activityCount] = await Promise.all([
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM suppliers'),
      query('SELECT COUNT(*) as count FROM members'),
      query('SELECT COUNT(*) as count FROM tasks'),
      query('SELECT COUNT(*) as count FROM products'),
      query('SELECT COUNT(*) as count FROM activities')
    ]);

    res.json({
      code: 200,
      data: {
        users: userCount[0].count,
        suppliers: supplierCount[0].count,
        members: memberCount[0].count,
        tasks: taskCount[0].count,
        products: productCount[0].count,
        activities: activityCount[0].count
      }
    });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取统计信息失败'
    });
  }
});

// 路由
const authRoutes = require('./routes/auth');
const supplierRoutes = require('./routes/suppliers');
const memberRoutes = require('./routes/members');
const productRoutes = require('./routes/products');
const taskRoutes = require('./routes/tasks');
const activityRoutes = require('./routes/activities');
const rewardRoutes = require('./routes/rewards');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '请求的资源不存在'
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 启动服务器
const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  console.log('=================================');
  console.log('数智服务港统一后端服务启动成功');
  console.log('=================================');
  console.log(`服务端口: ${PORT}`);
  console.log(`API地址: http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log('=================================');
  
  // 测试数据库连接
  try {
    const result = await query('SELECT 1 as test');
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
});

module.exports = app;
