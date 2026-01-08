const db = require('../config/database');

class Task {
  // 创建任务
  static async create(taskData) {
    const [result] = await db.execute(
      `INSERT INTO tasks (
        supplier_id, task_title, task_desc, task_type, budget, currency,
        deadline, location_type, location, skill_requirements,
        qualification_requirements, workload_estimate, delivery_standards, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        taskData.supplier_id,
        taskData.task_title,
        taskData.task_desc || null,
        taskData.task_type,
        taskData.budget || null,
        taskData.currency || 'CNY',
        taskData.deadline || null,
        taskData.location_type || 'online',
        taskData.location || null,
        taskData.skill_requirements || null,
        taskData.qualification_requirements || null,
        taskData.workload_estimate || null,
        taskData.delivery_standards || null,
        taskData.status || 'draft'
      ]
    );
    return result.insertId;
  }

  // 获取任务列表
  static async getList(params) {
    const { page = 1, pageSize = 20, task_type, status, supplier_id } = params;
    const offset = (page - 1) * pageSize;

    let conditions = [];
    let queryParams = [];

    if (task_type) {
      conditions.push('task_type = ?');
      queryParams.push(task_type);
    }
    if (status) {
      conditions.push('status = ?');
      queryParams.push(status);
    }
    if (supplier_id) {
      conditions.push('supplier_id = ?');
      queryParams.push(supplier_id);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const [rows] = await db.execute(
      `SELECT t.*, s.company_name FROM tasks t
       LEFT JOIN suppliers s ON t.supplier_id = s.id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, pageSize, offset]
    );

    const [count] = await db.execute(
      `SELECT COUNT(*) as total FROM tasks t ${whereClause}`,
      queryParams
    );

    return {
      list: rows,
      total: count[0].total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  // 根据ID获取任务
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT t.*, s.company_name, s.contact_person, s.contact_phone
       FROM tasks t
       LEFT JOIN suppliers s ON t.supplier_id = s.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  }

  // 更新任务状态
  static async updateStatus(id, status) {
    const [result] = await db.execute(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  // 更新任务
  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await db.execute(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  // 删除任务
  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Task;
