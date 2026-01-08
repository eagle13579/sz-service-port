const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 发布产品
router.post('/', auth, upload.array('images', 10), productController.createProduct);

// 获取产品列表
router.get('/', productController.getProductList);

// 获取我的产品列表
router.get('/my', auth, productController.getMyProducts);

// 获取产品详情
router.get('/:id', productController.getProductDetail);

// 更新产品
router.put('/:id', auth, upload.array('images', 10), productController.updateProduct);

// 删除产品
router.delete('/:id', auth, productController.deleteProduct);

// 审核产品（管理员用）
router.post('/:id/review', auth, productController.reviewProduct);

// 获取待审核产品列表（管理员用）
router.get('/review/pending', auth, productController.getPendingReviewProducts);

module.exports = router;
