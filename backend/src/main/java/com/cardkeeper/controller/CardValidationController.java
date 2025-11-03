package com.cardkeeper.controller;

import com.cardkeeper.common.Result;
import com.cardkeeper.entity.Card;
import com.cardkeeper.service.CardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/card-validation")
public class CardValidationController {
    
    @Autowired
    private CardService cardService;
    
    /**
     * 卡密验证接口
     * 支持规格类型文本+数字标识的验证
     */
    @PostMapping("/validate")
    public Result<Map<String, Object>> validateCard(
            @Valid @RequestBody CardValidationRequest request) {
        
        Map<String, Object> validationResult = cardService.validateCard(
            request.getCardNumber(),
            request.getSpecificationType(),
            request.getDigitalIdentifier()
        );
        
        return Result.success(validationResult);
    }
    
    /**
     * 批量卡密验证
     */
    @PostMapping("/batch-validate")
    public Result<Map<String, Object>> batchValidateCards(
            @Valid @RequestBody BatchCardValidationRequest request) {
        
        Map<String, Object> batchResult = cardService.batchValidateCards(
            request.getCardNumbers(),
            request.getSpecificationType(),
            request.getDigitalIdentifier()
        );
        
        return Result.success(batchResult);
    }
    
    /**
     * 获取卡密验证规则
     */
    @GetMapping("/rules")
    public Result<Map<String, Object>> getValidationRules() {
        Map<String, Object> rules = cardService.getValidationRules();
        return Result.success(rules);
    }
    
    /**
     * 卡密验证请求对象
     */
    public static class CardValidationRequest {
        @jakarta.validation.constraints.NotBlank(message = "卡号不能为空")
        private String cardNumber;
        
        @jakarta.validation.constraints.NotBlank(message = "规格类型不能为空")
        private String specificationType;
        
        @jakarta.validation.constraints.NotBlank(message = "数字标识不能为空")
        private String digitalIdentifier;
        
        // Getter和Setter方法
        public String getCardNumber() {
            return cardNumber;
        }
        
        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }
        
        public String getSpecificationType() {
            return specificationType;
        }
        
        public void setSpecificationType(String specificationType) {
            this.specificationType = specificationType;
        }
        
        public String getDigitalIdentifier() {
            return digitalIdentifier;
        }
        
        public void setDigitalIdentifier(String digitalIdentifier) {
            this.digitalIdentifier = digitalIdentifier;
        }
    }
    
    /**
     * 批量卡密验证请求对象
     */
    public static class BatchCardValidationRequest {
        @jakarta.validation.constraints.NotEmpty(message = "卡号列表不能为空")
        private String[] cardNumbers;
        
        @jakarta.validation.constraints.NotBlank(message = "规格类型不能为空")
        private String specificationType;
        
        @jakarta.validation.constraints.NotBlank(message = "数字标识不能为空")
        private String digitalIdentifier;
        
        // Getter和Setter方法
        public String[] getCardNumbers() {
            return cardNumbers;
        }
        
        public void setCardNumbers(String[] cardNumbers) {
            this.cardNumbers = cardNumbers;
        }
        
        public String getSpecificationType() {
            return specificationType;
        }
        
        public void setSpecificationType(String specificationType) {
            this.specificationType = specificationType;
        }
        
        public String getDigitalIdentifier() {
            return digitalIdentifier;
        }
        
        public void setDigitalIdentifier(String digitalIdentifier) {
            this.digitalIdentifier = digitalIdentifier;
        }
    }
}