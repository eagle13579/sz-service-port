const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// 获取数据统计
router.get('/statistics', auth, adminController.getStatistics);

// 获取待审核列表
router.get('/pending-reviews', auth, adminController.getPendingReviews);

// 获取用户列表
router.get('/users', auth, adminController.getUserList);

// 更新用户状态
router.put('/users/:id/status', auth, adminController.updateUserStatus);

// 获取操作日志
router.get('/logs', auth, adminController.getOperationLogs);

module.exports = router;
