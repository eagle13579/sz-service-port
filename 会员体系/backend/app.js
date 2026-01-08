const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '会员体系服务运行正常' });
});

// 路由
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const taskRoutes = require('./routes/tasks');
const rewardRoutes = require('./routes/rewards');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/reviews', reviewRoutes);

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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`会员体系服务运行在端口 ${PORT}`);
  console.log(`API地址: http://localhost:${PORT}`);
});

// 数据库连接测试
db.getConnection()
  .then(connection => {
    console.log('数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

module.exports = app;
