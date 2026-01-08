const express = require('express');
const router = express.Router();
const { query, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * 获取活动列表
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      activity_type,
      status
    } = req.query;

    const offset = (page - 1) * pageSize;

    const conditions = [];
    const params = [];

    if (activity_type) {
      conditions.push('activity_type = ?');
      params.push(activity_type);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const activities = await query(
      `SELECT 
        a.*,
        (SELECT COUNT(*) FROM activity_registrations WHERE activity_id = a.id) as registration_count
      FROM activities a
      ${whereClause}
      ORDER BY a.start_time DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), offset]
    );

    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM activities ${whereClause}`
      : 'SELECT COUNT(*) as total FROM activities';
    const [{ total }] = await query(countQuery, params);

    res.json({
      code: 200,
      data: {
        list: activities,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取活动列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取活动列表失败'
    });
  }
});

/**
 * 获取活动详情
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const activities = await query('SELECT * FROM activities WHERE id = ?', [id]);

    if (activities.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '活动不存在'
      });
    }

    // 检查当前用户是否已报名
    let isRegistered = false;
    if (req.user) {
      const registration = await query(
        'SELECT * FROM activity_registrations WHERE activity_id = ? AND member_id = ?',
        [id, req.user.id]
      );
      isRegistered = registration.length > 0;
    }

    res.json({
      code: 200,
      data: {
        ...activities[0],
        isRegistered
      }
    });
  } catch (error) {
    console.error('获取活动详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取活动详情失败'
    });
  }
});

/**
 * 会员报名活动
 */
router.post('/:id/register', authMiddleware, roleMiddleware(['member']), async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await beginTransaction();

    try {
      // 检查活动是否存在
      const activities = await connection.execute('SELECT * FROM activities WHERE id = ? FOR UPDATE', [id]);
      if (activities[0].length === 0) {
        await rollbackTransaction(connection);
        return res.status(404).json({
          code: 404,
          message: '活动不存在'
        });
      }

      const activity = activities[0][0];

      // 检查活动状态
      if (activity.status !== 'published') {
        await rollbackTransaction(connection);
        return res.status(400).json({
          code: 400,
          message: '活动当前状态不允许报名'
        });
      }

      // 检查是否已满员
      if (activity.max_participants && activity.current_participants >= activity.max_participants) {
        await rollbackTransaction(connection);
        return res.status(400).json({
          code: 400,
          message: '活动报名人数已满'
        });
      }

      // 获取会员ID
      const members = await connection.execute('SELECT id FROM members WHERE user_id = ?', [req.user.id]);
      if (members[0].length === 0) {
        await rollbackTransaction(connection);
        return res.status(404).json({
          code: 404,
          message: '会员信息不存在'
        });
      }

      const memberId = members[0][0].id;

      // 检查是否已报名
      const existingRegistrations = await connection.execute(
        'SELECT id FROM activity_registrations WHERE activity_id = ? AND member_id = ?',
        [id, memberId]
      );

      if (existingRegistrations[0].length > 0) {
        await rollbackTransaction(connection);
        return res.status(400).json({
          code: 400,
          message: '您已经报名过该活动'
        });
      }

      // 创建报名记录
      const paymentStatus = activity.fee > 0 ? 'unpaid' : 'paid';

      await connection.execute(
        `INSERT INTO activity_registrations (activity_id, member_id, registration_time, payment_status, status)
        VALUES (?, ?, NOW(), ?, 'pending')`,
        [id, memberId, paymentStatus]
      );

      // 更新活动报名人数
      await connection.execute(
        'UPDATE activities SET current_participants = current_participants + 1 WHERE id = ?',
        [id]
      );

      await commitTransaction(connection);

      res.json({
        code: 200,
        message: '活动报名成功',
        data: { activityId: id, paymentStatus }
      });
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  } catch (error) {
    console.error('报名活动失败:', error);
    res.status(500).json({
      code: 500,
      message: '报名活动失败'
    });
  }
});

/**
 * 管理员发布活动
 */
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const {
      activity_title,
      activity_type,
      activity_desc,
      speaker,
      speaker_intro,
      location,
      start_time,
      end_time,
      max_participants,
      fee,
      images
    } = req.body;

    const [result] = await query(
      `INSERT INTO activities (
        activity_title, activity_type, activity_desc, speaker, speaker_intro,
        location, start_time, end_time, max_participants, fee, images, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [
        activity_title, activity_type, activity_desc, speaker, speaker_intro,
        location, start_time, end_time, max_participants, fee, images
      ]
    );

    res.json({
      code: 200,
      message: '活动发布成功',
      data: { activityId: result.insertId }
    });
  } catch (error) {
    console.error('发布活动失败:', error);
    res.status(500).json({
      code: 500,
      message: '发布活动失败'
    });
  }
});

module.exports = router;
