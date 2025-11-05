package com.leafcard.common;

import lombok.Data;

/**
 * 统一响应结果类
 */
@Data
public class Result<T> {
    
    /**
     * 状态码
     */
    private int code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 时间戳
     */
    private long timestamp;
    
    public Result() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public static <T> Result<T> success() {
        return success(null);
    }
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        return result;
    }
    
    public static <T> Result<T> success(String message, T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage(message);
        result.setData(data);
        return result;
    }
    
    public static <T> Result<T> error(int code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }
    
    public static <T> Result<T> error(String message) {
        return error(400, message);
    }
    
    public static <T> Result<T> notFound() {
        return error(404, "资源不存在");
    }
    
    public static <T> Result<T> unauthorized() {
        return error(401, "未授权访问");
    }
    
    public static <T> Result<T> forbidden() {
        return error(403, "权限不足");
    }
    
    public static <T> Result<T> serverError() {
        return error(500, "服务器内部错误");
    }
}