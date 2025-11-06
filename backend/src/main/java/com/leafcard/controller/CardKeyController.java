package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.common.Result;
import com.leafcard.dto.CardKeyDTO;
import com.leafcard.entity.CardKey;
import com.leafcard.entity.Specification;
import com.leafcard.entity.Product;
import com.leafcard.service.CardKeyService;
import com.leafcard.service.SpecificationService;
import com.leafcard.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 卡密控制器
 */
@RestController
@RequestMapping("/api/card-keys")
public class CardKeyController {

    @Autowired
    private CardKeyService cardKeyService;
    
    @Autowired
    private SpecificationService specificationService;
    
    @Autowired
    private ProductService productService;

    /**
     * 获取卡密列表（分页）
     */
    @GetMapping
    public Result<IPage<CardKey>> getCardKeys(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        
        Page<CardKey> pageParam = new Page<>(page, size);
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
        
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        
        IPage<CardKey> cardKeyPage = cardKeyService.page(pageParam, queryWrapper);
        return Result.success(cardKeyPage);
    }

    /**
     * 获取包含商品和规格名称的卡密列表
     */
    @GetMapping("/with-details")
    public Result<List<CardKeyDTO>> getCardKeysWithDetails() {
        List<CardKeyDTO> cardKeyList = cardKeyService.getCardKeyListWithDetails();
        return Result.success(cardKeyList);
    }

    /**
     * 根据卡密查询
     */
    @GetMapping("/search")
    public Result<CardKey> searchCardKey(@RequestParam String cardKey) {
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            return Result.success(card);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 验证卡密
     */
    @GetMapping("/verify/{cardKey}")
    public Result<Map<String, Object>> verifyCardKey(@PathVariable String cardKey) {
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            // 创建包含卡密和规格信息的完整响应
            Map<String, Object> response = new HashMap<>();
            response.put("id", card.getId());
            response.put("cardKey", card.getCardKey());
            response.put("specificationId", card.getSpecificationId());
            response.put("status", card.getStatus());
            response.put("userEmail", card.getUserEmail());
            response.put("userId", card.getUserId());
            response.put("activateTime", card.getActivateTime());
            response.put("expireTime", card.getExpireTime());
            response.put("createdAt", card.getCreatedAt());
            response.put("updatedAt", card.getUpdatedAt());
            
            // 获取规格信息（包括价格）
            if (card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null) {
                    response.put("specificationName", spec.getName());
                    response.put("price", spec.getPrice());
                    response.put("durationDays", spec.getDurationDays());
                    
                    // 获取产品信息
                    Product product = productService.getById(spec.getProductId());
                    if (product != null) {
                        response.put("productName", product.getName());
                        response.put("productSpec", product.getName() + "-" + spec.getName());
                    }
                }
            }
            
            return Result.success(response);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 激活卡密
     */
    @PostMapping("/{cardKey}/activate")
    public Result<Boolean> activateCard(
            @PathVariable String cardKey,
            @RequestBody Map<String, String> request) {
        
        String userId = request.get("userId");
        String userEmail = request.get("userEmail");
        
        boolean success = cardKeyService.activateCard(cardKey, userId, userEmail);
        
        if (success) {
            return Result.success("卡密激活成功", true);
        } else {
            return Result.error("卡密激活失败，请检查卡密状态");
        }
    }

    /**
     * 禁用卡密
     */
    @PostMapping("/{cardKey}/disable")
    public Result<Boolean> disableCard(@PathVariable String cardKey) {
        boolean success = cardKeyService.disableCard(cardKey);
        
        if (success) {
            return Result.success("卡密禁用成功", true);
        } else {
            return Result.error(500, "卡密禁用失败");
        }
    }

    /**
     * 获取卡密统计信息
     */
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        Object statistics = cardKeyService.getCardStatistics();
        return Result.success(statistics);
    }

    /**
     * 创建卡密
     */
    @PostMapping
    public Result<Boolean> createCardKey(@RequestBody CardKey cardKey) {
        boolean saved = cardKeyService.save(cardKey);
        
        if (saved) {
            return Result.success("卡密创建成功", true);
        } else {
            return Result.error("卡密创建失败");
        }
    }

    /**
     * 删除卡密
     */
    @DeleteMapping("/{cardKey}")
    public Result<Boolean> deleteCardKey(@PathVariable String cardKey) {
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            boolean deleted = cardKeyService.removeById(card.getId());
            if (deleted) {
                return Result.success("卡密删除成功", true);
            } else {
                return Result.error("卡密删除失败");
            }
        } else {
            return Result.notFound();
        }
    }

    /**
     * 切换卡密状态
     */
    @PostMapping("/{cardKey}/status")
    public Result<Boolean> toggleCardKeyStatus(
            @PathVariable String cardKey,
            @RequestBody Map<String, String> request) {
        
        String status = request.get("status");
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            card.setStatus(status);
            boolean updated = cardKeyService.updateById(card);
            
            if (updated) {
                return Result.success("卡密状态更新成功", true);
            } else {
                return Result.error("卡密状态更新失败");
            }
        } else {
            return Result.notFound();
        }
    }
}