const express = require('express');
const router = express.Router();
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * 获取供应商列表
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      verification_status,
      supplier_level,
      industry
    } = req.query;

    const offset = (page - 1) * pageSize;

    const conditions = [];
    const params = [];

    if (verification_status) {
      conditions.push('s.verification_status = ?');
      params.push(verification_status);
    }

    if (supplier_level) {
      conditions.push('s.supplier_level = ?');
      params.push(supplier_level);
    }

    if (industry) {
      conditions.push('s.industry = ?');
      params.push(industry);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const suppliers = await query(
      `SELECT 
        s.*,
        u.username,
        u.email,
        u.phone,
        COUNT(DISTINCT p.id) as product_count,
        COUNT(DISTINCT t.id) as task_count
      FROM suppliers s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN products p ON s.id = p.supplier_id
      LEFT JOIN tasks t ON s.id = t.supplier_id
      ${whereClause}
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM suppliers s ${whereClause}`
      : 'SELECT COUNT(*) as total FROM suppliers s';
    const [{ total }] = await query(countQuery, params);

    res.json({
      code: 200,
      data: {
        list: suppliers,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取供应商列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取供应商列表失败'
    });
  }
});

/**
 * 获取供应商详情
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const suppliers = await query(
      `SELECT s.*, u.username, u.email, u.phone FROM suppliers s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = ?`,
      [id]
    );

    if (suppliers.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '供应商不存在'
      });
    }

    // 获取供应商的产品
    const products = await query(
      'SELECT * FROM products WHERE supplier_id = ? AND status = "published"',
      [id]
    );

    // 获取供应商的任务
    const tasks = await query(
      'SELECT * FROM tasks WHERE supplier_id = ? ORDER BY created_at DESC LIMIT 10',
      [id]
    );

    res.json({
      code: 200,
      data: {
        ...suppliers[0],
        products,
        tasks
      }
    });
  } catch (error) {
    console.error('获取供应商详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取供应商详情失败'
    });
  }
});

/**
 * 更新供应商信息
 */
router.put('/:id', authMiddleware, roleMiddleware(['supplier', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 检查权限
    if (req.user.role === 'supplier') {
      const supplier = await query('SELECT * FROM suppliers WHERE id = ? AND user_id = ?', [id, req.user.id]);
      if (supplier.length === 0) {
        return res.status(403).json({
          code: 403,
          message: '无权修改该供应商信息'
        });
      }
    }

    const allowedFields = [
      'company_name', 'company_logo', 'business_license', 'company_intro',
      'contact_person', 'contact_phone', 'contact_email', 'address',
      'province', 'city', 'industry', 'main_products', 'production_capacity',
      'brand_story', 'qualification_certificates'
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
    await query(`UPDATE suppliers SET ${updateFields.join(', ')} WHERE id = ?`, params);

    res.json({
      code: 200,
      message: '供应商信息更新成功'
    });
  } catch (error) {
    console.error('更新供应商信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新供应商信息失败'
    });
  }
});

module.exports = router;
