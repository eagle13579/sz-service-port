const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * 管理员仪表盘数据
 */
router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const stats = await Promise.all([
      query('SELECT COUNT(*) as count FROM users WHERE role = "member"'),
      query('SELECT COUNT(*) as count FROM suppliers WHERE verification_status = "approved"'),
      query('SELECT COUNT(*) as count FROM tasks WHERE status IN ("in_progress", "completed")'),
      query('SELECT COUNT(*) as count FROM activities WHERE status = "published"'),
      query('SELECT COALESCE(SUM(CASE WHEN status = "settled" AND reward_type = "cash" THEN amount ELSE 0 END), 0) as total FROM reward_records'),
      query('SELECT COUNT(*) as count FROM task_claims WHERE status = "pending"'),
      query('SELECT activity_type, COUNT(*) as count FROM activities GROUP BY activity_type'),
      query('SELECT task_type, COUNT(*) as count FROM tasks GROUP BY task_type')
    ]);

    const recentActivities = await query(
      `SELECT * FROM activities 
      ORDER BY created_at DESC 
      LIMIT 5`
    );

    const recentTasks = await query(
      `SELECT t.*, s.company_name FROM tasks t
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      ORDER BY t.created_at DESC
      LIMIT 10`
    );

    res.json({
      code: 200,
      data: {
        overview: {
          memberCount: stats[0][0].count,
          supplierCount: stats[1][0].count,
          activeTaskCount: stats[2][0].count,
          activityCount: stats[3][0].count,
          totalTransaction: stats[4][0].total,
          pendingClaims: stats[5][0].count
        },
        activityTypeStats: stats[6],
        taskTypeStats: stats[7],
        recentActivities,
        recentTasks
      }
    });
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取仪表盘数据失败'
    });
  }
});

/**
 * 审核供应商
 */
router.put('/suppliers/:id/verify', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status, verification_remark } = req.body;

    if (!['approved', 'rejected'].includes(verification_status)) {
      return res.status(400).json({
        code: 400,
        message: '审核状态错误'
      });
    }

    await query(
      `UPDATE suppliers 
      SET verification_status = ?, verification_time = NOW(), verification_remark = ?
      WHERE id = ?`,
      [verification_status, verification_remark, id]
    );

    res.json({
      code: 200,
      message: `供应商审核${verification_status === 'approved' ? '通过' : '拒绝'}`
    });
  } catch (error) {
    console.error('审核供应商失败:', error);
    res.status(500).json({
      code: 500,
      message: '审核供应商失败'
    });
  }
});

/**
 * 管理产品审核
 */
router.put('/products/:id/review', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { review_status, review_remark } = req.body;

    if (!['approved', 'rejected'].includes(review_status)) {
      return res.status(400).json({
        code: 400,
        message: '审核状态错误'
      });
    }

    await query(
      `UPDATE products 
      SET review_status = ?, review_time = NOW(), review_remark = ?
      WHERE id = ?`,
      [review_status, review_remark, id]
    );

    res.json({
      code: 200,
      message: `产品审核${review_status === 'approved' ? '通过' : '拒绝'}`
    });
  } catch (error) {
    console.error('审核产品失败:', error);
    res.status(500).json({
      code: 500,
      message: '审核产品失败'
    });
  }
});

module.exports = router;
