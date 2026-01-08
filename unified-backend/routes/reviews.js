const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * 获取评价列表
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      reviewee_id,
      supplier_id,
      rating
    } = req.query;

    const offset = (page - 1) * pageSize;

    const conditions = [];
    const params = [];

    if (reviewee_id) {
      conditions.push('reviewee_id = ?');
      params.push(reviewee_id);
    }

    if (supplier_id) {
      conditions.push('supplier_id = ?');
      params.push(supplier_id);
    }

    if (rating) {
      conditions.push('rating >= ?');
      params.push(rating);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const reviews = await query(
      `SELECT 
        r.*,
        m1.nickname as reviewer_nickname,
        m2.nickname as reviewee_nickname,
        s.company_name as supplier_name,
        t.task_title
      FROM reviews r
      LEFT JOIN members m1 ON r.reviewer_id = m1.id
      LEFT JOIN members m2 ON r.reviewee_id = m2.id
      LEFT JOIN suppliers s ON r.supplier_id = s.id
      LEFT JOIN task_claims tc ON r.task_claim_id = tc.id
      LEFT JOIN tasks t ON tc.task_id = t.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM reviews ${whereClause}`
      : 'SELECT COUNT(*) as total FROM reviews';
    const [{ total }] = await query(countQuery, params);

    res.json({
      code: 200,
      data: {
        list: reviews,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取评价列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取评价列表失败'
    });
  }
});

/**
 * 创建评价
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { task_claim_id, activity_id, reviewee_id, supplier_id, rating, tags, content, is_anonymous } = req.body;

    // 获取评价人会员ID
    const reviewers = await query('SELECT id FROM members WHERE user_id = ?', [req.user.id]);
    if (reviewers.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '会员信息不存在'
      });
    }

    const reviewerId = reviewers[0].id;

    const [result] = await query(
      `INSERT INTO reviews (reviewer_id, reviewee_id, supplier_id, task_claim_id, activity_id, rating, tags, content, is_anonymous)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reviewerId, reviewee_id, supplier_id, task_claim_id, activity_id, rating, tags, content, is_anonymous]
    );

    res.json({
      code: 200,
      message: '评价成功',
      data: { reviewId: result.insertId }
    });
  } catch (error) {
    console.error('创建评价失败:', error);
    res.status(500).json({
      code: 500,
      message: '创建评价失败'
    });
  }
});

module.exports = router;
