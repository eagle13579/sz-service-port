const db = require('../config/database');

// 获取数据统计
exports.getStatistics = async (req, res) => {
  try {
    // 供应商统计
    const [supplierStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN verification_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN verification_status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN verification_status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM suppliers
    `);

    // 产品统计
    const [productStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN review_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN review_status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM products
    `);

    // 任务统计
    const [taskStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM tasks
    `);

    // 用户统计
    const [userStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM users
    `);

    // 最近7天数据
    const [weeklyData] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT supplier_id) as new_suppliers,
        COUNT(*) as new_products
      FROM products
      WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // 热门分类
    const [topCategories] = await db.query(`
      SELECT 
        pc.category_name,
        COUNT(p.id) as product_count
      FROM product_categories pc
      LEFT JOIN products p ON pc.id = p.category_id
      GROUP BY pc.id, pc.category_name
      ORDER BY product_count DESC
      LIMIT 10
    `);

    res.json({
      code: 200,
      message: '获取统计数据成功',
      data: {
        suppliers: supplierStats[0],
        products: productStats[0],
        tasks: taskStats[0],
        users: userStats[0],
        weeklyData,
        topCategories
      }
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取统计数据失败',
      error: error.message
    });
  }
};

// 获取待审核列表
exports.getPendingReviews = async (req, res) => {
  try {
    // 待审核供应商
    const [pendingSuppliers] = await db.query(`
      SELECT 
        s.id, s.company_name, s.contact_person, s.contact_phone, 
        s.industry, s.created_at, u.username
      FROM suppliers s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.verification_status = 'pending'
      ORDER BY s.created_at DESC
      LIMIT 10
    `);

    // 待审核产品
    const [pendingProducts] = await db.query(`
      SELECT 
        p.id, p.product_name, p.created_at, s.company_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.review_status = 'pending'
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    res.json({
      code: 200,
      message: '获取待审核列表成功',
      data: {
        suppliers: pendingSuppliers,
        products: pendingProducts
      }
    });
  } catch (error) {
    console.error('获取待审核列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取待审核列表失败',
      error: error.message
    });
  }
};

// 获取用户列表
exports.getUserList = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, role, status, keyword } = req.query;
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let queryParams = [];

    if (role) {
      whereConditions.push('role = ?');
      queryParams.push(role);
    }

    if (status !== undefined) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    if (keyword) {
      whereConditions.push('(username LIKE ? OR email LIKE ? OR phone LIKE ?)');
      queryParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 查询总数
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT id, username, email, phone, role, status, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [users] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取用户列表成功',
      data: {
        list: users,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取用户列表失败',
      error: error.message
    });
  }
};

// 更新用户状态
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (![0, 1, 2].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '无效的状态值'
      });
    }

    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);

    res.json({
      code: 200,
      message: '更新用户状态成功'
    });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新用户状态失败',
      error: error.message
    });
  }
};

// 获取操作日志
exports.getOperationLogs = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, type, userId } = req.query;
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let queryParams = [];

    if (type) {
      whereConditions.push('type = ?');
      queryParams.push(type);
    }

    if (userId) {
      whereConditions.push('user_id = ?');
      queryParams.push(userId);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 查询总数
    const countQuery = `SELECT COUNT(*) as total FROM operation_logs ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT l.*, u.username
      FROM operation_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ${whereClause}
      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [logs] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取操作日志成功',
      data: {
        list: logs,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取操作日志失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取操作日志失败',
      error: error.message
    });
  }
};
