package com.leafcard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafcard.entity.Admin;

/**
 * 管理员服务接口
 */
public interface AdminService extends IService<Admin> {
    
    /**
     * 根据用户名查找管理员
     */
    Admin findByUsername(String username);
    
    /**
     * 根据邮箱查找管理员
     */
    Admin findByEmail(String email);
}