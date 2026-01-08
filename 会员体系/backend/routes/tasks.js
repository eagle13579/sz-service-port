const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// 浏览任务列表
router.get('/', taskController.getTasks);

// 获取任务详情
router.get('/:id', taskController.getTaskDetail);

// 认领任务
router.post('/:id/claim', auth, taskController.claimTask);

// 更新任务进度
router.put('/claims/:id/progress', auth, taskController.updateProgress);

// 提交交付物
router.post('/claims/:id/deliver', auth, taskController.submitDelivery);

module.exports = router;
