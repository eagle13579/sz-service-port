const db = require('../config/database');

class Member {
  // 创建会员
  static async create(memberData) {
    const sql = `
      INSERT INTO members (user_id, member_type, nickname, avatar, gender, age,
                         province, city, industry, bio, credit_score, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      memberData.user_id,
      memberData.member_type || 'normal',
      memberData.nickname,
      memberData.avatar,
      memberData.gender,
      memberData.age,
      memberData.province,
      memberData.city,
      memberData.industry,
      memberData.bio,
      100, // 初始信用分
      1    // 初始等级
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  // 根据用户ID查找会员
  static async findByUserId(userId) {
    const sql = 'SELECT * FROM members WHERE user_id = ?';
    const [members] = await db.query(sql, [userId]);
    return members[0];
  }

  // 根据ID查找会员
  static async findById(id) {
    const sql = 'SELECT * FROM members WHERE id = ?';
    const [members] = await db.query(sql, [id]);
    return members[0];
  }

  // 更新会员信息
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    });

    if (fields.length === 0) return;

    values.push(id);
    const sql = `UPDATE members SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);
  }

  // 更新信用分
  static async updateCreditScore(id, delta) {
    const sql = 'UPDATE members SET credit_score = credit_score + ? WHERE id = ?';
    await db.query(sql, [delta, id]);
  }

  // 更新会员等级
  static async updateLevel(id) {
    const sql = `
      UPDATE members
      SET level = CASE
        WHEN credit_score >= 900 THEN 4
        WHEN credit_score >= 750 THEN 3
        WHEN credit_score >= 600 THEN 2
        ELSE 1
      END
      WHERE id = ?
    `;
    await db.query(sql, [id]);
  }

  // 获取会员列表
  static async getList(params = {}) {
    const { page = 1, pageSize = 20, member_type, credit_level, keyword } = params;
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let queryParams = [];

    if (member_type) {
      whereConditions.push('member_type = ?');
      queryParams.push(member_type);
    }

    if (credit_level) {
      const levelRanges = {
        1: [0, 600],
        2: [600, 750],
        3: [750, 900],
        4: [900, 1000]
      };
      const [min, max] = levelRanges[credit_level];
      whereConditions.push('credit_score >= ? AND credit_score < ?');
      queryParams.push(min, max);
    }

    if (keyword) {
      whereConditions.push('(nickname LIKE ? OR bio LIKE ?)');
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM members ${whereClause}`;
    const [countResult] = await db.query(countSql, queryParams);
    const total = countResult.total;

    // 查询列表
    const listSql = `
      SELECT m.*, u.username, u.email
      FROM members m
      LEFT JOIN users u ON m.user_id = u.id
      ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [members] = await db.query(listSql, [...queryParams, pageSize, offset]);

    return { list: members, total, page, pageSize };
  }

  // 删除会员
  static async delete(id) {
    const sql = 'DELETE FROM members WHERE id = ?';
    await db.query(sql, [id]);
  }
}

module.exports = Member;
