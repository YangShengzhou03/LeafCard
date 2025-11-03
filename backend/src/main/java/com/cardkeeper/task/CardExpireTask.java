package com.cardkeeper.task;

import com.cardkeeper.service.CardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CardExpireTask {
    
    private static final Logger logger = LoggerFactory.getLogger(CardExpireTask.class);
    
    @Autowired
    private CardService cardService;
    
    /**
     * 每天凌晨1点执行过期卡处理
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void processExpiredCards() {
        logger.info("开始执行过期卡处理任务");
        try {
            cardService.processExpiredCards();
            logger.info("过期卡处理任务执行完成");
        } catch (Exception e) {
            logger.error("过期卡处理任务执行失败", e);
        }
    }
}