const express = require('express');
const router = express.Router();
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * 获取任务列表（支持筛选和搜索）
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      status,
      task_type,
      supplier_id,
      claimed_member_id
    } = req.query;

    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('t.status = ?');
      params.push(status);
    }

    if (task_type) {
      conditions.push('t.task_type = ?');
      params.push(task_type);
    }

    if (supplier_id) {
      conditions.push('t.supplier_id = ?');
      params.push(supplier_id);
    }

    if (claimed_member_id) {
      conditions.push('t.claimed_member_id = ?');
      params.push(claimed_member_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 获取任务列表（关联供应商和会员信息）
    const tasks = await query(
      `SELECT 
        t.*,
        s.company_name,
        s.contact_person,
        m.nickname as claimed_member_nickname,
        m.credit_score as claimed_member_credit_score
      FROM tasks t
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      LEFT JOIN members m ON t.claimed_member_id = m.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    // 获取总数
    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM tasks t ${whereClause}`
      : 'SELECT COUNT(*) as total FROM tasks t';
    const [{ total }] = await query(countQuery, params);

    res.json({
      code: 200,
      data: {
        list: tasks,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取任务列表失败'
    });
  }
});

/**
 * 获取任务详情
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = await query(
      `SELECT 
        t.*,
        s.company_name,
        s.contact_person,
        s.contact_phone,
        s.contact_email,
        m.nickname as claimed_member_nickname,
        m.credit_score as claimed_member_credit_score
      FROM tasks t
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      LEFT JOIN members m ON t.claimed_member_id = m.id
      WHERE t.id = ?`,
      [id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 增加浏览量
    await query('UPDATE tasks SET view_count = view_count + 1 WHERE id = ?', [id]);

    res.json({
      code: 200,
      data: tasks[0]
    });
  } catch (error) {
    console.error('获取任务详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取任务详情失败'
    });
  }
});

/**
 * 供应商发布任务
 */
router.post('/', authMiddleware, roleMiddleware(['supplier', 'admin']), async (req, res) => {
  try {
    const {
      task_title,
      task_desc,
      task_type,
      budget,
      currency,
      deadline,
      location_type,
      location,
      skill_requirements,
      qualification_requirements,
      workload_estimate,
      delivery_standards
    } = req.body;

    // 获取供应商ID
    let supplierId;
    if (req.user.role === 'supplier') {
      const suppliers = await query('SELECT id FROM suppliers WHERE user_id = ?', [req.user.id]);
      if (suppliers.length === 0) {
        return res.status(404).json({
          code: 404,
          message: '供应商信息不存在'
        });
      }
      supplierId = suppliers[0].id;
    } else {
      supplierId = req.body.supplier_id;
    }

    const [result] = await query(
      `INSERT INTO tasks (
        supplier_id, task_title, task_desc, task_type, budget, currency,
        deadline, location_type, location, skill_requirements,
        qualification_requirements, workload_estimate, delivery_standards, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [
        supplierId, task_title, task_desc, task_type, budget, currency,
        deadline, location_type, location, skill_requirements,
        qualification_requirements, workload_estimate, delivery_standards
      ]
    );

    res.json({
      code: 200,
      message: '任务发布成功',
      data: { taskId: result.insertId }
    });
  } catch (error) {
    console.error('发布任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '发布任务失败'
    });
  }
});

/**
 * 会员认领任务（关键：打通供应链和会员体系）
 */
router.post('/:id/claim', authMiddleware, roleMiddleware(['member']), async (req, res) => {
  const { id } = req.params;
  const { claim_reason, quote, estimated_time } = req.body;

  const connection = await beginTransaction();

  try {
    // 获取任务信息
    const tasks = await connection.execute(
      'SELECT * FROM tasks WHERE id = ? FOR UPDATE',
      [id]
    );

    if (tasks[0].length === 0) {
      await rollbackTransaction(connection);
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    const task = tasks[0][0];

    // 检查任务状态
    if (task.status !== 'published') {
      await rollbackTransaction(connection);
      return res.status(400).json({
        code: 400,
        message: '任务当前状态不允许认领'
      });
    }

    // 获取会员ID
    const members = await connection.execute(
      'SELECT id FROM members WHERE user_id = ?',
      [req.user.id]
    );

    if (members[0].length === 0) {
      await rollbackTransaction(connection);
      return res.status(404).json({
        code: 404,
        message: '会员信息不存在'
      });
    }

    const memberId = members[0][0].id;

    // 检查是否已经认领
    const existingClaims = await connection.execute(
      'SELECT id FROM task_claims WHERE task_id = ? AND member_id = ?',
      [id, memberId]
    );

    if (existingClaims[0].length > 0) {
      await rollbackTransaction(connection);
      return res.status(400).json({
        code: 400,
        message: '您已经认领过该任务'
      });
    }

    // 创建任务认领记录
    const [claimResult] = await connection.execute(
      `INSERT INTO task_claims (task_id, member_id, claim_reason, quote, estimated_time, status)
      VALUES (?, ?, ?, ?, ?, 'pending')`,
      [id, memberId, claim_reason, quote, estimated_time]
    );

    // 更新任务状态
    await connection.execute(
      `UPDATE tasks SET claimed_member_id = ?, claimed_time = NOW(), status = 'claimed' WHERE id = ?`,
      [memberId, id]
    );

    await commitTransaction(connection);

    res.json({
      code: 200,
      message: '任务认领申请已提交，等待供应商审核',
      data: {
        claimId: claimResult.insertId,
        taskId: id
      }
    });
  } catch (error) {
    await rollbackTransaction(connection);
    console.error('认领任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '认领任务失败'
    });
  }
});

/**
 * 供应商审核任务认领
 */
router.post('/:taskId/claims/:claimId/approve', authMiddleware, roleMiddleware(['supplier', 'admin']), async (req, res) => {
  const { taskId, claimId } = req.params;
  const { status, remark } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      code: 400,
      message: '状态错误'
    });
  }

  const connection = await beginTransaction();

  try {
    // 获取任务认领信息
    const claims = await connection.execute(
      'SELECT * FROM task_claims WHERE id = ? AND task_id = ?',
      [claimId, taskId]
    );

    if (claims[0].length === 0) {
      await rollbackTransaction(connection);
      return res.status(404).json({
        code: 404,
        message: '任务认领记录不存在'
      });
    }

    const claim = claims[0][0];

    // 更新认领状态
    await connection.execute(
      `UPDATE task_claims SET status = ?, approved_at = NOW() WHERE id = ?`,
      [status, claimId]
    );

    // 更新任务状态
    if (status === 'approved') {
      await connection.execute(
        `UPDATE tasks SET status = 'in_progress' WHERE id = ?`,
        [taskId]
      );
    } else {
      await connection.execute(
        `UPDATE tasks SET claimed_member_id = NULL, claimed_time = NULL, status = 'published' WHERE id = ?`,
        [taskId]
      );
    }

    await commitTransaction(connection);

    res.json({
      code: 200,
      message: `任务认领已${status === 'approved' ? '通过' : '拒绝'}`,
      data: { claimId, status }
    });
  } catch (error) {
    await rollbackTransaction(connection);
    console.error('审核任务认领失败:', error);
    res.status(500).json({
      code: 500,
      message: '审核任务认领失败'
    });
  }
});

/**
 * 更新任务进度
 */
router.put('/:id/progress', authMiddleware, roleMiddleware(['supplier', 'member']), async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, delivery_url } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        code: 400,
        message: '进度值必须在0-100之间'
      });
    }

    const updateData = {
      progress,
      status: progress >= 100 ? 'completed' : 'in_progress',
      updated_at: 'NOW()'
    };

    const updateFields = [];
    const params = [];

    if (delivery_url !== undefined) {
      updateData.delivery_url = delivery_url;
      updateFields.push('delivery_url = ?');
      params.push(delivery_url);
    }

    updateFields.push('progress = ?');
    params.push(progress);
    updateFields.push('status = ?');
    params.push(updateData.status);

    if (progress === 100) {
      updateFields.push('completed_time = NOW()');
    }

    await query(
      `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
      [...params, id]
    );

    res.json({
      code: 200,
      message: '任务进度更新成功',
      data: { progress: updateData.progress, status: updateData.status }
    });
  } catch (error) {
    console.error('更新任务进度失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新任务进度失败'
    });
  }
});

/**
 * 取消任务
 */
router.put('/:id/cancel', authMiddleware, roleMiddleware(['supplier', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    await query(
      `UPDATE tasks SET status = 'cancelled' WHERE id = ?`,
      [id]
    );

    res.json({
      code: 200,
      message: '任务已取消'
    });
  } catch (error) {
    console.error('取消任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '取消任务失败'
    });
  }
});

module.exports = router;
