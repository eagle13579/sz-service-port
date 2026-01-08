const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * 获取产品列表
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      category_id,
      supplier_id,
      status,
      review_status
    } = req.query;

    const offset = (page - 1) * pageSize;

    const conditions = [];
    const params = [];

    if (category_id) {
      conditions.push('p.category_id = ?');
      params.push(category_id);
    }

    if (supplier_id) {
      conditions.push('p.supplier_id = ?');
      params.push(supplier_id);
    }

    if (status) {
      conditions.push('p.status = ?');
      params.push(status);
    }

    if (review_status) {
      conditions.push('p.review_status = ?');
      params.push(review_status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const products = await query(
      `SELECT 
        p.*,
        s.company_name,
        pc.category_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM products p ${whereClause}`
      : 'SELECT COUNT(*) as total FROM products p';
    const [{ total }] = await query(countQuery, params);

    res.json({
      code: 200,
      data: {
        list: products,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取产品列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取产品列表失败'
    });
  }
});

/**
 * 获取产品详情
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query(
      `SELECT 
        p.*,
        s.company_name,
        s.contact_person,
        s.contact_phone,
        pc.category_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    // 增加浏览量
    await query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [id]);

    // 获取相关任务
    const tasks = await query(
      `SELECT * FROM tasks WHERE supplier_id = ? AND status = 'published' ORDER BY created_at DESC LIMIT 5`,
      [products[0].supplier_id]
    );

    res.json({
      code: 200,
      data: {
        ...products[0],
        related_tasks: tasks
      }
    });
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取产品详情失败'
    });
  }
});

/**
 * 供应商发布产品
 */
router.post('/', authMiddleware, roleMiddleware(['supplier']), async (req, res) => {
  try {
    const {
      product_name,
      product_desc,
      product_images,
      product_video,
      specifications,
      price,
      stock,
      category_id,
      tags
    } = req.body;

    // 获取供应商ID
    const suppliers = await query('SELECT id FROM suppliers WHERE user_id = ?', [req.user.id]);
    if (suppliers.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '供应商信息不存在'
      });
    }

    const supplierId = suppliers[0].id;

    const [result] = await query(
      `INSERT INTO products (
        supplier_id, product_name, product_desc, product_images, product_video,
        specifications, price, stock, category_id, tags, status, review_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'approved')`,
      [
        supplierId, product_name, product_desc, product_images, product_video,
        specifications, price, stock, category_id, JSON.stringify(tags)
      ]
    );

    res.json({
      code: 200,
      message: '产品发布成功',
      data: { productId: result.insertId }
    });
  } catch (error) {
    console.error('发布产品失败:', error);
    res.status(500).json({
      code: 500,
      message: '发布产品失败'
    });
  }
});

module.exports = router;
