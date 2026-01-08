const db = require('../config/database');

class Supplier {
  // 创建供应商
  static async create(supplierData) {
    const [result] = await db.execute(
      `INSERT INTO suppliers (
        user_id, company_name, company_logo, business_license, company_intro,
        contact_person, contact_phone, contact_email, address, province, city,
        industry, main_products, production_capacity, brand_story, qualification_certificates
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        supplierData.user_id,
        supplierData.company_name,
        supplierData.company_logo || null,
        supplierData.business_license || null,
        supplierData.company_intro || null,
        supplierData.contact_person,
        supplierData.contact_phone,
        supplierData.contact_email || null,
        supplierData.address || null,
        supplierData.province || null,
        supplierData.city || null,
        supplierData.industry || null,
        supplierData.main_products || null,
        supplierData.production_capacity || null,
        supplierData.brand_story || null,
        supplierData.qualification_certificates ? JSON.stringify(supplierData.qualification_certificates) : null
      ]
    );
    return result.insertId;
  }

  // 获取供应商列表
  static async getList(params) {
    const { page = 1, pageSize = 20, industry, supplier_level, verification_status } = params;
    const offset = (page - 1) * pageSize;

    let conditions = [];
    let queryParams = [];

    if (industry) {
      conditions.push('industry = ?');
      queryParams.push(industry);
    }
    if (supplier_level) {
      conditions.push('supplier_level = ?');
      queryParams.push(supplier_level);
    }
    if (verification_status) {
      conditions.push('verification_status = ?');
      queryParams.push(verification_status);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // 获取列表
    const [rows] = await db.execute(
      `SELECT * FROM suppliers ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, pageSize, offset]
    );

    // 获取总数
    const [count] = await db.execute(
      `SELECT COUNT(*) as total FROM suppliers ${whereClause}`,
      queryParams
    );

    return {
      list: rows,
      total: count[0].total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  // 根据用户ID获取供应商
  static async findByUserId(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM suppliers WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  // 根据ID获取供应商
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // 更新供应商审核状态
  static async updateVerificationStatus(id, status, remark) {
    const [result] = await db.execute(
      'UPDATE suppliers SET verification_status = ?, verification_time = NOW(), verification_remark = ? WHERE id = ?',
      [status, remark, id]
    );
    return result.affectedRows > 0;
  }

  // 更新供应商信息
  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (key === 'qualification_certificates' && value) {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await db.execute(
      `UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }
}

module.exports = Supplier;
