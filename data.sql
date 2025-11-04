-- 卡券管理系统数据库初始化脚本
-- 创建数据库
DROP DATABASE IF EXISTS card_keeper;
CREATE DATABASE card_keeper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE card_keeper;

-- 1. 用户表 - 存储系统用户信息
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    phone VARCHAR(20) COMMENT '手机号',
    real_name VARCHAR(50) COMMENT '真实姓名',
    avatar VARCHAR(255) COMMENT '头像URL',
    role ENUM('admin', 'user', 'operator') DEFAULT 'user' NOT NULL COMMENT '用户角色',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active' NOT NULL COMMENT '用户状态',
    last_login_time DATETIME COMMENT '最后登录时间',
    last_login_ip VARCHAR(50) COMMENT '最后登录IP',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='用户表';

-- 2. 产品类别表 - 存储卡券的产品类别
CREATE TABLE product_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL COMMENT '类别名称',
    category_code VARCHAR(20) UNIQUE NOT NULL COMMENT '类别代码',
    description TEXT COMMENT '类别描述',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_category_code (category_code),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='产品类别表';

-- 3. 产品类型表 - 存储具体的产品类型
CREATE TABLE product_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL COMMENT '类别ID',
    type_name VARCHAR(50) NOT NULL COMMENT '类型名称',
    type_code VARCHAR(20) NOT NULL COMMENT '类型代码',
    description TEXT COMMENT '类型描述',
    validity_days INT DEFAULT 365 COMMENT '有效期（天）',
    price DECIMAL(10,2) DEFAULT 0.00 COMMENT '价格',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '货币',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT,
    INDEX idx_category_id (category_id),
    INDEX idx_type_code (type_code),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='产品类型表';

-- 4. 产品规格表 - 存储产品的具体规格
CREATE TABLE product_specs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_id BIGINT NOT NULL COMMENT '类型ID',
    spec_name VARCHAR(50) NOT NULL COMMENT '规格名称',
    spec_code VARCHAR(20) NOT NULL COMMENT '规格代码',
    description TEXT COMMENT '规格描述',
    face_value DECIMAL(10,2) DEFAULT 0.00 COMMENT '面值',
    discount_rate DECIMAL(5,2) DEFAULT 1.00 COMMENT '折扣率',
    usage_rules TEXT COMMENT '使用规则',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (type_id) REFERENCES product_types(id) ON DELETE RESTRICT,
    INDEX idx_type_id (type_id),
    INDEX idx_spec_code (spec_code),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='产品规格表';

-- 5. 卡券管理表 - 核心业务表，存储卡券信息
CREATE TABLE card_management (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL COMMENT '全局唯一标识',
    card_number VARCHAR(50) UNIQUE NOT NULL COMMENT '卡号',
    card_level ENUM('VIP', '普通') DEFAULT '普通' NOT NULL COMMENT '卡等级',
    product_category VARCHAR(50) NOT NULL COMMENT '产品类别',
    product_type VARCHAR(30) NOT NULL COMMENT '产品类型',
    product_spec VARCHAR(50) NOT NULL COMMENT '产品规格',
    card_status ENUM('未使用', '已激活', '已使用', '已过期', '已冻结') DEFAULT '未使用' NOT NULL COMMENT '卡状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    activate_time DATETIME COMMENT '激活时间',
    use_time DATETIME COMMENT '使用时间',
    expire_time DATETIME COMMENT '过期时间',
    user_id VARCHAR(50) COMMENT '使用者ID',
    user_ip VARCHAR(50) COMMENT '使用者IP',
    recharge_times INT DEFAULT 0 COMMENT '充值次数',
    last_recharge_time DATETIME COMMENT '最后充值时间',
    remark TEXT COMMENT '备注',
    version INT DEFAULT 0 NOT NULL COMMENT '版本号（乐观锁）',
    INDEX idx_card_number (card_number),
    INDEX idx_card_status (card_status),
    INDEX idx_create_time (create_time),
    INDEX idx_expire_time (expire_time),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB COMMENT='卡券管理表';

-- 6. 卡券操作日志表 - 记录所有卡券操作
CREATE TABLE card_operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id BIGINT NOT NULL COMMENT '卡券ID',
    operation_type ENUM('create', 'activate', 'use', 'recharge', 'expire', 'freeze', 'update') NOT NULL COMMENT '操作类型',
    operator_id BIGINT COMMENT '操作人ID',
    operator_ip VARCHAR(50) COMMENT '操作人IP',
    operator_name VARCHAR(50) COMMENT '操作人姓名',
    old_data JSON COMMENT '操作前数据',
    new_data JSON COMMENT '操作后数据',
    operation_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '操作时间',
    remark TEXT COMMENT '操作备注',
    FOREIGN KEY (card_id) REFERENCES card_management(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_card_id (card_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_operation_time (operation_time),
    INDEX idx_operator_id (operator_id)
) ENGINE=InnoDB COMMENT='卡券操作日志表';

-- 7. 系统配置表 - 存储系统配置参数
CREATE TABLE system_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL COMMENT '配置键',
    config_value TEXT NOT NULL COMMENT '配置值',
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string' COMMENT '配置类型',
    description VARCHAR(255) COMMENT '配置描述',
    is_public BOOLEAN DEFAULT false COMMENT '是否公开配置',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB COMMENT='系统配置表';

-- 8. 系统日志表 - 记录系统操作日志
CREATE TABLE system_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) COMMENT '用户名',
    operation VARCHAR(100) NOT NULL COMMENT '操作内容',
    method VARCHAR(10) COMMENT '请求方法',
    url VARCHAR(500) COMMENT '请求URL',
    ip VARCHAR(50) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    request_params TEXT COMMENT '请求参数',
    response_result TEXT COMMENT '响应结果',
    status_code INT COMMENT '状态码',
    error_message TEXT COMMENT '错误信息',
    execution_time INT COMMENT '执行时间(ms)',
    log_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '日志时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_operation (operation),
    INDEX idx_log_time (log_time),
    INDEX idx_ip (ip)
) ENGINE=InnoDB COMMENT='系统日志表';

-- 插入初始化数据

-- 插入默认管理员用户
INSERT INTO users (username, email, password_hash, real_name, role, status) VALUES
('admin', 'admin@leafcard.com', '$2a$10$r3dJk7Q6hV6hY7U8i9jKlOeNvMwVq1pQrXrYsTtUvWxYzAbCdEfG', '系统管理员', 'admin', 'active'),
('operator1', 'operator1@leafcard.com', '$2a$10$r3dJk7Q6hV6hY7U8i9jKlOeNvMwVq1pQrXrYsTtUvWxYzAbCdEfG', '操作员1', 'operator', 'active'),
('user1', 'user1@leafcard.com', '$2a$10$r3dJk7Q6hV6hY7U8i9jKlOeNvMwVq1pQrXrYsTtUvWxYzAbCdEfG', '用户1', 'user', 'active');

-- 插入产品类别
INSERT INTO product_categories (category_name, category_code, description, sort_order) VALUES
('会员卡', 'MEMBER_CARD', '各类会员卡产品', 1),
('礼品卡', 'GIFT_CARD', '礼品卡产品', 2),
('优惠卡', 'DISCOUNT_CARD', '优惠折扣卡', 3),
('体验卡', 'EXPERIENCE_CARD', '体验试用卡', 4);

-- 插入产品类型
INSERT INTO product_types (category_id, type_name, type_code, description, validity_days, price) VALUES
(1, 'VIP会员卡', 'VIP_MEMBER', 'VIP会员专属卡', 365, 299.00),
(1, '普通会员卡', 'NORMAL_MEMBER', '普通会员卡', 180, 99.00),
(2, '生日礼品卡', 'BIRTHDAY_GIFT', '生日专属礼品卡', 90, 199.00),
(2, '节日礼品卡', 'FESTIVAL_GIFT', '节日礼品卡', 60, 159.00),
(3, '折扣优惠卡', 'DISCOUNT_CARD', '享受折扣优惠', 30, 49.00),
(4, '体验试用卡', 'TRIAL_CARD', '新产品体验卡', 7, 0.00);

-- 插入产品规格
INSERT INTO product_specs (type_id, spec_name, spec_code, description, face_value, discount_rate, usage_rules) VALUES
(1, '年度VIP', 'ANNUAL_VIP', '年度VIP会员卡', 299.00, 0.85, '享受85折优惠，专属客服'),
(1, '季度VIP', 'QUARTER_VIP', '季度VIP会员卡', 99.00, 0.90, '享受9折优惠'),
(2, '半年会员', 'HALF_YEAR', '半年普通会员卡', 99.00, 0.95, '享受95折优惠'),
(3, '生日专属', 'BIRTHDAY_SPECIAL', '生日专属礼品卡', 199.00, 1.00, '生日当月使用有效'),
(4, '春节礼品', 'SPRING_FESTIVAL', '春节礼品卡', 159.00, 1.00, '春节期间使用'),
(5, '9折优惠', '10_PERCENT_OFF', '享受9折优惠', 49.00, 0.90, '单次消费满100元可用'),
(6, '7天体验', '7_DAY_TRIAL', '7天免费体验', 0.00, 1.00, '新用户专享体验');

-- 插入测试卡券数据（与现有数据保持一致）
INSERT INTO card_management (uuid, card_number, card_level, product_category, product_type, product_spec, card_status, create_time, remark) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'CARD001', 'VIP', '会员卡', 'VIP会员卡', '年度VIP', '未使用', '2024-01-01 10:00:00', '测试VIP会员卡'),
('550e8400-e29b-41d4-a716-446655440001', 'CARD002', '普通', '礼品卡', '生日礼品卡', '生日专属', '未使用', '2024-01-01 10:00:00', '测试普通礼品卡'),
('550e8400-e29b-41d4-a716-446655440002', 'CARD003', 'VIP', '优惠卡', '折扣优惠卡', '9折优惠', '已激活', '2024-01-01 10:00:00', '已使用的VIP优惠卡'),
('550e8400-e29b-41d4-a716-446655440003', 'CARD004', '普通', '会员卡', '普通会员卡', '半年会员', '已使用', '2024-01-01 10:00:00', '已使用的普通会员卡'),
('550e8400-e29b-41d4-a716-446655440004', 'CARD005', 'VIP', '礼品卡', '节日礼品卡', '春节礼品', '已过期', '2024-01-01 10:00:00', '已过期的VIP礼品卡'),
('550e8400-e29b-41d4-a716-446655440005', 'CARD006', '普通', '优惠卡', '折扣优惠卡', '9折优惠', '未使用', '2024-01-01 10:00:00', '测试普通优惠卡'),
('550e8400-e29b-41d4-a716-446655440006', 'CARD007', 'VIP', '会员卡', 'VIP会员卡', '年度VIP', '已激活', '2024-01-01 10:00:00', '已使用的VIP会员卡'),
('550e8400-e29b-41d4-a716-446655440007', 'CARD008', '普通', '礼品卡', '生日礼品卡', '生日专属', '未使用', '2024-01-01 10:00:00', '测试普通礼品卡'),
('550e8400-e29b-41d4-a716-446655440008', 'CARD009', 'VIP', '优惠卡', '折扣优惠卡', '9折优惠', '已使用', '2024-01-01 10:00:00', '已使用的VIP优惠卡'),
('550e8400-e29b-41d4-a716-446655440009', 'CARD010', '普通', '会员卡', '普通会员卡', '半年会员', '已过期', '2024-01-01 10:00:00', '已过期的普通会员卡');

-- 插入系统配置
INSERT INTO system_configs (config_key, config_value, config_type, description, is_public) VALUES
('system.name', 'LeafCard 卡券管理系统', 'string', '系统名称', true),
('system.version', '1.0.0', 'string', '系统版本', true),
('card.default_validity_days', '365', 'number', '默认卡券有效期', false),
('card.max_recharge_times', '3', 'number', '最大充值次数', false),
('system.auto_expire_check', 'true', 'boolean', '自动检查过期', false),
('system.log_retention_days', '90', 'number', '日志保留天数', false);

-- 创建视图用于常用查询
CREATE VIEW card_detail_view AS
SELECT 
    cm.*,
    pc.category_name,
    pt.type_name,
    ps.spec_name,
    ps.face_value,
    ps.discount_rate
FROM card_management cm
LEFT JOIN product_categories pc ON cm.product_category = pc.category_name
LEFT JOIN product_types pt ON cm.product_type = pt.type_name
LEFT JOIN product_specs ps ON cm.product_spec = ps.spec_name;

-- 创建存储过程用于统计
DELIMITER //
CREATE PROCEDURE sp_get_card_statistics()
BEGIN
    SELECT 
        COUNT(*) as total_cards,
        SUM(CASE WHEN card_status = '未使用' THEN 1 ELSE 0 END) as unused_cards,
        SUM(CASE WHEN card_status = '已激活' THEN 1 ELSE 0 END) as activated_cards,
        SUM(CASE WHEN card_status = '已使用' THEN 1 ELSE 0 END) as used_cards,
        SUM(CASE WHEN card_status = '已过期' THEN 1 ELSE 0 END) as expired_cards,
        SUM(CASE WHEN card_status = '已冻结' THEN 1 ELSE 0 END) as frozen_cards
    FROM card_management;
END //
DELIMITER ;

COMMIT;