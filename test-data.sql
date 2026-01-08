-- ================================================
-- 测试数据插入脚本
-- 用于测试三大系统协同功能
-- ================================================

USE `shuzhi_service_hub`;

-- ================================================
-- 1. 插入测试管理员
-- ================================================
INSERT INTO users (username, email, phone, password_hash, role, status) VALUES
('admin', 'admin@shuzhi.com', '13800000001', '$2a$10$8K1p/a0d9V3W7Zq7X9wM.uO1V5NQ2Y8z6P4A5c7L0wE2d4X6Y8z0', 'admin', 1)
ON DUPLICATE KEY UPDATE password_hash=password_hash;

-- ================================================
-- 2. 插入测试供应商
-- ================================================
INSERT INTO users (username, email, phone, password_hash, role, status) VALUES
('supplier1', 'supplier1@company.com', '13800000011', '$2a$10$8K1p/a0d9V3W7Zq7X9wM.uO1V5NQ2Y8z6P4A5c7L0wE2d4X6Y8z0', 'supplier', 1),
('supplier2', 'supplier2@company.com', '13800000012', '$2a$10$8K1p/a0d9V3W7Zq7X9wM.uO1V5NQ2Y8z6P4A5c7L0wE2d4X6Y8z0', 'supplier', 1)
ON DUPLICATE KEY UPDATE password_hash=password_hash;

-- 获取供应商用户ID
SET @supplier1_id = (SELECT id FROM users WHERE username='supplier1');
SET @supplier2_id = (SELECT id FROM users WHERE username='supplier2');

INSERT INTO suppliers (user_id, company_name, contact_person, contact_phone, company_intro, industry, verification_status) VALUES
(@supplier1_id, '智造科技有限公司', '张经理', '13800000011', '专注于智能制造领域的解决方案提供商', '智能制造', 'approved'),
(@supplier2_id, '云数据服务公司', '李总监', '13800000012', '提供云计算和大数据处理服务', '互联网', 'approved')
ON DUPLICATE KEY UPDATE company_name=company_name;

-- ================================================
-- 3. 插入测试会员
-- ================================================
INSERT INTO users (username, email, phone, password_hash, role, status) VALUES
('member1', 'member1@test.com', '13800000021', '$2a$10$8K1p/a0d9V3W7Zq7X9wM.uO1V5NQ2Y8z6P4A5c7L0wE2d4X6Y8z0', 'member', 1),
('member2', 'member2@test.com', '13800000022', '$2a$10$8K1p/a0d9V3W7Zq7X9wM.uO1V5NQ2Y8z6P4A5c7L0wE2d4X6Y8z0', 'member', 1),
('member3', 'member3@test.com', '13800000023', '$2a$10$8K1p/a0d9V3W7Zq7X9wM.uO1V5NQ2Y8z6P4A5c7L0wE2d4X6Y8z0', 'member', 1)
ON DUPLICATE KEY UPDATE password_hash=password_hash;

-- 获取会员用户ID
SET @member1_id = (SELECT id FROM users WHERE username='member1');
SET @member2_id = (SELECT id FROM users WHERE username='member2');
SET @member3_id = (SELECT id FROM users WHERE username='member3');

INSERT INTO members (user_id, nickname, gender, age, industry, bio, credit_score, level, points, member_type) VALUES
(@member1_id, '小明', 'male', 28, '软件开发', '全栈开发工程师，擅长前后端开发', 85, 2, 500, 'excellent'),
(@member2_id, '小红', 'female', 25, '设计', 'UI/UX设计师，拥有5年设计经验', 92, 3, 800, 'expert'),
(@member3_id, '小刚', 'male', 30, '数据分析', '数据分析师，精通Python和机器学习', 78, 1, 200, 'normal')
ON DUPLICATE KEY UPDATE nickname=nickname;

-- ================================================
-- 4. 插入测试产品
-- ================================================
INSERT INTO products (supplier_id, product_name, category, description, specifications, images, unit_price, stock, verification_status) VALUES
(@supplier1_id, '智能生产管理系统', '软件', '企业级生产管理解决方案', '{"功能": ["生产计划", "质量管理", "设备监控"], "版本": "v2.0"}', '[]', 50000.00, 100, 'approved'),
(@supplier1_id, '工业传感器套装', '硬件', '高精度工业级传感器', '{"精度": "±0.1%", "防护等级": "IP67"}', '[]', 2000.00, 500, 'approved'),
(@supplier2_id, '云服务器实例', '服务', '弹性计算云服务器', '{"配置": "4核8G", "带宽": "10Mbps"}', '[]', 800.00, 1000, 'approved')
ON DUPLICATE KEY UPDATE product_name=product_name;

-- ================================================
-- 5. 插入测试任务
-- ================================================
INSERT INTO tasks (supplier_id, title, description, category, requirements, budget, reward_type, reward_value, task_type, max_workers, current_workers, status) VALUES
(@supplier1_id, '前端界面优化', '对现有Web应用前端界面进行优化升级', '软件开发', '要求熟悉Vue3、Tailwind CSS，有响应式设计经验', 8000.00, 'cash', 8000.00, 'project', 1, 0, 'published'),
(@supplier1_id, '数据库性能优化', '优化MySQL数据库查询性能', '软件开发', '要求精通MySQL性能调优，熟悉索引优化', 10000.00, 'cash', 10000.00, 'project', 1, 0, 'published'),
(@supplier2_id, '用户调研问卷设计', '设计用户满意度调查问卷', '市场调研', '要求有市场调研经验，擅长问卷设计', 3000.00, 'points', 300, 'service', 3, 0, 'published')
ON DUPLICATE KEY UPDATE title=title;

-- 获取任务ID
SET @task1_id = (SELECT id FROM tasks WHERE title='前端界面优化' LIMIT 1);
SET @task2_id = (SELECT id FROM tasks WHERE title='数据库性能优化' LIMIT 1);
SET @task3_id = (SELECT id FROM tasks WHERE title='用户调研问卷设计' LIMIT 1);

-- ================================================
-- 6. 插入测试活动
-- ================================================
INSERT INTO activities (title, description, activity_type, max_participants, current_participants, start_time, end_time, points_reward, cash_reward, status) VALUES
('新年任务挑战赛', '参与任务挑战，赢取丰厚奖励', 'task', 100, 0, '2026-01-01 00:00:00', '2026-01-31 23:59:59', 100, 0, 'active'),
('技能分享沙龙', '线上技术分享会', 'online', 50, 0, '2026-01-15 14:00:00', '2026-01-15 17:00:00', 50, 0, 'active'),
('新品体验活动', '体验新产品并反馈意见', 'offline', 20, 0, '2026-01-20 09:00:00', '2026-01-20 18:00:00', 200, 0, 'active')
ON DUPLICATE KEY UPDATE title=title;

-- ================================================
-- 7. 插入测试任务认领
-- ================================================
INSERT INTO task_claims (task_id, member_id, cover_letter, status) VALUES
(@task1_id, @member1_id, '我有3年Vue3开发经验，可以快速完成前端界面优化', 'approved'),
(@task2_id, @member2_id, '精通MySQL性能优化，曾优化过千万级数据表', 'approved')
ON DUPLICATE KEY UPDATE status=status;

-- ================================================
-- 8. 插入测试任务进度
-- ================================================
UPDATE task_claims SET progress_percentage = 60 WHERE task_id = @task1_id AND member_id = @member1_id;
UPDATE task_claims SET progress_percentage = 30 WHERE task_id = @task2_id AND member_id = @member2_id;

-- ================================================
-- 9. 插入测试回报记录
-- ================================================
INSERT INTO reward_records (member_id, type, source, points, amount, status) VALUES
(@member1_id, 'points', 'task', 150, 0, 'settled'),
(@member2_id, 'points', 'activity', 50, 0, 'settled')
ON DUPLICATE KEY UPDATE type=type;

-- ================================================
-- 10. 插入测试评价
-- ================================================
INSERT INTO reviews (task_id, supplier_id, member_id, rating, comment) VALUES
(@task1_id, @supplier1_id, @member1_id, 5, '工作质量很好，按时交付')
ON DUPLICATE KEY UPDATE comment=comment;

-- ================================================
-- 数据插入完成
-- ================================================
SELECT '测试数据插入完成！' AS message;
SELECT COUNT(*) AS admin_count FROM users WHERE role='admin';
SELECT COUNT(*) AS supplier_count FROM users WHERE role='supplier';
SELECT COUNT(*) AS member_count FROM users WHERE role='member';
SELECT COUNT(*) AS task_count FROM tasks;
SELECT COUNT(*) AS product_count FROM products;
SELECT COUNT(*) AS activity_count FROM activities;

-- ================================================
-- 测试账号信息
-- ================================================
SELECT '========== 测试账号信息 ==========' AS '';
SELECT CONCAT('管理员: admin / 密码: 123456') AS login_info;
SELECT CONCAT('供应商1: supplier1 / 密码: 123456') AS login_info;
SELECT CONCAT('供应商2: supplier2 / 密码: 123456') AS login_info;
SELECT CONCAT('会员1: member1 / 密码: 123456') AS login_info;
SELECT CONCAT('会员2: member2 / 密码: 123456') AS login_info;
SELECT CONCAT('会员3: member3 / 密码: 123456') AS login_info;
