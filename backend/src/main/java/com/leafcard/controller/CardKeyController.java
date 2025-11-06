package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.common.Result;
import com.leafcard.dto.CardKeyDTO;
import com.leafcard.entity.CardKey;
import com.leafcard.service.CardKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Result<CardKey> verifyCardKey(@PathVariable String cardKey) {
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            return Result.success(card);
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