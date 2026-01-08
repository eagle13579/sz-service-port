const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// 发布任务
router.post('/', auth, taskController.createTask);

// 获取任务列表
router.get('/', taskController.getTaskList);

// 获取我的任务列表
router.get('/my', auth, taskController.getMyTasks);

// 获取任务详情
router.get('/:id', taskController.getTaskDetail);

// 更新任务
router.put('/:id', auth, taskController.updateTask);

// 删除任务
router.delete('/:id', auth, taskController.deleteTask);

// 取消任务
router.post('/:id/cancel', auth, taskController.cancelTask);

// 认领任务
router.post('/:id/claim', auth, taskController.claimTask);

// 完成任务
router.post('/:id/complete', auth, taskController.completeTask);

// 获取我认领的任务
router.get('/claimed/my', auth, taskController.getClaimedTasks);

module.exports = router;
