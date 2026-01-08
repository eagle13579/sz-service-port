-- ================================================
-- 供应链平台数据库初始化脚本
-- ================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS supply_chain DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE supply_chain;

-- ================================================
-- 用户表
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'supplier', 'member') NOT NULL DEFAULT 'supplier',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '0:未激活 1:正常 2:禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 供应商表
-- ================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  company_name VARCHAR(100) NOT NULL COMMENT '公司名称',
  company_logo VARCHAR(255) COMMENT '公司Logo',
  business_license VARCHAR(255) COMMENT '营业执照',
  company_intro TEXT COMMENT '公司简介',
  contact_person VARCHAR(50) NOT NULL COMMENT '联系人',
  contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  contact_email VARCHAR(100) COMMENT '联系邮箱',
  address VARCHAR(255) COMMENT '公司地址',
  province VARCHAR(50) COMMENT '省份',
  city VARCHAR(50) COMMENT '城市',
  industry VARCHAR(50) COMMENT '行业',
  main_products TEXT COMMENT '主营产品',
  production_capacity TEXT COMMENT '生产能力',
  brand_story TEXT COMMENT '品牌故事',
  qualification_certificates JSON COMMENT '资质证书',
  supplier_level ENUM('normal', 'excellent', 'strategic') DEFAULT 'normal' COMMENT '供应商等级',
  verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态',
  verification_time TIMESTAMP NULL COMMENT '审核时间',
  verification_remark TEXT COMMENT '审核备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_verification_status (verification_status),
  INDEX idx_supplier_level (supplier_level),
  INDEX idx_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 产品分类表
-- ================================================
CREATE TABLE IF NOT EXISTS product_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL COMMENT '分类名称',
  parent_id INT DEFAULT 0 COMMENT '父分类ID',
  icon VARCHAR(255) COMMENT '分类图标',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_parent_id (parent_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 产品表
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL COMMENT '产品名称',
  product_desc TEXT COMMENT '产品描述',
  product_images JSON COMMENT '产品图片',
  product_video VARCHAR(255) COMMENT '产品视频',
  specifications JSON COMMENT '规格参数',
  price DECIMAL(10,2) COMMENT '价格',
  stock INT DEFAULT 0 COMMENT '库存',
  category_id INT COMMENT '分类ID',
  tags JSON COMMENT '标签',
  status ENUM('draft', 'published', 'offline') DEFAULT 'draft' COMMENT '状态',
  review_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态',
  review_time TIMESTAMP NULL COMMENT '审核时间',
  review_remark TEXT COMMENT '审核备注',
  sales_count INT DEFAULT 0 COMMENT '销量',
  view_count INT DEFAULT 0 COMMENT '浏览量',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_review_status (review_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 任务表
-- ================================================
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  task_title VARCHAR(200) NOT NULL COMMENT '任务标题',
  task_desc TEXT COMMENT '任务描述',
  task_type ENUM('market', 'operation', 'investment', 'design', 'tech', 'translation', 'other') NOT NULL COMMENT '任务类型',
  budget DECIMAL(10,2) COMMENT '预算',
  currency VARCHAR(10) DEFAULT 'CNY' COMMENT '货币',
  deadline DATE COMMENT '截止日期',
  location_type ENUM('online', 'offline') DEFAULT 'online' COMMENT '地点类型',
  location VARCHAR(255) COMMENT '具体地点',
  skill_requirements TEXT COMMENT '技能要求',
  qualification_requirements TEXT COMMENT '资质要求',
  workload_estimate VARCHAR(100) COMMENT '工作量估算',
  delivery_standards TEXT COMMENT '交付标准',
  status ENUM('draft', 'published', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft' COMMENT '状态',
  claimed_by INT COMMENT '认领人ID',
  claimed_time TIMESTAMP NULL COMMENT '认领时间',
  completed_time TIMESTAMP NULL COMMENT '完成时间',
  view_count INT DEFAULT 0 COMMENT '浏览量',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_task_type (task_type),
  INDEX idx_status (status),
  INDEX idx_claimed_by (claimed_by),
  INDEX idx_deadline (deadline),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 品牌服务表
-- ================================================
CREATE TABLE IF NOT EXISTS brand_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  service_type ENUM('valuation', 'packaging', 'marketing', 'dtc_export', 'financing') NOT NULL COMMENT '服务类型',
  service_name VARCHAR(200) NOT NULL COMMENT '服务名称',
  service_desc TEXT COMMENT '服务描述',
  price DECIMAL(10,2) COMMENT '服务价格',
  service_images JSON COMMENT '服务图片',
  status ENUM('draft', 'published', 'offline') DEFAULT 'draft' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_service_type (service_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 插入初始产品分类
-- ================================================
INSERT INTO product_categories (category_name, parent_id, sort_order) VALUES
('电子', 0, 1),
('服装', 0, 2),
('家居', 0, 3),
('食品', 0, 4),
('化工', 0, 5),
('纺织', 0, 6);

-- ================================================
-- 创建测试管理员账号
-- 密码: admin123 (需要用bcrypt加密)
-- ================================================
-- 注意: 实际使用时需要用bcrypt加密密码
-- INSERT INTO users (username, email, phone, password, role, status) VALUES
-- ('admin', 'admin@example.com', '13800000000', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'admin', 1);

-- ================================================
-- 初始化完成
-- ================================================
SELECT '数据库初始化完成！' as message;
