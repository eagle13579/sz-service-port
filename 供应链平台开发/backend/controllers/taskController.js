const Task = require('../models/Task');
const db = require('../config/database');

// 发布任务
exports.createTask = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 检查用户是否有供应商资格
    const supplier = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ? AND verification_status = ?',
      [userId, 'approved']
    );

    if (!supplier || supplier.length === 0) {
      return res.status(403).json({
        code: 403,
        message: '您不是认证供应商，无法发布任务'
      });
    }

    const supplierId = supplier[0].id;
    
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

    // 验证必填字段
    if (!task_title || !task_desc || !task_type) {
      return res.status(400).json({
        code: 400,
        message: '任务标题、描述和类型为必填项'
      });
    }

    const taskData = {
      supplier_id: supplierId,
      task_title,
      task_desc,
      task_type,
      budget,
      currency: currency || 'CNY',
      deadline,
      location_type: location_type || 'online',
      location,
      skill_requirements,
      qualification_requirements,
      workload_estimate,
      delivery_standards,
      status: 'published'
    };

    const taskId = await Task.create(taskData);

    res.json({
      code: 200,
      message: '任务发布成功',
      data: { taskId }
    });
  } catch (error) {
    console.error('发布任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '发布任务失败',
      error: error.message
    });
  }
};

// 获取任务列表
exports.getTaskList = async (req, res) => {
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
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks t
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT t.*, s.company_name
      FROM tasks t
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [tasks] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

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

// 获取我的任务列表
exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 20, status } = req.query;
    const offset = (page - 1) * pageSize;

    // 获取供应商ID
    const supplier = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    if (!supplier || supplier.length === 0) {
      return res.json({
        code: 200,
        message: '获取我的任务列表成功',
        data: {
          list: [],
          total: 0,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
    }

    const supplierId = supplier[0].id;

    let whereConditions = ['t.supplier_id = ?'];
    let queryParams = [supplierId];

    if (status) {
      whereConditions.push('t.status = ?');
      queryParams.push(status);
    }

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks t
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT t.*
      FROM tasks t
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [tasks] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取我的任务列表成功',
      data: {
        list: tasks,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取我的任务列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取我的任务列表失败',
      error: error.message
    });
  }
};

// 获取任务详情
exports.getTaskDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 增加浏览量
    await Task.update(id, { view_count: (task.view_count || 0) + 1 });

    // 获取供应商信息
    const [supplier] = await db.query(
      'SELECT id, company_name, company_logo, contact_person, contact_phone FROM suppliers WHERE id = ?',
      [task.supplier_id]
    );

    res.json({
      code: 200,
      message: '获取任务详情成功',
      data: {
        ...task,
        supplier
      }
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

// 更新任务
exports.updateTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 验证权限
    const [supplier] = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    if (!supplier || supplier.id !== task.supplier_id) {
      return res.status(403).json({
        code: 403,
        message: '无权修改此任务'
      });
    }

    // 已认领的任务无法修改
    if (task.status === 'in_progress' || task.status === 'completed') {
      return res.status(400).json({
        code: 400,
        message: '已认领或已完成的任务无法修改'
      });
    }

    const updateData = {};
    const allowedFields = [
      'task_title', 'task_desc', 'task_type', 'budget', 'currency',
      'deadline', 'location_type', 'location', 'skill_requirements',
      'qualification_requirements', 'workload_estimate', 'delivery_standards'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Task.update(id, updateData);

    res.json({
      code: 200,
      message: '更新任务成功'
    });
  } catch (error) {
    console.error('更新任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新任务失败',
      error: error.message
    });
  }
};

// 删除任务
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 验证权限
    const [supplier] = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    if (!supplier || supplier.id !== task.supplier_id) {
      return res.status(403).json({
        code: 403,
        message: '无权删除此任务'
      });
    }

    // 已认领的任务无法删除
    if (task.claimed_by) {
      return res.status(400).json({
        code: 400,
        message: '已认领的任务无法删除'
      });
    }

    await Task.delete(id);

    res.json({
      code: 200,
      message: '删除任务成功'
    });
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除任务失败',
      error: error.message
    });
  }
};

// 取消任务
exports.cancelTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 验证权限
    const [supplier] = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    if (!supplier || supplier.id !== task.supplier_id) {
      return res.status(403).json({
        code: 403,
        message: '无权取消此任务'
      });
    }

    // 已完成的任务无法取消
    if (task.status === 'completed') {
      return res.status(400).json({
        code: 400,
        message: '已完成的任务无法取消'
      });
    }

    await Task.update(id, { status: 'cancelled' });

    res.json({
      code: 200,
      message: '取消任务成功'
    });
  } catch (error) {
    console.error('取消任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '取消任务失败',
      error: error.message
    });
  }
};

// 认领任务
exports.claimTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 检查任务状态
    if (task.status !== 'published') {
      return res.status(400).json({
        code: 400,
        message: '该任务已被认领或已取消'
      });
    }

    // 检查用户是否已经认领过该任务
    if (task.claimed_by === userId) {
      return res.status(400).json({
        code: 400,
        message: '您已经认领过该任务'
      });
    }

    await Task.update(id, {
      claimed_by: userId,
      claimed_time: new Date(),
      status: 'in_progress'
    });

    res.json({
      code: 200,
      message: '认领任务成功'
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

// 完成任务
exports.completeTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 验证权限
    const [supplier] = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    // 只有发布者可以标记任务完成
    if (!supplier || supplier.id !== task.supplier_id) {
      return res.status(403).json({
        code: 403,
        message: '只有任务发布者可以标记任务完成'
      });
    }

    // 检查任务状态
    if (task.status !== 'in_progress') {
      return res.status(400).json({
        code: 400,
        message: '只有进行中的任务可以标记为完成'
      });
    }

    await Task.update(id, {
      status: 'completed',
      completed_time: new Date()
    });

    res.json({
      code: 200,
      message: '任务已标记为完成'
    });
  } catch (error) {
    console.error('完成任务失败:', error);
    res.status(500).json({
      code: 500,
      message: '完成任务失败',
      error: error.message
    });
  }
};

// 获取我认领的任务
exports.getClaimedTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 20, status } = req.query;
    const offset = (page - 1) * pageSize;

    let whereConditions = ['t.claimed_by = ?'];
    let queryParams = [userId];

    if (status) {
      whereConditions.push('t.status = ?');
      queryParams.push(status);
    }

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks t
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT t.*, s.company_name
      FROM tasks t
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      ${whereClause}
      ORDER BY t.claimed_time DESC
      LIMIT ? OFFSET ?
    `;
    const [tasks] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取认领任务列表成功',
      data: {
        list: tasks,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取认领任务列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取认领任务列表失败',
      error: error.message
    });
  }
};
