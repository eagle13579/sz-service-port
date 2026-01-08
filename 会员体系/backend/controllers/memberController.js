const Member = require('../models/Member');
const MemberSkill = require('../models/MemberSkill');
const TaskClaim = require('../models/TaskClaim');
const RewardRecord = require('../models/RewardRecord');
const Review = require('../models/Review');
const db = require('../config/database');

// 创建会员档案
exports.createProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nickname, avatar, gender, age, province, city, industry, bio } = req.body;

    // 检查是否已经创建过会员档案
    const existingMember = await Member.findByUserId(userId);
    if (existingMember) {
      return res.status(400).json({
        code: 400,
        message: '会员档案已存在'
      });
    }

    // 创建会员档案
    const memberId = await Member.create({
      user_id: userId,
      nickname,
      avatar,
      gender,
      age,
      province,
      city,
      industry,
      bio
    });

    res.json({
      code: 200,
      message: '会员档案创建成功',
      data: { memberId }
    });
  } catch (error) {
    console.error('创建会员档案失败:', error);
    res.status(500).json({
      code: 500,
      message: '创建会员档案失败',
      error: error.message
    });
  }
};

// 获取会员信息
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    // 获取会员技能
    const skills = await MemberSkill.getByMemberId(member.id);

    res.json({
      code: 200,
      message: '获取会员信息成功',
      data: { ...member, skills }
    });
  } catch (error) {
    console.error('获取会员信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取会员信息失败',
      error: error.message
    });
  }
};

// 更新会员信息
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const updateData = {};
    const allowedFields = [
      'nickname', 'avatar', 'gender', 'age',
      'province', 'city', 'industry', 'bio'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Member.update(member.id, updateData);

    res.json({
      code: 200,
      message: '更新会员信息成功'
    });
  } catch (error) {
    console.error('更新会员信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新会员信息失败',
      error: error.message
    });
  }
};

// 添加技能
exports.addSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { skill_name, skill_level, certificate_url } = req.body;

    if (!skill_name) {
      return res.status(400).json({
        code: 400,
        message: '技能名称不能为空'
      });
    }

    const skillId = await MemberSkill.create({
      member_id: member.id,
      skill_name,
      skill_level,
      certificate_url
    });

    res.json({
      code: 200,
      message: '添加技能成功',
      data: { skillId }
    });
  } catch (error) {
    console.error('添加技能失败:', error);
    res.status(500).json({
      code: 500,
      message: '添加技能失败',
      error: error.message
    });
  }
};

// 获取技能列表
exports.getSkills = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const skills = await MemberSkill.getByMemberId(member.id);

    res.json({
      code: 200,
      message: '获取技能列表成功',
      data: skills
    });
  } catch (error) {
    console.error('获取技能列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取技能列表失败',
      error: error.message
    });
  }
};

// 删除技能
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await MemberSkill.delete(id);

    res.json({
      code: 200,
      message: '删除技能成功'
    });
  } catch (error) {
    console.error('删除技能失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除技能失败',
      error: error.message
    });
  }
};

// 获取任务认领列表
exports.getTaskClaims = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { page, pageSize, status } = req.query;
    const result = await TaskClaim.getByMemberId(member.id, { page, pageSize, status });

    res.json({
      code: 200,
      message: '获取任务认领列表成功',
      data: result
    });
  } catch (error) {
    console.error('获取任务认领列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取任务认领列表失败',
      error: error.message
    });
  }
};

// 获取收益统计
exports.getRewardStatistics = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const statistics = await RewardRecord.getStatistics(member.id);

    res.json({
      code: 200,
      message: '获取收益统计成功',
      data: statistics
    });
  } catch (error) {
    console.error('获取收益统计失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取收益统计失败',
      error: error.message
    });
  }
};

// 获取回报记录
exports.getRewardRecords = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { page, pageSize, status } = req.query;
    const result = await RewardRecord.getByMemberId(member.id, { page, pageSize, status });

    res.json({
      code: 200,
      message: '获取回报记录成功',
      data: result
    });
  } catch (error) {
    console.error('获取回报记录失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取回报记录失败',
      error: error.message
    });
  }
};

// 获取会员信用评分
exports.getCreditScore = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    // 获取评分分布
    const ratingStats = await Review.getAverageRating(member.id);

    res.json({
      code: 200,
      message: '获取信用评分成功',
      data: {
        credit_score: member.credit_score,
        level: member.level,
        rating_stats: ratingStats
      }
    });
  } catch (error) {
    console.error('获取信用评分失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取信用评分失败',
      error: error.message
    });
  }
};

// 获取评价列表
exports.getReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { page, pageSize, type } = req.query; // type: 'received' or 'given'

    let result;
    if (type === 'given') {
      result = await Review.getGivenReviews(member.id, { page, pageSize });
    } else {
      result = await Review.getReceivedReviews(member.id, { page, pageSize });
    }

    res.json({
      code: 200,
      message: '获取评价列表成功',
      data: result
    });
  } catch (error) {
    console.error('获取评价列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取评价列表失败',
      error: error.message
    });
  }
};
