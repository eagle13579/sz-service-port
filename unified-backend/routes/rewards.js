const express = require('express');
const router = express.Router();
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * 获取回报记录
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      member_id,
      status,
      reward_type
    } = req.query;

    const offset = (page - 1) * pageSize;

    // 如果不是管理员，只能查看自己的记录
    if (req.user.role !== 'admin') {
      const members = await query('SELECT id FROM members WHERE user_id = ?', [req.user.id]);
      if (members.length === 0) {
        return res.status(404).json({
          code: 404,
          message: '会员信息不存在'
        });
      }
      req.query.member_id = members[0].id;
    }

    const conditions = [];
    const params = [];

    if (member_id) {
      conditions.push('rr.member_id = ?');
      params.push(member_id);
    }

    if (status) {
      conditions.push('rr.status = ?');
      params.push(status);
    }

    if (reward_type) {
      conditions.push('rr.reward_type = ?');
      params.push(reward_type);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const rewards = await query(
      `SELECT 
        rr.*,
        m.nickname as member_nickname,
        tc.task_id,
        t.task_title
      FROM reward_records rr
      LEFT JOIN members m ON rr.member_id = m.id
      LEFT JOIN task_claims tc ON rr.task_claim_id = tc.id
      LEFT JOIN tasks t ON tc.task_id = t.id
      ${whereClause}
      ORDER BY rr.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM reward_records rr ${whereClause}`
      : 'SELECT COUNT(*) as total FROM reward_records rr';
    const [{ total }] = await query(countQuery, params);

    res.json({
      code: 200,
      data: {
        list: rewards,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取回报记录失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取回报记录失败'
    });
  }
});

/**
 * 创建回报记录
 */
router.post('/', authMiddleware, roleMiddleware(['admin', 'supplier']), async (req, res) => {
  try {
    const { member_id, task_claim_id, reward_type, amount, points, description } = req.body;

    const [result] = await query(
      `INSERT INTO reward_records (member_id, task_claim_id, reward_type, amount, points, description, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [member_id, task_claim_id, reward_type, amount, points, description]
    );

    res.json({
      code: 200,
      message: '回报记录创建成功',
      data: { rewardId: result.insertId }
    });
  } catch (error) {
    console.error('创建回报记录失败:', error);
    res.status(500).json({
      code: 500,
      message: '创建回报记录失败'
    });
  }
});

/**
 * 结算回报
 */
router.put('/:id/settle', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await beginTransaction();

    try {
      // 获取回报记录
      const rewards = await connection.execute('SELECT * FROM reward_records WHERE id = ?', [id]);
      if (rewards[0].length === 0) {
        await rollbackTransaction(connection);
        return res.status(404).json({
          code: 404,
          message: '回报记录不存在'
        });
      }

      const reward = rewards[0][0];

      // 检查状态
      if (reward.status !== 'pending') {
        await rollbackTransaction(connection);
        return res.status(400).json({
          code: 400,
          message: '该回报记录已结算'
        });
      }

      // 更新回报状态
      await connection.execute(
        `UPDATE reward_records SET status = 'settled', settled_at = NOW() WHERE id = ?`,
        [id]
      );

      // 更新会员信息（由触发器自动处理）
      // 数据库触发器会自动更新会员的 total_income 和 points

      await commitTransaction(connection);

      res.json({
        code: 200,
        message: '回报结算成功'
      });
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  } catch (error) {
    console.error('结算回报失败:', error);
    res.status(500).json({
      code: 500,
      message: '结算回报失败'
    });
  }
});

module.exports = router;
