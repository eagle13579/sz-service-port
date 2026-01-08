const db = require('../config/database');

class Product {
  // 创建产品
  static async create(productData) {
    const [result] = await db.execute(
      `INSERT INTO products (
        supplier_id, product_name, product_desc, product_images, product_video,
        specifications, price, stock, category_id, tags, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productData.supplier_id,
        productData.product_name,
        productData.product_desc || null,
        productData.product_images ? JSON.stringify(productData.product_images) : null,
        productData.product_video || null,
        productData.specifications ? JSON.stringify(productData.specifications) : null,
        productData.price || null,
        productData.stock || 0,
        productData.category_id || null,
        productData.tags ? JSON.stringify(productData.tags) : null,
        productData.status || 'draft'
      ]
    );
    return result.insertId;
  }

  // 获取产品列表
  static async getList(params) {
    const { page = 1, pageSize = 20, category_id, keyword, status } = params;
    const offset = (page - 1) * pageSize;

    let conditions = [];
    let queryParams = [];

    if (category_id) {
      conditions.push('category_id = ?');
      queryParams.push(category_id);
    }
    if (keyword) {
      conditions.push('(product_name LIKE ? OR product_desc LIKE ?)');
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (status) {
      conditions.push('status = ?');
      queryParams.push(status);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const [rows] = await db.execute(
      `SELECT p.*, s.company_name, s.company_logo FROM products p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, pageSize, offset]
    );

    const [count] = await db.execute(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      queryParams
    );

    return {
      list: rows.map(row => ({
        ...row,
        product_images: row.product_images ? JSON.parse(row.product_images) : [],
        specifications: row.specifications ? JSON.parse(row.specifications) : null,
        tags: row.tags ? JSON.parse(row.tags) : []
      })),
      total: count[0].total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  // 根据ID获取产品
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT p.*, s.company_name, s.company_logo FROM products p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0) return null;

    const product = rows[0];
    return {
      ...product,
      product_images: product.product_images ? JSON.parse(product.product_images) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
      tags: product.tags ? JSON.parse(product.tags) : []
    };
  }

  // 更新产品审核状态
  static async updateReviewStatus(id, status, remark) {
    const [result] = await db.execute(
      'UPDATE products SET review_status = ?, review_time = NOW(), review_remark = ? WHERE id = ?',
      [status, remark, id]
    );
    return result.affectedRows > 0;
  }

  // 更新产品
  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (['product_images', 'specifications', 'tags'].includes(key) && value) {
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
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  // 删除产品
  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Product;
