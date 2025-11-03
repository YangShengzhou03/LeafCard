package com.cardkeeper.controller;

import com.cardkeeper.common.Result;
import com.cardkeeper.entity.Card;
import com.cardkeeper.service.CardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cards")
public class CardController {
    
    @Autowired
    private CardService cardService;
    
    /**
     * 获取卡列表（分页）
     */
    @GetMapping
    public Result<Page<Card>> getCardList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String cardNumber,
            @RequestParam(required = false) String cardLevel,
            @RequestParam(required = false) String productCategory,
            @RequestParam(required = false) Integer cardStatus) {
        
        Page<Card> cardPage = cardService.getCardList(cardNumber, cardLevel, productCategory, cardStatus, page, size);
        return Result.success(cardPage);
    }
    
    /**
     * 根据ID获取卡详情
     */
    @GetMapping("/{id}")
    public Result<Card> getCardById(@PathVariable Long id) {
        Card card = cardService.getCardById(id);
        return Result.success(card);
    }
    
    /**
     * 新增卡
     */
    @PostMapping
    public Result<Card> addCard(@Valid @RequestBody Card card) {
        Card savedCard = cardService.addCard(card);
        return Result.success("创建成功", savedCard);
    }
    
    /**
     * 更新卡信息
     */
    @PutMapping("/{id}")
    public Result<Card> updateCard(@PathVariable Long id, @Valid @RequestBody Card card) {
        card.setId(id);
        Card updatedCard = cardService.updateCard(card);
        return Result.success("更新成功", updatedCard);
    }
    
    /**
     * 删除卡
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteCard(@PathVariable Long id) {
        cardService.deleteCard(id);
        return Result.success("删除成功");
    }
    
    /**
     * 激活卡
     */
    @PostMapping("/{id}/activate")
    public Result<Card> activateCard(@PathVariable Long id) {
        Card activatedCard = cardService.activateCard(id);
        return Result.success("激活成功", activatedCard);
    }
    
    /**
     * 使用卡
     */
    @PostMapping("/{id}/use")
    public Result<Card> useCard(@PathVariable Long id, 
                               @RequestParam String userId,
                               @RequestParam String userIp) {
        Card usedCard = cardService.useCard(id, userId, userIp);
        return Result.success("使用成功", usedCard);
    }
    
    /**
     * 补充卡
     */
    @PostMapping("/{id}/recharge")
    public Result<Card> rechargeCard(@PathVariable Long id) {
        Card rechargedCard = cardService.rechargeCard(id);
        return Result.success("补充成功", rechargedCard);
    }
    
    /**
     * 过期卡
     */
    @PostMapping("/{id}/expire")
    public Result<Card> expireCard(@PathVariable Long id) {
        Card expiredCard = cardService.expireCard(id);
        return Result.success("标记过期成功", expiredCard);
    }
    
    /**
     * 冻结卡
     */
    @PostMapping("/{id}/freeze")
    public Result<Card> freezeCard(@PathVariable Long id) {
        Card frozenCard = cardService.freezeCard(id);
        return Result.success("冻结成功", frozenCard);
    }
    
    /**
     * 获取统计信息
     */
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getStatistics() {
        Map<String, Object> statistics = cardService.getStatistics();
        return Result.success(statistics);
    }
    
    /**
     * 检查卡号是否存在
     */
    @GetMapping("/check-card-number")
    public Result<Boolean> checkCardNumber(@RequestParam String cardNumber) {
        boolean exists = cardService.isCardNumberExists(cardNumber);
        return Result.success(exists);
    }
    
    /**
     * 处理过期卡（定时任务调用）
     */
    @PostMapping("/process-expired")
    public Result<Void> processExpiredCards() {
        cardService.processExpiredCards();
        return Result.success("处理过期卡完成");
    }
}