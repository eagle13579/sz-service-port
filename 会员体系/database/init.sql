-- 会员体系数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS member_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE member_system;

-- 用户表（与供应链平台共享）
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'supplier', 'member') NOT NULL DEFAULT 'member',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '0:禁用 1:正常',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 会员表
CREATE TABLE IF NOT EXISTS members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '关联用户ID',
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
  level TINYINT DEFAULT 1 COMMENT '等级 1-4',
  points INT DEFAULT 0 COMMENT '积分',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_member_type (member_type),
  INDEX idx_credit_score (credit_score),
  INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员表';

-- 会员技能表
CREATE TABLE IF NOT EXISTS member_skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  skill_name VARCHAR(100) NOT NULL COMMENT '技能名称',
  skill_level TINYINT DEFAULT 1 COMMENT '技能等级 1-5',
  certificate_url VARCHAR(255) COMMENT '技能证书URL',
  verified BOOLEAN DEFAULT FALSE COMMENT '是否已认证',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id),
  INDEX idx_skill_name (skill_name),
  INDEX idx_skill_level (skill_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员技能表';

-- 会员认证表
CREATE TABLE IF NOT EXISTS member_certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  cert_type ENUM('real_name', 'skill', 'education', 'other') NOT NULL COMMENT '认证类型',
  cert_name VARCHAR(100) COMMENT '证书名称',
  cert_number VARCHAR(100) COMMENT '证书编号',
  cert_url VARCHAR(255) COMMENT '证书图片URL',
  verified BOOLEAN DEFAULT FALSE COMMENT '是否已认证',
  verified_time TIMESTAMP NULL COMMENT '认证时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id),
  INDEX idx_cert_type (cert_type),
  INDEX idx_verified (verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员认证表';

-- 会员作品集表
CREATE TABLE IF NOT EXISTS member_portfolios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  title VARCHAR(200) NOT NULL COMMENT '作品标题',
  description TEXT COMMENT '作品描述',
  images JSON COMMENT '作品图片',
  project_url VARCHAR(255) COMMENT '项目链接',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员作品集表';

-- 任务认领表
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_task_id (task_id),
  INDEX idx_member_id (member_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务认领表';

-- 回报记录表
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (task_claim_id) REFERENCES task_claims(id) ON DELETE SET NULL,
  INDEX idx_member_id (member_id),
  INDEX idx_task_claim_id (task_claim_id),
  INDEX idx_reward_type (reward_type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回报记录表';

-- 提现记录表
CREATE TABLE IF NOT EXISTS withdraw_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reward_record_id INT NOT NULL COMMENT '回报记录ID',
  bank_account VARCHAR(100) NOT NULL COMMENT '银行账号',
  bank_name VARCHAR(100) NOT NULL COMMENT '银行名称',
  account_name VARCHAR(50) NOT NULL COMMENT '账户姓名',
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending' COMMENT '状态',
  processed_at TIMESTAMP NULL COMMENT '处理时间',
  remark TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reward_record_id) REFERENCES reward_records(id) ON DELETE CASCADE,
  INDEX idx_reward_record_id (reward_record_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现记录表';

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reviewer_id INT NOT NULL COMMENT '评价人ID',
  reviewee_id INT NOT NULL COMMENT '被评价人ID',
  task_claim_id INT COMMENT '任务认领ID',
  rating TINYINT NOT NULL COMMENT '评分 1-5',
  content TEXT COMMENT '评价内容',
  is_anonymous BOOLEAN DEFAULT FALSE COMMENT '是否匿名',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (task_claim_id) REFERENCES task_claims(id) ON DELETE SET NULL,
  INDEX idx_reviewer_id (reviewer_id),
  INDEX idx_reviewee_id (reviewee_id),
  INDEX idx_task_claim_id (task_claim_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL COMMENT '会员ID',
  target_type ENUM('task', 'supplier', 'product') NOT NULL COMMENT '收藏类型',
  target_id INT NOT NULL COMMENT '目标ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  UNIQUE KEY uk_member_target (member_id, target_type, target_id),
  INDEX idx_member_id (member_id),
  INDEX idx_target_type (target_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 插入测试数据
-- 测试用户
INSERT INTO users (username, email, phone, password, role) VALUES
('member001', 'member001@example.com', '13800000001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member'),
('member002', 'member002@example.com', '13800000002', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member');

-- 测试会员
INSERT INTO members (user_id, nickname, gender, province, city, industry, bio) VALUES
(1, '测试会员1', 'male', '北京市', '北京市', '互联网', '擅长市场营销和品牌推广'),
(2, '测试会员2', 'female', '上海市', '上海市', '设计', '专业的UI/UX设计师');

-- 测试技能
INSERT INTO member_skills (member_id, skill_name, skill_level, verified) VALUES
(1, '市场营销', 4, TRUE),
(1, '品牌推广', 3, FALSE),
(2, 'UI设计', 5, TRUE),
(2, 'UX设计', 4, TRUE);

-- 创建视图：会员完整信息视图
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

COMMIT;
