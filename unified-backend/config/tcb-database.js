// 云开发NoSQL数据库适配层
// 用于将MySQL操作转换为NoSQL操作

const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({
  env: process.env.TCB_ENV_ID || process.env.SCF_NAMESPACE || 'customer-8g4cr1e455633774'
});

const db = app.database();

// 表名映射
const tables = {
  users: 'users',
  suppliers: 'suppliers',
  members: 'members',
  member_skills: 'member_skills',
  member_certifications: 'member_certifications',
  member_portfolios: 'member_portfolios',
  product_categories: 'product_categories',
  products: 'products',
  tasks: 'tasks',
  task_claims: 'task_claims',
  activities: 'activities',
  activity_registrations: 'activity_registrations',
  reward_records: 'reward_records',
  reviews: 'reviews'
};

// 查询
async function query(collection, where = {}, options = {}) {
  try {
    const { limit = 100, skip = 0, orderBy = [], projection = {} } = options;
    
    let dbQuery = db.collection(tables[collection] || collection);
    
    if (Object.keys(where).length > 0) {
      dbQuery = dbQuery.where(where);
    }
    
    if (Object.keys(projection).length > 0) {
      dbQuery = dbQuery.field(projection);
    }
    
    if (limit > 0) {
      dbQuery = dbQuery.limit(limit);
    }
    
    if (skip > 0) {
      dbQuery = dbQuery.skip(skip);
    }
    
    if (orderBy.length > 0) {
      orderBy.forEach(order => {
        dbQuery = dbQuery.orderBy(order.field, order.direction);
      });
    }
    
    const result = await dbQuery.get();
    return result.data || [];
  } catch (error) {
    console.error('NoSQL查询失败:', error);
    throw error;
  }
}

// 获取单条记录
async function queryOne(collection, where, options = {}) {
  const result = await query(collection, where, { ...options, limit: 1 });
  return result.length > 0 ? result[0] : null;
}

// 插入
async function insert(collection, data) {
  try {
    const result = await db.collection(tables[collection] || collection).add({
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    });
    return { id: result.id, ...data };
  } catch (error) {
    console.error('NoSQL插入失败:', error);
    throw error;
  }
}

// 更新
async function update(collection, where, data) {
  try {
    const updateData = {
      ...data,
      updated_at: new Date()
    };
    
    const result = await db.collection(tables[collection] || collection)
      .where(where)
      .update(updateData);
    
    return result;
  } catch (error) {
    console.error('NoSQL更新失败:', error);
    throw error;
  }
}

// 删除
async function remove(collection, where) {
  try {
    const result = await db.collection(tables[collection] || collection)
      .where(where)
      .remove();
    return result;
  } catch (error) {
    console.error('NoSQL删除失败:', error);
    throw error;
  }
}

// 获取记录数
async function count(collection, where = {}) {
  try {
    const result = await db.collection(tables[collection] || collection)
      .where(where)
      .count();
    return result.total || 0;
  } catch (error) {
    console.error('NoSQL计数失败:', error);
    throw error;
  }
}

module.exports = {
  query,
  queryOne,
  insert,
  update,
  remove,
  count,
  db
};
