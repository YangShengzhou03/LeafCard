package com.leafcard.utils;

import com.leafcard.entity.OperationLog;
import com.leafcard.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

/**
 * 日志工具类 - 用于记录关键操作日志
 */
@Component
public class LogUtil {
    
    @Autowired
    private OperationLogService operationLogService;
    
    /**
     * 记录简单操作日志
     */
    public void logOperation(String adminId, String operationType, String description, HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        
        operationLogService.logOperation(adminId, operationType, "", "", description, ipAddress);
    }
    
    /**
     * 记录详细操作日志
     */
    public void logDetailedOperation(String adminId, String adminName, String operationType, 
                                   String targetType, Integer targetId, String targetName,
                                   String description, HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String requestMethod = request.getMethod();
        String requestUrl = request.getRequestURL().toString();
        
        operationLogService.logDetailedOperation(
            adminId, adminName, operationType, targetType, targetId, targetName,
            description, ipAddress, userAgent, requestMethod, requestUrl, "",
            200, 0L, null
        );
    }
    
    /**
     * 记录登录日志
     */
    public void logLogin(String adminId, String adminName, boolean success, String description, HttpServletRequest request) {
        String operationType = success ? "LOGIN_SUCCESS" : "LOGIN_FAILED";
        logDetailedOperation(adminId, adminName, operationType, "ADMIN", null, adminName, description, request);
    }
    
    /**
     * 记录卡密操作日志
     */
    public void logCardKeyOperation(String adminId, String adminName, String operationType, 
                                  Integer cardKeyId, String cardKey, String description, HttpServletRequest request) {
        logDetailedOperation(adminId, adminName, operationType, "CARD_KEY", cardKeyId, cardKey, description, request);
    }
    
    /**
     * 记录产品操作日志
     */
    public void logProductOperation(String adminId, String adminName, String operationType, 
                                   Integer productId, String productName, String description, HttpServletRequest request) {
        logDetailedOperation(adminId, adminName, operationType, "PRODUCT", productId, productName, description, request);
    }
    
    /**
     * 记录规格操作日志
     */
    public void logSpecificationOperation(String adminId, String adminName, String operationType, 
                                         Integer specId, String specName, String description, HttpServletRequest request) {
        logDetailedOperation(adminId, adminName, operationType, "SPECIFICATION", specId, specName, description, request);
    }
    
    /**
     * 记录用户操作日志
     */
    public void logUserOperation(String adminId, String adminName, String operationType, 
                               String userId, String userName, String description, HttpServletRequest request) {
        logDetailedOperation(adminId, adminName, operationType, "USER", null, userName, description, request);
    }
    
    /**
     * 记录系统配置操作日志
     */
    public void logSystemConfigOperation(String adminId, String adminName, String operationType, 
                                       String configKey, String configValue, String description, HttpServletRequest request) {
        logDetailedOperation(adminId, adminName, operationType, "SYSTEM_CONFIG", null, configKey, description, request);
    }
    
    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 对于多个IP的情况，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
    
    /**
     * 从JWT token中获取管理员信息
     */
    public String getAdminIdFromToken(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            try {
                return JwtUtil.getUserIdFromToken(token);
            } catch (Exception e) {
                return "unknown";
            }
        }
        return "unknown";
    }
    
    /**
     * 从JWT token中获取管理员名称
     */
    public String getAdminNameFromToken(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            try {
                return JwtUtil.getUsernameFromToken(token);
            } catch (Exception e) {
                return "unknown";
            }
        }
        return "unknown";
    }
    
    /**
     * 从请求头中提取JWT token
     */
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}