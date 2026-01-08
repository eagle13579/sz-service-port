const TaskClaim = require('../models/TaskClaim');
const Member = require('../models/Member');
const RewardRecord = require('../models/RewardRecord');
const db = require('../config/database');

// 浏览任务列表
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, task_type, status, keyword } = req.query;
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let queryParams = [];

    if (task_type) {
      whereConditions.push('t.task_type = ?');
      queryParams.push(task_type);
    }

    if (status) {
      whereConditions.push('t.status = ?');
      queryParams.push(status);
    }

    if (keyword) {
      whereConditions.push('t.task_title LIKE ?');
      queryParams.push(`%${keyword}%`);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM tasks t ${whereClause}`;
    const [countResult] = await db.query(countSql, queryParams);
    const total = countResult.total;

    // 查询列表
    const listSql = `
      SELECT t.*, s.company_name
      FROM tasks t
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [tasks] = await db.query(listSql, [...queryParams, pageSize, offset]);

    res.json({
      code: 200,
      message: '获取任务列表成功',
      data: {
        list: tasks,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取任务列表失败',
      error: error.message
    });
  }
};

// 获取任务详情
exports.getTaskDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [tasks] = await db.query(`
      SELECT t.*, s.company_name, s.contact_person, s.contact_phone
      FROM tasks t
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      WHERE t.id = ?
    `, [id]);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    res.json({
      code: 200,
      message: '获取任务详情成功',
      data: tasks[0]
    });
  } catch (error) {
    console.error('获取任务详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取任务详情失败',
      error: error.message
    });
  }
};

// 认领任务
exports.claimTask = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在，请先创建会员档案'
      });
    }

    const { taskId, claim_reason, quote, estimated_time } = req.body;

    if (!taskId || !claim_reason) {
      return res.status(400).json({
        code: 400,
        message: '任务ID和认领理由不能为空'
      });
    }

    // 检查任务状态
    const [tasks] = await db.query('SELECT status FROM tasks WHERE id = ?', [taskId]);
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    if (tasks[0].status !== 'published') {
      return res.status(400).json({
        code: 400,
        message: '该任务无法认领'
      });
    }

    // 检查是否已经认领过
    const [existingClaims] = await db.query(
      'SELECT id FROM task_claims WHERE task_id = ? AND member_id = ?',
      [taskId, member.id]
    );
    if (existingClaims && existingClaims.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '您已经认领过该任务'
      });
    }

    // 创建认领记录
    const claimId = await TaskClaim.create({
      task_id: taskId,
      member_id: member.id,
      claim_reason,
      quote,
      estimated_time
    });

    res.json({
      code: 200,
      message: '任务认领申请提交成功，等待供应商审核',
      data: { claimId }
    });
  } catch (error) {
    console.error('认领任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '认领任务失败',
      error: error.message
    });
  }
};

// 更新任务进度
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { progress, delivery_url } = req.body;

    if (!progress && progress !== 0) {
      return res.status(400).json({
        code: 400,
        message: '进度不能为空'
      });
    }

    const claim = await TaskClaim.findById(id);
    if (!claim) {
      return res.status(404).json({
        code: 404,
        message: '认领记录不存在'
      });
    }

    const member = await Member.findByUserId(userId);
    if (member.id !== claim.member_id) {
      return res.status(403).json({
        code: 403,
        message: '无权更新此任务进度'
      });
    }

    await TaskClaim.updateProgress(id, progress, delivery_url);

    res.json({
      code: 200,
      message: '任务进度更新成功'
    });
  } catch (error) {
    console.error('更新任务进度失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新任务进度失败',
      error: error.message
    });
  }
};

// 提交交付物
exports.submitDelivery = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { delivery_url, description } = req.body;

    if (!delivery_url) {
      return res.status(400).json({
        code: 400,
        message: '交付物链接不能为空'
      });
    }

    const claim = await TaskClaim.findById(id);
    if (!claim) {
      return res.status(404).json({
        code: 404,
        message: '认领记录不存在'
      });
    }

    const member = await Member.findByUserId(userId);
    if (member.id !== claim.member_id) {
      return res.status(403).json({
        code: 403,
        message: '无权提交此任务的交付物'
      });
    }

    // 更新任务进度为100%
    await TaskClaim.updateProgress(id, 100, delivery_url);

    // 更新认领状态为待验收
    await TaskClaim.updateStatus(id, 'pending_review');

    res.json({
      code: 200,
      message: '交付物提交成功'
    });
  } catch (error) {
    console.error('提交交付物失败:', error);
    res.status(500).json({
      code: 500,
      message: '提交交付物失败',
      error: error.message
    });
  }
};
