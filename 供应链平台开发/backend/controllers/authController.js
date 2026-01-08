const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  // 注册
  static async register(req, res) {
    try {
      const { username, email, phone, password, role } = req.body;

      // 验证必填字段
      if (!username || !email || !phone || !password) {
        return res.status(400).json({
          code: 400,
          message: '用户名、邮箱、手机号和密码不能为空'
        });
      }

      // 检查用户名是否已存在
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          code: 400,
          message: '用户名已存在'
        });
      }

      // 检查邮箱是否已存在
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          code: 400,
          message: '邮箱已被注册'
        });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const userId = await User.create({
        username,
        email,
        phone,
        password: hashedPassword,
        role: role || 'supplier'
      });

      res.status(200).json({
        code: 200,
        message: '注册成功',
        data: { userId }
      });
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).json({
        code: 500,
        message: '注册失败',
        error: error.message
      });
    }
  }

  // 登录
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // 验证必填字段
      if (!username || !password) {
        return res.status(400).json({
          code: 400,
          message: '用户名和密码不能为空'
        });
      }

      // 查找用户
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          code: 401,
          message: '用户名或密码错误'
        });
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          code: 401,
          message: '用户名或密码错误'
        });
      }

      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({
        code: 500,
        message: '登录失败',
        error: error.message
      });
    }
  }

  // 获取当前用户信息
  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      res.status(200).json({
        code: 200,
        data: user
      });
    } catch (error) {
      console.error('获取用户信息错误:', error);
      res.status(500).json({
        code: 500,
        message: '获取用户信息失败',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
