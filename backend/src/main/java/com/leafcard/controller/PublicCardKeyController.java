package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.entity.CardKey;
import com.leafcard.entity.Specification;
import com.leafcard.entity.Product;
import com.leafcard.service.CardKeyService;
import com.leafcard.service.SpecificationService;
import com.leafcard.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 对外卡密验证控制器
 * 无需token即可访问，用于应用程序安装时验证安装密钥
 */
@RestController
@RequestMapping("/api/public/card-keys")
public class PublicCardKeyController {

    @Autowired
    private CardKeyService cardKeyService;
    
    @Autowired
    private SpecificationService specificationService;
    
    @Autowired
    private ProductService productService;

    /**
     * 验证安装密钥
     * 无需token即可访问
     * 
     * @param cardKey 卡密字符串
     * @return 验证结果，包含状态信息和商品规格信息
     */
    @GetMapping("/verify/{cardKey}")
    public Result<Map<String, Object>> verifyInstallationKey(@PathVariable String cardKey) {
        try {
            // 查找卡密
            CardKey card = cardKeyService.findByCardKey(cardKey);
            
            if (card == null) {
                return Result.error(404, "该密钥不存在");
            }
            
            // 检查卡密状态
            String status = card.getStatus();
            String message;
            
            switch (status) {
                case "未使用":
                    message = "验证成功";
                    break;
                case "已使用":
                    message = "该密钥已被使用";
                    break;
                case "已禁用":
                    message = "该密钥被禁用";
                    break;
                default:
                    message = "密钥状态异常";
                    break;
            }
            
            // 构建响应数据
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("message", message);
            
            // 如果验证成功，添加商品规格信息
            if ("验证成功".equals(message)) {
                // 获取规格信息
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null) {
                    // 获取商品信息
                    Product product = productService.getById(spec.getProductId());
                    if (product != null) {
                        // 返回商品名-规格格式
                        String productSpecInfo = product.getName() + "-" + spec.getName();
                        responseData.put("data", productSpecInfo);
                        
                        // 添加详细信息（可选）
                        Map<String, Object> details = new HashMap<>();
                        details.put("productName", product.getName());
                        details.put("specificationName", spec.getName());
                        details.put("durationDays", spec.getDurationDays());
                        details.put("price", spec.getPrice());
                        responseData.put("details", details);
                    } else {
                        responseData.put("data", "未知商品-" + spec.getName());
                    }
                } else {
                    responseData.put("data", "未知商品规格");
                }
            } else {
                responseData.put("data", "");
            }
            
            return Result.success(responseData);
            
        } catch (Exception e) {
            return Result.error(500, "验证过程中发生错误");
        }
    }
    
    /**
     * 激活安装密钥
     * 无需token即可访问，用于应用程序安装时激活密钥
     * 
     * @param cardKey 卡密字符串
     * @param request 激活请求参数
     * @return 激活结果
     */
    @PostMapping("/activate/{cardKey}")
    public Result<Map<String, Object>> activateInstallationKey(
            @PathVariable String cardKey,
            @RequestBody Map<String, String> request) {
        try {
            // 查找卡密
            CardKey card = cardKeyService.findByCardKey(cardKey);
            
            if (card == null) {
                return Result.error(404, "该密钥不存在");
            }
            
            // 检查卡密状态
            if (!"未使用".equals(card.getStatus())) {
                String message;
                switch (card.getStatus()) {
                    case "已使用":
                        message = "该密钥已被使用";
                        break;
                    case "已禁用":
                        message = "该密钥被禁用";
                        break;
                    default:
                        message = "密钥状态异常，无法激活";
                        break;
                }
                return Result.error(400, message);
            }
            
            // 获取激活信息
            String userId = request.get("userId");
            String userEmail = request.get("userEmail");
            String deviceInfo = request.get("deviceInfo");
            
            // 激活卡密
            boolean success = cardKeyService.activateCard(cardKey, userId, userEmail);
            
            if (success) {
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("message", "激活成功");
                responseData.put("activated", true);
                
                // 获取商品规格信息
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null) {
                    Product product = productService.getById(spec.getProductId());
                    if (product != null) {
                        String productSpecInfo = product.getName() + "-" + spec.getName();
                        responseData.put("data", productSpecInfo);
                    }
                }
                
                return Result.success(responseData);
            } else {
                return Result.error(500, "激活失败，请重试");
            }
            
        } catch (Exception e) {
            return Result.error(500, "激活过程中发生错误");
        }
    }
    
    /**
     * 获取卡密基本信息（无需token）
     * 用于显示卡密对应的商品规格信息
     * 
     * @param cardKey 卡密字符串
     * @return 卡密基本信息
     */
    @GetMapping("/info/{cardKey}")
    public Result<Map<String, Object>> getCardKeyInfo(@PathVariable String cardKey) {
        try {
            CardKey card = cardKeyService.findByCardKey(cardKey);
            
            if (card == null) {
                return Result.error(404, "该密钥不存在");
            }
            
            Map<String, Object> info = new HashMap<>();
            info.put("status", card.getStatus());
            info.put("cardKey", cardKey);
            
            // 获取商品规格信息
            Specification spec = specificationService.getById(card.getSpecificationId());
            if (spec != null) {
                Product product = productService.getById(spec.getProductId());
                if (product != null) {
                    info.put("productName", product.getName());
                    info.put("specificationName", spec.getName());
                    info.put("productSpec", product.getName() + "-" + spec.getName());
                }
            }
            
            return Result.success(info);
            
        } catch (Exception e) {
            return Result.error(500, "获取卡密信息失败");
        }
    }
}