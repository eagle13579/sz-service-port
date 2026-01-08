const Review = require('../models/Review');
const Member = require('../models/Member');

// 提交评价
exports.createReview = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { task_claim_id, reviewee_id, rating, content, is_anonymous } = req.body;

    if (!task_claim_id || !reviewee_id || !rating) {
      return res.status(400).json({
        code: 400,
        message: '任务认领ID、被评价人ID和评分不能为空'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        code: 400,
        message: '评分必须在1-5之间'
      });
    }

    // 创建评价
    const reviewId = await Review.create({
      reviewer_id: member.id,
      reviewee_id,
      task_claim_id,
      rating,
      content,
      is_anonymous
    });

    // 更新被评价人的信用分
    const creditDelta = (rating - 3) * 2; // 5星+4分，4星+2分，3星+0分，2星-2分，1星-4分
    await Member.updateCreditScore(reviewee_id, creditDelta);
    await Member.updateLevel(reviewee_id);

    res.json({
      code: 200,
      message: '评价提交成功',
      data: { reviewId }
    });
  } catch (error) {
    console.error('提交评价失败:', error);
    res.status(500).json({
      code: 500,
      message: '提交评价失败',
      error: error.message
    });
  }
};

// 获取收到的评价
exports.getReceivedReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { page = 1, pageSize = 20 } = req.query;
    const result = await Review.getReceivedReviews(member.id, { page, pageSize });

    res.json({
      code: 200,
      message: '获取收到的评价成功',
      data: result
    });
  } catch (error) {
    console.error('获取收到的评价失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取收到的评价失败',
      error: error.message
    });
  }
};

// 获取发布的评价
exports.getGivenReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { page = 1, pageSize = 20 } = req.query;
    const result = await Review.getGivenReviews(member.id, { page, pageSize });

    res.json({
      code: 200,
      message: '获取发布的评价成功',
      data: result
    });
  } catch (error) {
    console.error('获取发布的评价失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取发布的评价失败',
      error: error.message
    });
  }
};

// 获取平均评分
exports.getAverageRating = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const stats = await Review.getAverageRating(member.id);

    res.json({
      code: 200,
      message: '获取平均评分成功',
      data: stats
    });
  } catch (error) {
    console.error('获取平均评分失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取平均评分失败',
      error: error.message
    });
  }
};
