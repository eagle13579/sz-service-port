const db = require('../config/database');

class Review {
  // 创建评价
  static async create(reviewData) {
    const sql = `
      INSERT INTO reviews (reviewer_id, reviewee_id, task_claim_id, rating, content, is_anonymous)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      reviewData.reviewer_id,
      reviewData.reviewee_id,
      reviewData.task_claim_id,
      reviewData.rating,
      reviewData.content,
      reviewData.is_anonymous || false
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  // 获取会员收到的评价
  static async getReceivedReviews(revieweeId, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM reviews WHERE reviewee_id = ?`;
    const [countResult] = await db.query(countSql, [revieweeId]);
    const total = countResult.total;

    // 查询列表
    const listSql = `
      SELECT r.*, m.nickname as reviewer_name, m.avatar as reviewer_avatar, t.task_title
      FROM reviews r
      LEFT JOIN members m ON r.reviewer_id = m.id
      LEFT JOIN task_claims tc ON r.task_claim_id = tc.id
      LEFT JOIN tasks t ON tc.task_id = t.id
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [reviews] = await db.query(listSql, [revieweeId, pageSize, offset]);

    return { list: reviews, total, page, pageSize };
  }

  // 获取会员发布的评价
  static async getGivenReviews(reviewerId, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM reviews WHERE reviewer_id = ?`;
    const [countResult] = await db.query(countSql, [reviewerId]);
    const total = countResult.total;

    // 查询列表
    const listSql = `
      SELECT r.*, m.nickname as reviewee_name, t.task_title
      FROM reviews r
      LEFT JOIN members m ON r.reviewee_id = m.id
      LEFT JOIN task_claims tc ON r.task_claim_id = tc.id
      LEFT JOIN tasks t ON tc.task_id = t.id
      WHERE r.reviewer_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [reviews] = await db.query(listSql, [reviewerId, pageSize, offset]);

    return { list: reviews, total, page, pageSize };
  }

  // 计算会员平均评分
  static async getAverageRating(memberId) {
    const sql = `
      SELECT
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews
      WHERE reviewee_id = ?
    `;
    const [result] = await db.query(sql, [memberId]);
    return result[0];
  }
}

module.exports = Review;
