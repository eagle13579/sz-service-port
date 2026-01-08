const Supplier = require('../models/Supplier');
const User = require('../models/User');
const db = require('../config/database');

// 提交供应商入驻申请
exports.registerSupplier = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      company_name,
      contact_person,
      contact_phone,
      contact_email,
      address,
      province,
      city,
      industry,
      company_intro,
      business_license,
      main_products,
      production_capacity,
      brand_story,
      qualification_certificates
    } = req.body;

    // 验证必填字段
    if (!company_name || !contact_person || !contact_phone) {
      return res.status(400).json({
        code: 400,
        message: '公司名称、联系人和联系电话为必填项'
      });
    }

    // 检查是否已经入驻
    const existingSupplier = await Supplier.findByUserId(userId);
    if (existingSupplier) {
      return res.status(400).json({
        code: 400,
        message: '您已经提交过入驻申请，请勿重复提交'
      });
    }

    // 创建供应商记录
    const supplierData = {
      user_id: userId,
      company_name,
      contact_person,
      contact_phone,
      contact_email,
      address,
      province,
      city,
      industry,
      company_intro,
      business_license,
      main_products,
      production_capacity,
      brand_story,
      qualification_certificates,
      verification_status: 'pending',
      supplier_level: 'normal'
    };

    const supplierId = await Supplier.create(supplierData);

    res.json({
      code: 200,
      message: '入驻申请提交成功，等待审核',
      data: { supplierId }
    });
  } catch (error) {
    console.error('提交供应商入驻申请失败:', error);
    res.status(500).json({
      code: 500,
      message: '提交入驻申请失败',
      error: error.message
    });
  }
};

// 获取供应商信息
exports.getSupplierInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const supplier = await Supplier.findByUserId(userId);

    if (!supplier) {
      return res.status(404).json({
        code: 404,
        message: '供应商信息不存在'
      });
    }

    res.json({
      code: 200,
      message: '获取供应商信息成功',
      data: supplier
    });
  } catch (error) {
    console.error('获取供应商信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取供应商信息失败',
      error: error.message
    });
  }
};

// 更新供应商信息
exports.updateSupplierInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const supplier = await Supplier.findByUserId(userId);

    if (!supplier) {
      return res.status(404).json({
        code: 404,
        message: '供应商信息不存在'
      });
    }

    // 只能更新未审核或已审核通过的供应商
    if (supplier.verification_status === 'pending') {
      return res.status(400).json({
        code: 400,
        message: '审核中的供应商信息无法修改'
      });
    }

    const updateData = {};
    const allowedFields = [
      'company_intro', 'contact_email', 'address', 'province', 'city',
      'industry', 'main_products', 'production_capacity', 'brand_story',
      'qualification_certificates', 'company_logo'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Supplier.update(supplier.id, updateData);

    res.json({
      code: 200,
      message: '更新供应商信息成功'
    });
  } catch (error) {
    console.error('更新供应商信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新供应商信息失败',
      error: error.message
    });
  }
};

// 获取供应商列表（管理员用）
exports.getSupplierList = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, status, level, industry, keyword } = req.query;
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let queryParams = [];

    if (status) {
      whereConditions.push('s.verification_status = ?');
      queryParams.push(status);
    }

    if (level) {
      whereConditions.push('s.supplier_level = ?');
      queryParams.push(level);
    }

    if (industry) {
      whereConditions.push('s.industry = ?');
      queryParams.push(industry);
    }

    if (keyword) {
      whereConditions.push('(s.company_name LIKE ? OR u.username LIKE ?)');
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM suppliers s
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult.total;

    // 查询列表
    const listQuery = `
      SELECT s.*, u.username, u.email, u.status as user_status
      FROM suppliers s
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [suppliers] = await db.query(listQuery, [...queryParams, parseInt(pageSize), offset]);

    res.json({
      code: 200,
      message: '获取供应商列表成功',
      data: {
        list: suppliers,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取供应商列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取供应商列表失败',
      error: error.message
    });
  }
};

// 审核供应商（管理员用）
exports.reviewSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '审核状态必须是 approved 或 rejected'
      });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        code: 404,
        message: '供应商不存在'
      });
    }

    if (supplier.verification_status !== 'pending') {
      return res.status(400).json({
        code: 400,
        message: '只能审核待审核的供应商'
      });
    }

    // 更新供应商状态
    await Supplier.update(id, {
      verification_status: status,
      verification_time: new Date(),
      verification_remark: remark
    });

    // 如果审核通过，更新用户状态为正常
    if (status === 'approved') {
      await User.update(supplier.user_id, { status: 1 });
    }

    res.json({
      code: 200,
      message: status === 'approved' ? '审核通过' : '审核拒绝'
    });
  } catch (error) {
    console.error('审核供应商失败:', error);
    res.status(500).json({
      code: 500,
      message: '审核供应商失败',
      error: error.message
    });
  }
};

// 获取供应商详情（管理员用）
exports.getSupplierDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({
        code: 404,
        message: '供应商不存在'
      });
    }

    // 获取关联的用户信息
    const user = await User.findById(supplier.user_id);

    res.json({
      code: 200,
      message: '获取供应商详情成功',
      data: {
        ...supplier,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('获取供应商详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取供应商详情失败',
      error: error.message
    });
  }
};

// 设置供应商等级（管理员用）
exports.setSupplierLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.body;

    if (!['normal', 'excellent', 'strategic'].includes(level)) {
      return res.status(400).json({
        code: 400,
        message: '供应商等级必须是 normal、excellent 或 strategic'
      });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        code: 404,
        message: '供应商不存在'
      });
    }

    await Supplier.update(id, { supplier_level: level });

    res.json({
      code: 200,
      message: '设置供应商等级成功'
    });
  } catch (error) {
    console.error('设置供应商等级失败:', error);
    res.status(500).json({
      code: 500,
      message: '设置供应商等级失败',
      error: error.message
    });
  }
};
