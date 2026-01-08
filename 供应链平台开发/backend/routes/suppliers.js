const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supplierController = require('../controllers/supplierController');

// 提交供应商入驻申请
router.post('/register', auth, supplierController.registerSupplier);

// 获取供应商信息
router.get('/info', auth, supplierController.getSupplierInfo);

// 更新供应商信息
router.put('/info', auth, supplierController.updateSupplierInfo);

// 获取供应商列表（管理员用）
router.get('/list', auth, supplierController.getSupplierList);

// 获取供应商详情（管理员用）
router.get('/:id', auth, supplierController.getSupplierDetail);

// 审核供应商（管理员用）
router.post('/:id/review', auth, supplierController.reviewSupplier);

// 设置供应商等级（管理员用）
router.put('/:id/level', auth, supplierController.setSupplierLevel);

module.exports = router;
