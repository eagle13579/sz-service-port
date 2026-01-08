const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 获取当前用户信息
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      message: '获取用户信息成功',
      data: user
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败',
      error: error.message
    });
  }
};

// 更新用户信息
exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const { email, phone } = req.body;
    
    // 验证必填字段
    if (!email && !phone) {
      return res.status(400).json({
        code: 400,
        message: '请至少提供邮箱或手机号'
      });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    const user = await User.update(userId, updateData);
    
    res.json({
      code: 200,
      message: '更新用户信息成功',
      data: user
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新用户信息失败',
      error: error.message
    });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        message: '请提供原密码和新密码'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        code: 400,
        message: '新密码长度不能少于6位'
      });
    }

    // 验证原密码
    const user = await User.findById(userId);
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({
        code: 400,
        message: '原密码错误'
      });
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(userId, { password: hashedPassword });
    
    res.json({
      code: 200,
      message: '修改密码成功'
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      code: 500,
      message: '修改密码失败',
      error: error.message
    });
  }
};
