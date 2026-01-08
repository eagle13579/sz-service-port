const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shuzhi_service_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
});

// 获取连接
async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

// 执行查询
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('数据库查询失败:', error);
    throw error;
  }
}

// 开启事务
async function beginTransaction() {
  const connection = await getConnection();
  await connection.beginTransaction();
  return connection;
}

// 提交事务
async function commitTransaction(connection) {
  try {
    await connection.commit();
    connection.release();
  } catch (error) {
    await rollbackTransaction(connection);
    throw error;
  }
}

// 回滚事务
async function rollbackTransaction(connection) {
  try {
    await connection.rollback();
    connection.release();
  } catch (error) {
    console.error('事务回滚失败:', error);
    connection.release();
    throw error;
  }
}

module.exports = {
  pool,
  getConnection,
  query,
  beginTransaction,
  commitTransaction,
  rollbackTransaction
};
