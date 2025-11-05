package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.entity.Admin;
import com.leafcard.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * 管理员控制器
 */
@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Result<Admin> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Admin admin = adminService.login(username, password);
        if (admin != null) {
            return Result.success("登录成功", admin);
        } else {
            return Result.error("用户名或密码错误");
        }
    }

    /**
     * 获取管理员信息
     */
    @GetMapping("/{id}")
    public Result<Admin> getAdmin(@PathVariable String id) {
        Admin admin = adminService.getById(id);
        
        if (admin != null) {
            return Result.success(admin);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 创建管理员
     */
    @PostMapping
    public Result<Boolean> createAdmin(@RequestBody Admin admin) {
        // 检查用户名是否已存在
        if (adminService.findByUsername(admin.getUsername()) != null) {
            return Result.error("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (adminService.findByEmail(admin.getEmail()) != null) {
            return Result.error("邮箱已存在");
        }
        
        boolean saved = adminService.save(admin);
        if (saved) {
            return Result.success("管理员创建成功", true);
        } else {
            return Result.error("管理员创建失败");
        }
    }
}