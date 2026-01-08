const express = require('express');
const router = express.Router();
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/auth');
const { generateToken, verifyToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * 用户注册
 */
router.post('/register', [
  body('username').isLength({ min: 3, max: 50 }).withMessage('用户名长度3-50字符'),
  body('email').isEmail().withMessage('邮箱格式错误'),
  body('phone').isMobilePhone('zh-CN').withMessage('手机号格式错误'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位'),
  body('role').isIn(['admin', 'supplier', 'member']).withMessage('角色错误')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors: errors.array()
    });
  }

  const { username, email, phone, password, role } = req.body;

  try {
    // 检查用户名是否已存在
    const existingUser = await query(
      'SELECT id FROM users WHERE username = ? OR email = ? OR phone = ?',
      [username, email, phone]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        code: 409,
        message: '用户名、邮箱或手机号已存在'
      });
    }

    // 哈希密码
    const passwordHash = await hashPassword(password);

    // 开始事务
    const connection = await beginTransaction();

    try {
      // 插入用户
      const [result] = await connection.execute(
        'INSERT INTO users (username, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, ?, 1)',
        [username, email, phone, passwordHash, role]
      );

      const userId = result.insertId;

      // 根据角色创建对应记录
      if (role === 'supplier') {
        await connection.execute(
          'INSERT INTO suppliers (user_id, company_name, contact_person, contact_phone, verification_status) VALUES (?, ?, ?, ?, ?)',
          [userId, username, username, phone, 'pending']
        );
      } else if (role === 'member') {
        await connection.execute(
          'INSERT INTO members (user_id, nickname, member_type, credit_score, level, points) VALUES (?, ?, ?, 100, 1, 0)',
          [userId, username, 'normal']
        );
      }

      await commitTransaction(connection);

      // 生成token
      const token = generateToken({
        id: userId,
        username,
        email,
        phone,
        role,
        status: 1
      });

      res.json({
        code: 200,
        message: '注册成功',
        data: {
          userId,
          username,
          email,
          phone,
          role,
          token
        }
      });
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      code: 500,
      message: '注册失败'
    });
  }
});

/**
 * 用户登录
 */
router.post('/login', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors: errors.array()
    });
  }

  const { username, password } = req.body;

  try {
    // 查询用户
    const users = await query(
      'SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?',
      [username, username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 验证密码
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    // 检查用户状态
    if (user.status !== 1) {
      return res.status(403).json({
        code: 403,
        message: '账号已被禁用'
      });
    }

    // 更新最后登录时间
    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    // 生成token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      code: 500,
      message: '登录失败'
    });
  }
});

/**
 * 获取当前用户信息
 */
router.get('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const user = await query(
      'SELECT id, username, email, phone, role, status, last_login_at, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    // 根据角色获取额外信息
    let extraInfo = {};
    if (req.user.role === 'supplier') {
      const suppliers = await query('SELECT * FROM suppliers WHERE user_id = ?', [req.user.id]);
      if (suppliers.length > 0) {
        extraInfo = { supplier: suppliers[0] };
      }
    } else if (req.user.role === 'member') {
      const members = await query('SELECT * FROM members WHERE user_id = ?', [req.user.id]);
      if (members.length > 0) {
        extraInfo = { member: members[0] };
      }
    }

    res.json({
      code: 200,
      data: {
        ...user[0],
        ...extraInfo
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败'
    });
  }
});

module.exports = router;
