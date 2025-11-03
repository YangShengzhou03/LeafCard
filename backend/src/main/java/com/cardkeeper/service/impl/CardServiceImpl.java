package com.cardkeeper.service.impl;

import com.cardkeeper.entity.Card;
import com.cardkeeper.repository.CardRepository;
import com.cardkeeper.service.CardService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CardServiceImpl implements CardService {
    
    @Autowired
    private CardRepository cardRepository;
    
    @Override
    public Page<Card> getCardList(String cardNumber, String cardLevel, String productCategory, 
                                Integer cardStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return cardRepository.findByConditions(cardNumber, cardLevel, productCategory, cardStatus, pageable);
    }
    
    @Override
    public Card getCardById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("卡不存在，ID: " + id));
    }
    
    @Override
    public Card getCardByNumber(String cardNumber) {
        return cardRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new EntityNotFoundException("卡不存在，卡号: " + cardNumber));
    }
    
    @Override
    public Card addCard(Card card) {
        // 检查卡号是否已存在
        if (cardRepository.existsByCardNumber(card.getCardNumber())) {
            throw new IllegalArgumentException("卡号已存在: " + card.getCardNumber());
        }
        
        // 设置默认值
        if (card.getCardStatus() == null) {
            card.setCardStatus(0); // 默认未激活
        }
        if (card.getRechargeTimes() == null) {
            card.setRechargeTimes(0);
        }
        
        return cardRepository.save(card);
    }
    
    @Override
    public Card updateCard(Card card) {
        Card existingCard = getCardById(card.getId());
        
        // 检查卡号是否被其他卡使用
        if (!existingCard.getCardNumber().equals(card.getCardNumber()) && 
            cardRepository.existsByCardNumber(card.getCardNumber())) {
            throw new IllegalArgumentException("卡号已存在: " + card.getCardNumber());
        }
        
        // 更新字段
        existingCard.setCardNumber(card.getCardNumber());
        existingCard.setCardLevel(card.getCardLevel());
        existingCard.setProductCategory(card.getProductCategory());
        existingCard.setExpireTime(card.getExpireTime());
        existingCard.setRemark(card.getRemark());
        
        return cardRepository.save(existingCard);
    }
    
    @Override
    public void deleteCard(Long id) {
        Card card = getCardById(id);
        cardRepository.delete(card);
    }
    
    @Override
    public Card activateCard(Long id) {
        Card card = getCardById(id);
        
        if (card.getCardStatus() != 0) {
            throw new IllegalStateException("只有未激活的卡才能激活");
        }
        
        card.activate();
        return cardRepository.save(card);
    }
    
    @Override
    public Card useCard(Long id, String userId, String userIp) {
        Card card = getCardById(id);
        
        if (card.getCardStatus() != 1) {
            throw new IllegalStateException("只有已激活的卡才能使用");
        }
        
        if (card.isExpired()) {
            throw new IllegalStateException("卡已过期，无法使用");
        }
        
        card.use(userId, userIp);
        return cardRepository.save(card);
    }
    
    @Override
    public Card rechargeCard(Long id) {
        Card card = getCardById(id);
        
        if (card.getCardStatus() != 1 && card.getCardStatus() != 2) {
            throw new IllegalStateException("只有已激活或已使用的卡才能补充");
        }
        
        card.recharge();
        return cardRepository.save(card);
    }
    
    @Override
    public Card expireCard(Long id) {
        Card card = getCardById(id);
        card.expire();
        return cardRepository.save(card);
    }
    
    @Override
    public Card freezeCard(Long id) {
        Card card = getCardById(id);
        card.freeze();
        return cardRepository.save(card);
    }
    
    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // 统计总卡数
        long totalCards = cardRepository.count();
        stats.put("totalCards", totalCards);
        
        // 统计不同状态的卡数量
        List<Object[]> statusCounts = cardRepository.countByCardStatus();
        Map<Integer, Long> statusStats = new HashMap<>();
        for (Object[] result : statusCounts) {
            statusStats.put((Integer) result[0], (Long) result[1]);
        }
        
        stats.put("activeCards", statusStats.getOrDefault(1, 0L));
        stats.put("usedCards", statusStats.getOrDefault(2, 0L));
        stats.put("expiredCards", statusStats.getOrDefault(3, 0L));
        stats.put("inactiveCards", statusStats.getOrDefault(0, 0L));
        
        // 统计不同等级的卡数量
        List<Object[]> levelCounts = cardRepository.countByCardLevel();
        Map<String, Long> levelStats = new HashMap<>();
        for (Object[] result : levelCounts) {
            levelStats.put((String) result[0], (Long) result[1]);
        }
        stats.put("levelStats", levelStats);
        
        return stats;
    }
    
    @Override
    public boolean isCardNumberExists(String cardNumber) {
        return cardRepository.existsByCardNumber(cardNumber);
    }
    
    @Override
    public void processExpiredCards() {
        List<Card> expiredCards = cardRepository.findExpiredCards();
        for (Card card : expiredCards) {
            card.expire();
            cardRepository.save(card);
        }
    }
}