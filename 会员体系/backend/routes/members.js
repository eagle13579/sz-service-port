const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const memberController = require('../controllers/memberController');

// 创建会员档案
router.post('/profile', auth, memberController.createProfile);

// 获取会员信息
router.get('/profile', auth, memberController.getProfile);

// 更新会员信息
router.put('/profile', auth, memberController.updateProfile);

// 添加技能
router.post('/skills', auth, memberController.addSkill);

// 获取技能列表
router.get('/skills', auth, memberController.getSkills);

// 删除技能
router.delete('/skills/:id', auth, memberController.deleteSkill);

// 获取任务认领列表
router.get('/task-claims', auth, memberController.getTaskClaims);

// 获取收益统计
router.get('/rewards/statistics', auth, memberController.getRewardStatistics);

// 获取回报记录
router.get('/rewards', auth, memberController.getRewardRecords);

// 获取信用评分
router.get('/credit-score', auth, memberController.getCreditScore);

// 获取评价列表
router.get('/reviews', auth, memberController.getReviews);

module.exports = router;
