package com.cardkeeper.service;

import com.cardkeeper.entity.Card;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface CardService {
    
    /**
     * 获取卡列表（分页）
     */
    Page<Card> getCardList(String cardNumber, String cardLevel, String productCategory, 
                          Integer cardStatus, int page, int size);
    
    /**
     * 根据ID获取卡详情
     */
    Card getCardById(Long id);
    
    /**
     * 根据卡号获取卡详情
     */
    Card getCardByNumber(String cardNumber);
    
    /**
     * 新增卡
     */
    Card addCard(Card card);
    
    /**
     * 更新卡信息
     */
    Card updateCard(Card card);
    
    /**
     * 删除卡
     */
    void deleteCard(Long id);
    
    /**
     * 激活卡
     */
    Card activateCard(Long id);
    
    /**
     * 使用卡
     */
    Card useCard(Long id, String userId, String userIp);
    
    /**
     * 补充卡
     */
    Card rechargeCard(Long id);
    
    /**
     * 过期卡
     */
    Card expireCard(Long id);
    
    /**
     * 冻结卡
     */
    Card freezeCard(Long id);
    
    /**
     * 获取统计信息
     */
    Map<String, Object> getStatistics();
    
    /**
     * 检查卡号是否已存在
     */
    boolean isCardNumberExists(String cardNumber);
    
    /**
     * 批量处理过期卡
     */
    void processExpiredCards();
}