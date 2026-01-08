const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 验证JWT token
const auth = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证token'
      });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 查找用户
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在'
      });
    }

    // 检查用户状态
    if (user.status !== 1) {
      return res.status(401).json({
        code: 401,
        message: '账户已被禁用'
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    res.status(401).json({
      code: 401,
      message: 'token无效或已过期'
    });
  }
};

// 验证管理员权限
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: '需要管理员权限'
    });
  }
  next();
};

// 验证供应商权限
const supplierAuth = (req, res, next) => {
  if (req.user.role !== 'supplier' && req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: '需要供应商权限'
    });
  }
  next();
};

module.exports = { auth, adminAuth, supplierAuth };
