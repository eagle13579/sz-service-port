const db = require('../config/database');

class TaskClaim {
  // 创建任务认领记录
  static async create(claimData) {
    const sql = `
      INSERT INTO task_claims (task_id, member_id, claim_reason, quote, estimated_time, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      claimData.task_id,
      claimData.member_id,
      claimData.claim_reason,
      claimData.quote,
      claimData.estimated_time,
      'pending' // 初始状态为待审核
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  // 根据ID查找认领记录
  static async findById(id) {
    const sql = 'SELECT * FROM task_claims WHERE id = ?';
    const [claims] = await db.query(sql, [id]);
    return claims[0];
  }

  // 获取会员的认领记录
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
    const countSql = `SELECT COUNT(*) as total FROM task_claims ${whereClause}`;
    const [countResult] = await db.query(countSql, queryParams);
    const total = countResult.total;

    // 查询列表
    const listSql = `
      SELECT tc.*, t.task_title, t.task_type, t.budget,
             s.company_name as supplier_name
      FROM task_claims tc
      LEFT JOIN tasks t ON tc.task_id = t.id
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      ${whereClause}
      ORDER BY tc.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [claims] = await db.query(listSql, [...queryParams, pageSize, offset]);

    return { list: claims, total, page, pageSize };
  }

  // 更新认领状态
  static async updateStatus(id, status) {
    const sql = 'UPDATE task_claims SET status = ? WHERE id = ?';
    await db.query(sql, [status, id]);
  }

  // 更新任务进度
  static async updateProgress(id, progress, delivery_url = null) {
    const fields = ['progress = ?'];
    const values = [progress];

    if (delivery_url) {
      fields.push('delivery_url = ?');
      values.push(delivery_url);
    }

    if (progress === 100) {
      fields.push('completed_at = ?');
      values.push(new Date());
    }

    values.push(id);
    const sql = `UPDATE task_claims SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);
  }

  // 获取任务的认领申请列表
  static async getByTaskId(taskId) {
    const sql = `
      SELECT tc.*, m.nickname, m.avatar, m.credit_score
      FROM task_claims tc
      LEFT JOIN members m ON tc.member_id = m.id
      WHERE tc.task_id = ?
      ORDER BY tc.created_at DESC
    `;
    const [claims] = await db.query(sql, [taskId]);
    return claims;
  }
}

module.exports = TaskClaim;
