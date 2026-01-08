const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rewardController = require('../controllers/rewardController');

// 获取收益统计
router.get('/statistics', auth, rewardController.getStatistics);

// 获取回报记录
router.get('/records', auth, rewardController.getRecords);

// 申请提现
router.post('/withdraw', auth, rewardController.withdraw);

module.exports = router;
