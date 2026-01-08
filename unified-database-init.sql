-- ================================================
-- 数智服务港统一数据库初始化脚本
-- 整合供应链平台、会员体系、会员任务系统
-- 版本: v1.0
-- 日期: 2026-01-08
-- ================================================

-- 创建数据库
DROP DATABASE IF EXISTS `shuzhi_service_hub`;
CREATE DATABASE `shuzhi_service_hub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `shuzhi_service_hub`;

-- ================================================
-- 1. 统一用户表
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
  phone VARCHAR(20) UNIQUE NOT NULL COMMENT '手机号',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希（bcrypt）',
  role ENUM('admin', 'supplier', 'member') NOT NULL DEFAULT 'member' COMMENT '角色',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '0:禁用 1:正常',
  last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一用户表';

-- ================================================
-- 2. 统一供应商表
-- ================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE COMMENT '关联用户ID',
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_verification_status (verification_status),
  INDEX idx_supplier_level (supplier_level),
  INDEX idx_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一供应商表';

-- ================================================
-- 3. 统一会员表
-- ================================================
CREATE TABLE IF NOT EXISTS members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE COMMENT '关联用户ID',
  member_type ENUM('normal', 'excellent', 'expert', 'vip') DEFAULT 'normal' COMMENT '会员类型',
  nickname VARCHAR(50) COMMENT '昵称',
  avatar VARCHAR(255) COMMENT '头像',
  gender ENUM('male', 'female', 'other') COMMENT '性别',
  age INT COMMENT '年龄',
  province VARCHAR(50) COMMENT '省份',
  city VARCHAR(50) COMMENT '城市',
  industry VARCHAR(50) COMMENT '行业',
  bio TEXT COMMENT '个人简介',
  credit_score INT DEFAULT 100 COMMENT '信用分',
  level INT DEFAULT 1 COMMENT '等级 1-4',
  points INT DEFAULT 0 COMMENT '积分',
  total_income DECIMAL(10,2) DEFAULT 0 COMMENT '总收益',
  task_count INT DEFAULT 0 COMMENT '完成任务数',
  status ENUM('active', 'suspended') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_member_type (member_type),
  INDEX idx_credit_score (credit_score),
  INDEX idx_level (level),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一会员表';

-- ================================================
-- 4. 会员技能表
-- ================================================
CREATE TABLE IF NOT EXISTS member_skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  skill_name VARCHAR(100) NOT NULL COMMENT '技能名称',
  skill_level TINYINT DEFAULT 1 COMMENT '技能等级 1-5',
  certificate_url VARCHAR(255) COMMENT '技能证书URL',
  verified BOOLEAN DEFAULT FALSE COMMENT '是否已认证',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id),
  INDEX idx_skill_name (skill_name),
  INDEX idx_skill_level (skill_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员技能表';

-- ================================================
-- 5. 会员认证表
-- ================================================
CREATE TABLE IF NOT EXISTS member_certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  cert_type ENUM('real_name', 'skill', 'education', 'other') NOT NULL COMMENT '认证类型',
  cert_name VARCHAR(100) COMMENT '证书名称',
  cert_number VARCHAR(100) COMMENT '证书编号',
  cert_url VARCHAR(255) COMMENT '证书图片URL',
  verified BOOLEAN DEFAULT FALSE COMMENT '是否已认证',
  verified_time TIMESTAMP NULL COMMENT '认证时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id),
  INDEX idx_cert_type (cert_type),
  INDEX idx_verified (verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员认证表';

-- ================================================
-- 6. 会员作品集表
-- ================================================
CREATE TABLE IF NOT EXISTS member_portfolios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  title VARCHAR(200) NOT NULL COMMENT '作品标题',
  description TEXT COMMENT '作品描述',
  images JSON COMMENT '作品图片',
  project_url VARCHAR(255) COMMENT '项目链接',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员作品集表';

-- ================================================
-- 7. 产品分类表
-- ================================================
CREATE TABLE IF NOT EXISTS product_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL COMMENT '分类名称',
  parent_id INT DEFAULT 0 COMMENT '父分类ID',
  icon VARCHAR(255) COMMENT '分类图标',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_parent_id (parent_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品分类表';

-- ================================================
-- 8. 统一产品表
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL COMMENT '供应商ID',
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_review_status (review_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一产品表';

-- ================================================
-- 9. 统一任务表
-- ================================================
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL COMMENT '发布任务的供应商ID',
  task_title VARCHAR(200) NOT NULL COMMENT '任务标题',
  task_desc TEXT COMMENT '任务描述',
  task_type ENUM('market', 'operation', 'investment', 'design', 'tech', 'translation', 'other', 'activity', 'course') NOT NULL COMMENT '任务类型',
  budget DECIMAL(10,2) COMMENT '预算',
  currency VARCHAR(10) DEFAULT 'CNY' COMMENT '货币',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium' COMMENT '优先级',
  deadline DATE COMMENT '截止日期',
  location_type ENUM('online', 'offline') DEFAULT 'online' COMMENT '地点类型',
  location VARCHAR(255) COMMENT '具体地点',
  skill_requirements TEXT COMMENT '技能要求',
  qualification_requirements TEXT COMMENT '资质要求',
  workload_estimate VARCHAR(100) COMMENT '工作量估算',
  delivery_standards TEXT COMMENT '交付标准',
  status ENUM('draft', 'published', 'claimed', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft' COMMENT '状态',
  claimed_member_id INT COMMENT '认领任务会员ID',
  claimed_time TIMESTAMP NULL COMMENT '认领时间',
  progress INT DEFAULT 0 COMMENT '任务进度 0-100',
  delivery_url VARCHAR(255) COMMENT '交付物URL',
  completed_time TIMESTAMP NULL COMMENT '完成时间',
  view_count INT DEFAULT 0 COMMENT '浏览量',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (claimed_member_id) REFERENCES members(id) ON DELETE SET NULL,
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_task_type (task_type),
  INDEX idx_status (status),
  INDEX idx_claimed_member_id (claimed_member_id),
  INDEX idx_deadline (deadline),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一任务表';

-- ================================================
-- 10. 任务认领表
-- ================================================
CREATE TABLE IF NOT EXISTS task_claims (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL COMMENT '任务ID',
  member_id INT NOT NULL COMMENT '会员ID',
  claim_reason TEXT COMMENT '认领理由',
  quote DECIMAL(10,2) COMMENT '报价',
  estimated_time VARCHAR(100) COMMENT '预计完成时间',
  status ENUM('pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '状态',
  progress INT DEFAULT 0 COMMENT '任务进度 0-100',
  delivery_url VARCHAR(255) COMMENT '交付物URL',
  approved_at TIMESTAMP NULL COMMENT '审核通过时间',
  completed_at TIMESTAMP NULL COMMENT '完成时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_member_id (member_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务认领表';

-- ================================================
-- 11. 统一活动表
-- ================================================
CREATE TABLE IF NOT EXISTS activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_title VARCHAR(200) NOT NULL COMMENT '活动标题',
  activity_type ENUM('lunch', 'course', 'event') NOT NULL COMMENT '活动类型',
  activity_desc TEXT COMMENT '活动描述',
  speaker VARCHAR(100) COMMENT '讲师/嘉宾',
  speaker_intro TEXT COMMENT '讲师介绍',
  location VARCHAR(255) COMMENT '活动地点',
  start_time DATETIME COMMENT '开始时间',
  end_time DATETIME COMMENT '结束时间',
  max_participants INT COMMENT '最大参与人数',
  current_participants INT DEFAULT 0 COMMENT '当前参与人数',
  fee DECIMAL(10,2) DEFAULT 0 COMMENT '活动费用',
  images JSON COMMENT '活动图片',
  status ENUM('draft', 'published', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_activity_type (activity_type),
  INDEX idx_status (status),
  INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一活动表';

-- ================================================
-- 12. 活动报名表
-- ================================================
CREATE TABLE IF NOT EXISTS activity_registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_id INT NOT NULL COMMENT '活动ID',
  member_id INT NOT NULL COMMENT '会员ID',
  registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  check_in_time TIMESTAMP NULL COMMENT '签到时间',
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid' COMMENT '支付状态',
  payment_time TIMESTAMP NULL COMMENT '支付时间',
  status ENUM('pending', 'approved', 'rejected', 'checked_in', 'cancelled') DEFAULT 'pending' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_activity_id (activity_id),
  INDEX idx_member_id (member_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动报名表';

-- ================================================
-- 13. 回报记录表
-- ================================================
CREATE TABLE IF NOT EXISTS reward_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  task_claim_id INT COMMENT '任务认领ID',
  reward_type ENUM('cash', 'product_share', 'equity', 'points', 'other') NOT NULL COMMENT '回报类型',
  amount DECIMAL(10,2) COMMENT '金额',
  points INT COMMENT '积分',
  status ENUM('pending', 'settled', 'withdrawing', 'withdrawn', 'rejected') DEFAULT 'pending' COMMENT '状态',
  description TEXT COMMENT '描述',
  settled_at TIMESTAMP NULL COMMENT '结算时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (task_claim_id) REFERENCES task_claims(id) ON DELETE SET NULL,
  INDEX idx_member_id (member_id),
  INDEX idx_task_claim_id (task_claim_id),
  INDEX idx_reward_type (reward_type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回报记录表';

-- ================================================
-- 14. 提现记录表
-- ================================================
CREATE TABLE IF NOT EXISTS withdraw_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reward_record_id INT NOT NULL COMMENT '回报记录ID',
  bank_account VARCHAR(100) NOT NULL COMMENT '银行账号',
  bank_name VARCHAR(100) NOT NULL COMMENT '银行名称',
  account_name VARCHAR(50) NOT NULL COMMENT '账户姓名',
  amount DECIMAL(10,2) NOT NULL COMMENT '提现金额',
  fee DECIMAL(10,2) DEFAULT 0 COMMENT '手续费',
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending' COMMENT '状态',
  processed_at TIMESTAMP NULL COMMENT '处理时间',
  remark TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (reward_record_id) REFERENCES reward_records(id) ON DELETE CASCADE,
  INDEX idx_reward_record_id (reward_record_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现记录表';

-- ================================================
-- 15. 统一评价表
-- ================================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_claim_id INT COMMENT '任务认领ID',
  activity_id INT COMMENT '活动ID',
  reviewer_id INT NOT NULL COMMENT '评价人ID（会员ID）',
  reviewee_id INT NOT NULL COMMENT '被评价人ID（会员ID）',
  supplier_id INT COMMENT '被评价供应商ID（可选）',
  rating TINYINT NOT NULL COMMENT '评分 1-5',
  tags VARCHAR(255) COMMENT '评价标签',
  content TEXT COMMENT '评价内容',
  is_anonymous BOOLEAN DEFAULT FALSE COMMENT '是否匿名',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (reviewer_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  INDEX idx_reviewer_id (reviewer_id),
  INDEX idx_reviewee_id (reviewee_id),
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一评价表';

-- ================================================
-- 16. 统一收藏表
-- ================================================
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  target_type ENUM('task', 'supplier', 'product', 'activity') NOT NULL COMMENT '收藏类型',
  target_id INT NOT NULL COMMENT '目标ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  UNIQUE KEY uk_member_target (member_id, target_type, target_id),
  INDEX idx_member_id (member_id),
  INDEX idx_target_type (target_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一收藏表';

-- ================================================
-- 17. 消息通知表
-- ================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '接收用户ID',
  notification_type ENUM('task', 'activity', 'reward', 'review', 'system') NOT NULL COMMENT '通知类型',
  title VARCHAR(200) NOT NULL COMMENT '通知标题',
  content TEXT COMMENT '通知内容',
  target_id INT COMMENT '关联对象ID',
  is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
  read_at TIMESTAMP NULL COMMENT '阅读时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_notification_type (notification_type),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息通知表';

-- ================================================
-- 18. 操作日志表
-- ================================================
CREATE TABLE IF NOT EXISTS operation_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT COMMENT '操作用户ID',
  operation_type VARCHAR(50) NOT NULL COMMENT '操作类型',
  module VARCHAR(50) NOT NULL COMMENT '模块',
  target_id INT COMMENT '目标ID',
  ip_address VARCHAR(45) COMMENT 'IP地址',
  user_agent TEXT COMMENT '用户代理',
  operation_detail TEXT COMMENT '操作详情',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_user_id (user_id),
  INDEX idx_operation_type (operation_type),
  INDEX idx_module (module),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

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
-- 创建视图：供应商完整信息
-- ================================================
CREATE OR REPLACE VIEW v_supplier_detail AS
SELECT 
  s.*,
  u.username,
  u.email,
  u.phone,
  u.status as user_status,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(DISTINCT t.id) as task_count
FROM suppliers s
LEFT JOIN users u ON s.user_id = u.id
LEFT JOIN products p ON s.id = p.supplier_id
LEFT JOIN tasks t ON s.id = t.supplier_id
GROUP BY s.id;

-- ================================================
-- 创建视图：会员完整信息
-- ================================================
CREATE OR REPLACE VIEW v_member_detail AS
SELECT
  m.*,
  u.username,
  u.email,
  u.phone,
  u.status as user_status,
  COUNT(DISTINCT ms.id) as skill_count,
  COUNT(DISTINCT tc.id) as task_claim_count,
  COUNT(DISTINCT rr.id) as reward_count,
  SUM(CASE WHEN rr.status = 'settled' AND rr.reward_type = 'cash' THEN rr.amount ELSE 0 END) as total_income
FROM members m
LEFT JOIN users u ON m.user_id = u.id
LEFT JOIN member_skills ms ON m.id = ms.member_id
LEFT JOIN task_claims tc ON m.id = tc.member_id
LEFT JOIN reward_records rr ON m.id = rr.member_id
GROUP BY m.id;

-- ================================================
-- 创建视图：任务详情
-- ================================================
CREATE OR REPLACE VIEW v_task_detail AS
SELECT
  t.*,
  s.company_name,
  s.contact_person,
  m.nickname as claimed_member_nickname,
  m.credit_score as claimed_member_credit_score
FROM tasks t
LEFT JOIN suppliers s ON t.supplier_id = s.id
LEFT JOIN members m ON t.claimed_member_id = m.id;

-- ================================================
-- 创建触发器：任务认领时更新会员任务计数
-- ================================================
DELIMITER $$
CREATE TRIGGER after_task_claim_insert
AFTER INSERT ON task_claims
FOR EACH ROW
BEGIN
  UPDATE tasks 
  SET 
    claimed_member_id = NEW.member_id,
    claimed_time = NEW.created_at,
    status = 'claimed'
  WHERE id = NEW.task_id AND NEW.status = 'approved';
END$$
DELIMITER ;

-- ================================================
-- 创建触发器：任务完成时更新会员信用分
-- ================================================
DELIMITER $$
CREATE TRIGGER after_task_update
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE members 
    SET 
      credit_score = credit_score + 5,
      task_count = task_count + 1
    WHERE id = NEW.claimed_member_id;
  END IF;
END$$
DELIMITER ;

-- ================================================
-- 创建触发器：回报结算时更新会员总收益
-- ================================================
DELIMITER $$
CREATE TRIGGER after_reward_settle
AFTER UPDATE ON reward_records
FOR EACH ROW
BEGIN
  IF NEW.status = 'settled' AND OLD.status != 'settled' THEN
    UPDATE members 
    SET 
      total_income = total_income + (CASE WHEN NEW.reward_type = 'cash' THEN NEW.amount ELSE 0 END),
      points = points + (CASE WHEN NEW.reward_type = 'points' THEN NEW.points ELSE 0 END)
    WHERE id = NEW.member_id;
  END IF;
END$$
DELIMITER ;

-- ================================================
-- 数据库初始化完成
-- ================================================
SELECT '统一数据库初始化完成！' as message;
