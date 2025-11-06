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
     * 验证并激活安装密钥
     * 无需token即可访问，验证成功时会自动使用该密钥
     * 
     * @param cardKey 卡密字符串
     * @return 验证结果，包含商品规格信息
     */
    @GetMapping("/verify/{cardKey}")
    public Result<String> verifyAndActivateInstallationKey(@PathVariable String cardKey) {
        try {
            // 查找卡密
            CardKey card = cardKeyService.findByCardKey(cardKey);
            
            if (card == null) {
                return Result.error(404, "该密钥不存在");
            }
            
            // 检查卡密状态
            String status = card.getStatus();
            
            switch (status) {
                case "未使用":
                    // 验证成功时自动使用该密钥
                    boolean activated = cardKeyService.activateCard(cardKey, "system", "system@leafcard.com");
                    if (!activated) {
                        return Result.error(500, "密钥验证成功但使用失败");
                    }
                    
                    // 获取商品规格信息
                    Specification spec = specificationService.getById(card.getSpecificationId());
                    if (spec != null) {
                        Product product = productService.getById(spec.getProductId());
                        if (product != null) {
                            // 返回商品名-规格格式
                            String productSpecInfo = product.getName() + "-" + spec.getName();
                            return Result.success(productSpecInfo);
                        } else {
                            return Result.success("未知商品-" + spec.getName());
                        }
                    } else {
                        return Result.success("未知商品规格");
                    }
                    
                case "已使用":
                    return Result.error(400, "该密钥已被使用");
                    
                case "已禁用":
                    return Result.error(400, "该密钥被禁用");
                    
                default:
                    return Result.error(400, "密钥状态异常");
            }
            
        } catch (Exception e) {
            return Result.error(500, "验证过程中发生错误");
        }
    }
}