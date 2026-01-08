const db = require('../config/database');

class MemberSkill {
  // 创建会员技能
  static async create(skillData) {
    const sql = `
      INSERT INTO member_skills (member_id, skill_name, skill_level, certificate_url, verified)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      skillData.member_id,
      skillData.skill_name,
      skillData.skill_level || 1,
      skillData.certificate_url,
      skillData.verified || false
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  // 获取会员技能列表
  static async getByMemberId(memberId) {
    const sql = 'SELECT * FROM member_skills WHERE member_id = ?';
    const [skills] = await db.query(sql, [memberId]);
    return skills;
  }

  // 更新技能信息
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    });

    if (fields.length === 0) return;

    values.push(id);
    const sql = `UPDATE member_skills SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);
  }

  // 删除技能
  static async delete(id) {
    const sql = 'DELETE FROM member_skills WHERE id = ?';
    await db.query(sql, [id]);
  }
}

module.exports = MemberSkill;
