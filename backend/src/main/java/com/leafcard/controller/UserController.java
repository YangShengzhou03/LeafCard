package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.entity.User;
import com.leafcard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<User> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        User user = userService.login(username, password);
        if (user != null) {
            return Result.success("登录成功", user);
        } else {
            return Result.error("用户名或密码错误");
        }
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/{id}")
    public Result<User> getUser(@PathVariable String id) {
        User user = userService.getById(id);
        
        if (user != null) {
            return Result.success(user);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 创建用户
     */
    @PostMapping
    public Result<Boolean> createUser(@RequestBody User user) {
        // 检查用户名是否已存在
        if (userService.findByUsername(user.getUsername()) != null) {
            return Result.error("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (userService.findByEmail(user.getEmail()) != null) {
            return Result.error("邮箱已存在");
        }
        
        boolean saved = userService.save(user);
        if (saved) {
            return Result.success("用户创建成功", true);
        } else {
            return Result.error("用户创建失败");
        }
    }
}