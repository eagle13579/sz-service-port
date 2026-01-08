-- 数据库测试和初始化脚本
-- 运行方法: docker exec -i shuzhi-mysql mysql -uroot -proot123 shuzhi_service_hub < test-init.sql

-- 创建测试用户
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@shuzhi.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqYJQm1pQZ3X3X3X3X3X3X3X3X3X3', 'admin'),
('testuser', 'test@shuzhi.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqYJQm1pQZ3X3X3X3X3X3X3X3X3X3', 'member'),
('testsupplier', 'supplier@shuzhi.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqYJQm1pQZ3X3X3X3X3X3X3X3X3X3', 'supplier')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- 创建测试会员
INSERT INTO members (user_id, member_name, member_type, points, credit_score) VALUES
(2, '测试会员', '个人会员', 1250, 85),
(3, '测试供应商会员', '企业会员', 2500, 92)
ON DUPLICATE KEY UPDATE points=VALUES(points);

-- 创建测试供应商
INSERT INTO suppliers (user_id, company_name, contact_person, phone, email, status) VALUES
(3, '测试科技有限公司', '张三', '13800138000', 'zhangsan@shuzhi.com', 'approved'),
(2, '个人供应商', '李四', '13900139000', 'lisi@shuzhi.com', 'pending')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 创建测试产品
INSERT INTO products (supplier_id, product_name, description, category, price, status, stock) VALUES
(1, '智能客服系统', '基于AI的智能客服解决方案', '技术服务', 50000, 'active', 100),
(1, '数据分析平台', '企业级数据分析与可视化平台', '技术服务', 30000, 'active', 50),
(2, '云存储服务', '安全可靠的云存储解决方案', '云服务', 2000, 'active', 1000),
(2, 'API接口服务', '标准化API接口开发服务', '开发服务', 10000, 'active', 200)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- 创建测试任务
INSERT INTO tasks (title, description, task_type, reward_points, budget, status, deadline) VALUES
('开发移动端应用', '开发iOS和Android移动应用', 'development', 500, 50000, 'open', '2026-03-01'),
('设计UI界面', '设计现代化的UI界面', 'design', 200, 10000, 'open', '2026-02-15'),
('优化数据库', '优化数据库查询性能', 'development', 300, 20000, 'in_progress', '2026-02-20'),
('测试系统', '完成系统功能测试', 'testing', 150, 8000, 'completed', '2026-01-31'),
('编写文档', '编写技术文档和用户手册', 'documentation', 100, 5000, 'open', '2026-02-10')
ON DUPLICATE KEY UPDATE reward_points=VALUES(reward_points);

-- 创建测试活动
INSERT INTO activities (title, description, activity_type, start_date, end_date, status, max_participants, current_participants) VALUES
('新年优惠活动', '新年期间注册即送500积分', 'points', '2026-01-01', '2026-01-31', 'active', 1000, 234),
('技术培训课程', '免费参加AI技术培训', 'training', '2026-02-01', '2026-02-28', 'active', 50, 30),
('产品体验周', '免费体验会员功能一周', 'trial', '2026-02-15', '2026-02-21', 'upcoming', 200, 0)
ON DUPLICATE KEY UPDATE current_participants=VALUES(current_participants);

-- 创建会员活动记录
INSERT INTO member_activities (member_id, activity_id, join_date, status) VALUES
(1, 1, '2026-01-09', 'joined'),
(1, 2, '2026-01-09', 'joined')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 创建测试订单
INSERT INTO orders (buyer_id, seller_id, product_id, total_amount, status, create_date) VALUES
(2, 1, 1, 50000, 'pending', '2026-01-09'),
(2, 1, 2, 30000, 'completed', '2026-01-05'),
(3, 2, 3, 2000, 'processing', '2026-01-08')
ON DUPLICATE KEY UPDATE status=VALUES(status);

SELECT 'Test data initialization completed!' as message;
