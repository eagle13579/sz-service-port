const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// 提交评价
router.post('/', auth, reviewController.createReview);

// 获取收到的评价
router.get('/received', auth, reviewController.getReceivedReviews);

// 获取发布的评价
router.get('/given', auth, reviewController.getGivenReviews);

// 获取平均评分
router.get('/average', auth, reviewController.getAverageRating);

module.exports = router;
