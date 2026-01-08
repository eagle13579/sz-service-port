const db = require('../config/database');

class User {
  // 创建用户
  static async create(userData) {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [userData.username, userData.email, userData.phone, userData.password, userData.role]
    );
    return result.insertId;
  }

  // 根据用户名查找用户
  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // 根据ID查找用户
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, username, email, phone, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // 更新用户状态
  static async updateStatus(id, status) {
    await db.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, id]
    );
  }
}

module.exports = User;
