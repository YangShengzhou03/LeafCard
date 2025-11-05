package com.leafcard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafcard.entity.Admin;
import com.leafcard.mapper.AdminMapper;
import com.leafcard.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

/**
 * 管理员服务实现类
 */
@Service
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements AdminService {

    @Override
    public Admin findByUsername(String username) {
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return this.getOne(queryWrapper);
    }

    @Override
    public Admin findByEmail(String email) {
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        return this.getOne(queryWrapper);
    }

    @Override
    public Admin login(String username, String password) {
        Admin admin = findByUsername(username);
        // 在实际应用中，这里应该使用密码加密验证
        // 例如：BCrypt.checkpw(password, admin.getPasswordHash())
        if (admin != null && admin.getPasswordHash().equals(password)) {
            admin.setLastLoginTime(LocalDateTime.now());
            this.updateById(admin);
            return admin;
        }
        return null;
    }
}