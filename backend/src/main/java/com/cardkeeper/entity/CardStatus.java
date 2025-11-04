package com.cardkeeper.entity;

/**
 * 卡券状态枚举
 */
public enum CardStatus {
    未使用("未使用"),
    已激活("已激活"),
    已使用("已使用"),
    已过期("已过期"),
    已冻结("已冻结");
    
    private final String description;
    
    CardStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    @Override
    public String toString() {
        return description;
    }
}