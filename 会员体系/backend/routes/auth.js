const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// 会员注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名、邮箱、手机号和密码不能为空'
      });
    }

    // 检查用户名是否已存在
    const [existingUser] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在'
      });
    }

    // 检查邮箱是否已存在
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail) {
      return res.status(400).json({
        code: 400,
        message: '邮箱已被注册'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const [result] = await db.query(`
      INSERT INTO users (username, email, phone, password, role, status)
      VALUES (?, ?, ?, ?, ?, 1)
    `, [username, email, phone, hashedPassword, role || 'member']);

    const token = jwt.sign(
      { id: result.insertId, username, role: role || 'member' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      code: 200,
      message: '注册成功',
      data: {
        token,
        user: {
          id: result.insertId,
          username,
          email,
          role: role || 'member'
        }
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      code: 500,
      message: '注册失败',
      error: error.message
    });
  }
});

// 会员登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空'
      });
    }

    // 查找用户
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

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

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
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
});

module.exports = router;
