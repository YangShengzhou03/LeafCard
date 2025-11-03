-- 创建数据库
CREATE DATABASE IF NOT EXISTS card_keeper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE card_keeper;

-- 创建卡管理表
CREATE TABLE IF NOT EXISTS card (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    card_level VARCHAR(20) NOT NULL,
    product_category VARCHAR(50) NOT NULL,
    product_type VARCHAR(30) NOT NULL,
    product_spec VARCHAR(50) NOT NULL,
    card_status TINYINT NOT NULL DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activate_time DATETIME NULL,
    use_time DATETIME NULL,
    expire_time DATETIME NULL,
    user_id VARCHAR(50) NULL,
    user_ip VARCHAR(50) NULL,
    recharge_times INT NOT NULL DEFAULT 0,
    last_recharge_time DATETIME NULL,
    remark TEXT NULL,
    version INT NOT NULL DEFAULT 0,
    INDEX idx_card_number (card_number),
    INDEX idx_card_status (card_status),
    INDEX idx_card_level (card_level),
    INDEX idx_product_category (product_category),
    INDEX idx_product_type (product_type),
    INDEX idx_product_spec (product_spec),
    INDEX idx_create_time (create_time),
    INDEX idx_expire_time (expire_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;