package com.cardkeeper.service;

import com.cardkeeper.entity.Card;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface CardService {
    
    /**
     * 卡密验证（规格类型文本+数字标识）
     */
    Map<String, Object> validateCard(String cardNumber, String specificationType, String digitalIdentifier);
    
    /**
     * 批量卡密验证
     */
    Map<String, Object> batchValidateCards(String[] cardNumbers, String specificationType, String digitalIdentifier);
    
    /**
     * 获取卡密验证规则
     */
    Map<String, Object> getValidationRules();
    
    /**
     * 获取卡列表（分页查询）
     */
    Page<Card> getCardList(String cardNumber, String cardLevel, String productCategory, String productType, String productSpec, Integer cardStatus, int page, int size);
    
    /**
     * 根据产品类型和规格获取卡列表
     */
    Page<Card> getCardListByProductTypeAndSpec(String productType, String productSpec, Integer cardStatus, int page, int size);
    
    /**
     * 获取产品类型统计
     */
    Map<String, Long> getProductTypeStatistics();
    
    /**
     * 获取产品规格统计
     */
    Map<String, Long> getProductSpecStatistics();
    
    /**
     * 获取产品类型和规格组合统计
     */
    Map<String, Map<String, Long>> getProductTypeAndSpecStatistics();
    
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
     * 使用卡
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