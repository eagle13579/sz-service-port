const express = require('express');
const router = express.Router();
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * 获取会员列表
 */
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      member_type,
      min_credit_score,
      min_level
    } = req.query;

    const offset = (page - 1) * pageSize;

    const conditions = [];
    const params = [];

    if (member_type) {
      conditions.push('m.member_type = ?');
      params.push(member_type);
    }

    if (min_credit_score) {
      conditions.push('m.credit_score >= ?');
      params.push(min_credit_score);
    }

    if (min_level) {
      conditions.push('m.level >= ?');
      params.push(min_level);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const members = await query(
      `SELECT 
        m.*,
        u.username,
        u.email,
        u.phone,
        COUNT(DISTINCT ms.id) as skill_count,
        COUNT(DISTINCT tc.id) as task_claim_count,
        COUNT(DISTINCT rr.id) as reward_count,
        SUM(CASE WHEN rr.status = 'settled' AND rr.reward_type = 'cash' THEN rr.amount ELSE 0 END) as total_income
      FROM members m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN member_skills ms ON m.id = ms.member_id
      LEFT JOIN task_claims tc ON m.id = tc.member_id
      LEFT JOIN reward_records rr ON m.id = rr.member_id
      ${whereClause}
      GROUP BY m.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM members m ${whereClause}`
      : 'SELECT COUNT(*) as total FROM members m';
    const [{ total }] = await query(countQuery, params);

    res.json({
      code: 200,
      data: {
        list: members,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取会员列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取会员列表失败'
    });
  }
});

/**
 * 获取会员详情
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const members = await query(
      `SELECT m.*, u.username, u.email, u.phone FROM members m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.id = ?`,
      [id]
    );

    if (members.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '会员不存在'
      });
    }

    // 获取会员技能
    const skills = await query('SELECT * FROM member_skills WHERE member_id = ?', [id]);

    // 获取会员认证
    const certifications = await query(
      'SELECT * FROM member_certifications WHERE member_id = ?',
      [id]
    );

    // 获取会员作品
    const portfolios = await query('SELECT * FROM member_portfolios WHERE member_id = ?', [id]);

    // 获取会员任务认领记录
    const taskClaims = await query(
      `SELECT tc.*, t.task_title, s.company_name as supplier_name
      FROM task_claims tc
      LEFT JOIN tasks t ON tc.task_id = t.id
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      WHERE tc.member_id = ?
      ORDER BY tc.created_at DESC
      LIMIT 10`,
      [id]
    );

    res.json({
      code: 200,
      data: {
        ...members[0],
        skills,
        certifications,
        portfolios,
        taskClaims
      }
    });
  } catch (error) {
    console.error('获取会员详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取会员详情失败'
    });
  }
});

/**
 * 更新会员信息
 */
router.put('/:id', authMiddleware, roleMiddleware(['member', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 检查权限
    if (req.user.role === 'member') {
      const member = await query('SELECT * FROM members WHERE id = ? AND user_id = ?', [id, req.user.id]);
      if (member.length === 0) {
        return res.status(403).json({
          code: 403,
          message: '无权修改该会员信息'
        });
      }
    }

    const allowedFields = [
      'nickname', 'avatar', 'gender', 'age', 'province', 'city',
      'industry', 'bio', 'status'
    ];

    const updateFields = [];
    const params = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        params.push(updateData[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '没有要更新的字段'
      });
    }

    params.push(id);
    await query(`UPDATE members SET ${updateFields.join(', ')} WHERE id = ?`, params);

    res.json({
      code: 200,
      message: '会员信息更新成功'
    });
  } catch (error) {
    console.error('更新会员信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新会员信息失败'
    });
  }
});

/**
 * 添加会员技能
 */
router.post('/:id/skills', authMiddleware, roleMiddleware(['member', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_name, skill_level, certificate_url } = req.body;

    // 检查权限
    if (req.user.role === 'member') {
      const member = await query('SELECT * FROM members WHERE id = ? AND user_id = ?', [id, req.user.id]);
      if (member.length === 0) {
        return res.status(403).json({
          code: 403,
          message: '无权添加技能'
        });
      }
    }

    const [result] = await query(
      'INSERT INTO member_skills (member_id, skill_name, skill_level, certificate_url) VALUES (?, ?, ?, ?)',
      [id, skill_name, skill_level, certificate_url]
    );

    res.json({
      code: 200,
      message: '技能添加成功',
      data: { skillId: result.insertId }
    });
  } catch (error) {
    console.error('添加技能失败:', error);
    res.status(500).json({
      code: 500,
      message: '添加技能失败'
    });
  }
});

module.exports = router;
