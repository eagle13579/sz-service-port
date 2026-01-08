const Product = require('../models/Product');
const db = require('../config/database');

// 发布产品
exports.createProduct = async (req, res) => {
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
        message: '您不是认证供应商，无法发布产品'
      });
    }

    const supplierId = supplier[0].id;
    
    const {
      product_name,
      product_desc,
      specifications,
      price,
      stock,
      category_id,
      tags
    } = req.body;

    // 验证必填字段
    if (!product_name) {
      return res.status(400).json({
        code: 400,
        message: '产品名称为必填项'
      });
    }

    const productData = {
      supplier_id: supplierId,
      product_name,
      product_desc,
      specifications,
      price,
      stock,
      category_id,
      tags,
      status: 'draft',
      review_status: 'pending'
    };

    // 如果有文件上传，保存文件信息
    if (req.files && req.files.images) {
      const images = req.files.images.map(file => ({
        url: `/uploads/products/${file.filename}`,
        name: file.originalname
      }));
      productData.product_images = JSON.stringify(images);
    }

    const productId = await Product.create(productData);

    res.json({
      code: 200,
      message: '产品发布成功，等待审核',
      data: { productId }
    });
  } catch (error) {
    console.error('发布产品失败:', error);
    res.status(500).json({
      code: 500,
      message: '发布产品失败',
      error: error.message
    });
  }
};

// 获取产品列表
exports.getProductList = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, category_id, keyword, status, review_status } = req.query;
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let queryParams = [];

    if (category_id) {
      whereConditions.push('p.category_id = ?');
      queryParams.push(category_id);
    }

    if (keyword) {
      whereConditions.push('p.product_name LIKE ?');
      queryParams.push(`%${keyword}%`);
    }

    if (status) {
      whereConditions.push('p.status = ?');
      queryParams.push(status);
    }

    if (review_status) {
      whereConditions.push('p.review_status = ?');
      queryParams.push(review_status);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT p.*, s.company_name, c.category_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [products] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取产品列表成功',
      data: {
        list: products,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取产品列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取产品列表失败',
      error: error.message
    });
  }
};

// 获取我的产品列表
exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 20, status, review_status } = req.query;
    const offset = (page - 1) * pageSize;

    // 获取供应商ID
    const supplier = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    if (!supplier || supplier.length === 0) {
      return res.json({
        code: 200,
        message: '获取我的产品列表成功',
        data: {
          list: [],
          total: 0,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
    }

    const supplierId = supplier[0].id;

    let whereConditions = ['p.supplier_id = ?'];
    let queryParams = [supplierId];

    if (status) {
      whereConditions.push('p.status = ?');
      queryParams.push(status);
    }

    if (review_status) {
      whereConditions.push('p.review_status = ?');
      queryParams.push(review_status);
    }

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT p.*, c.category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [products] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取我的产品列表成功',
      data: {
        list: products,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取我的产品列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取我的产品列表失败',
      error: error.message
    });
  }
};

// 获取产品详情
exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    // 增加浏览量
    await Product.update(id, { view_count: (product.view_count || 0) + 1 });

    // 获取供应商信息
    const [supplier] = await db.query(
      'SELECT id, company_name, company_logo, contact_person, contact_phone FROM suppliers WHERE id = ?',
      [product.supplier_id]
    );

    res.json({
      code: 200,
      message: '获取产品详情成功',
      data: {
        ...product,
        supplier
      }
    });
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取产品详情失败',
      error: error.message
    });
  }
};

// 更新产品
exports.updateProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    // 验证权限
    const [supplier] = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    if (!supplier || supplier.id !== product.supplier_id) {
      return res.status(403).json({
        code: 403,
        message: '无权修改此产品'
      });
    }

    const updateData = {};
    const allowedFields = [
      'product_name', 'product_desc', 'specifications', 'price',
      'stock', 'category_id', 'tags'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // 更新状态为待审核
    updateData.review_status = 'pending';

    await Product.update(id, updateData);

    res.json({
      code: 200,
      message: '更新产品成功，等待审核'
    });
  } catch (error) {
    console.error('更新产品失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新产品失败',
      error: error.message
    });
  }
};

// 删除产品
exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    // 验证权限
    const [supplier] = await db.query(
      'SELECT id FROM suppliers WHERE user_id = ?',
      [userId]
    );

    if (!supplier || supplier.id !== product.supplier_id) {
      return res.status(403).json({
        code: 403,
        message: '无权删除此产品'
      });
    }

    await Product.delete(id);

    res.json({
      code: 200,
      message: '删除产品成功'
    });
  } catch (error) {
    console.error('删除产品失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除产品失败',
      error: error.message
    });
  }
};

// 审核产品（管理员用）
exports.reviewProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '审核状态必须是 approved 或 rejected'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    if (product.review_status !== 'pending') {
      return res.status(400).json({
        code: 400,
        message: '只能审核待审核的产品'
      });
    }

    // 更新产品状态
    await Product.update(id, {
      review_status: status,
      review_time: new Date(),
      review_remark: remark,
      status: status === 'approved' ? 'published' : 'draft'
    });

    res.json({
      code: 200,
      message: status === 'approved' ? '审核通过' : '审核拒绝'
    });
  } catch (error) {
    console.error('审核产品失败:', error);
    res.status(500).json({
      code: 500,
      message: '审核产品失败',
      error: error.message
    });
  }
};

// 获取待审核产品列表（管理员用）
exports.getPendingReviewProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const offset = (page - 1) * pageSize;

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products
      WHERE review_status = 'pending'
    `;
    const [countResult] = await db.query(countQuery);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT p.*, s.company_name, c.category_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_categories c ON p.category_id = c.id
      WHERE p.review_status = 'pending'
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [products] = await db.query(listQuery, [parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取待审核产品列表成功',
      data: {
        list: products,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取待审核产品列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取待审核产品列表失败',
      error: error.message
    });
  }
};
