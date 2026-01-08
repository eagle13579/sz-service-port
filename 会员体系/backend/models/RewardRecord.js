const db = require('../config/database');

class RewardRecord {
  // 创建回报记录
  static async create(rewardData) {
    const sql = `
      INSERT INTO reward_records (member_id, task_claim_id, reward_type, amount, status, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      rewardData.member_id,
      rewardData.task_claim_id,
      rewardData.reward_type,
      rewardData.amount,
      rewardData.status || 'pending',
      rewardData.description
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  // 获取会员的回报记录
  static async getByMemberId(memberId, params = {}) {
    const { page = 1, pageSize = 20, status } = params;
    const offset = (page - 1) * pageSize;

    let whereConditions = ['member_id = ?'];
    let queryParams = [memberId];

    if (status) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM reward_records ${whereClause}`;
    const [countResult] = await db.query(countSql, queryParams);
    const total = countResult.total;

    // 查询列表
    const listSql = `
      SELECT rr.*, tc.task_id, t.task_title
      FROM reward_records rr
      LEFT JOIN task_claims tc ON rr.task_claim_id = tc.id
      LEFT JOIN tasks t ON tc.task_id = t.id
      ${whereClause}
      ORDER BY rr.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [records] = await db.query(listSql, [...queryParams, pageSize, offset]);

    return { list: records, total, page, pageSize };
  }

  // 获取收益统计
  static async getStatistics(memberId) {
    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN status = 'settled' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_income,
        COALESCE(SUM(CASE WHEN reward_type = 'cash' AND status = 'settled' THEN amount ELSE 0 END), 0) as cash_income,
        COALESCE(SUM(CASE WHEN reward_type = 'points' THEN amount ELSE 0 END), 0) as total_points,
        COUNT(*) as total_records
      FROM reward_records
      WHERE member_id = ?
    `;
    const [result] = await db.query(sql, [memberId]);
    return result[0];
  }

  // 更新回报状态
  static async updateStatus(id, status) {
    const sql = 'UPDATE reward_records SET status = ? WHERE id = ?';
    await db.query(sql, [status, id]);
  }

  // 获取待结算列表
  static async getPendingList(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const countSql = `SELECT COUNT(*) as total FROM reward_records WHERE status = 'pending'`;
    const [countResult] = await db.query(countSql);
    const total = countResult.total;

    const listSql = `
      SELECT rr.*, m.nickname, tc.task_id, t.task_title
      FROM reward_records rr
      LEFT JOIN task_claims tc ON rr.task_claim_id = tc.id
      LEFT JOIN tasks t ON tc.task_id = t.id
      LEFT JOIN members m ON rr.member_id = m.id
      WHERE rr.status = 'pending'
      ORDER BY rr.created_at ASC
      LIMIT ? OFFSET ?
    `;
    const [records] = await db.query(listSql, [pageSize, offset]);

    return { list: records, total, page, pageSize };
  }
}

module.exports = RewardRecord;
