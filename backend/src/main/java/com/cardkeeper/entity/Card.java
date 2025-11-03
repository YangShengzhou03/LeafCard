package com.cardkeeper.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "card_management")
public class Card {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "uuid", unique = true, nullable = false, length = 36)
    private String uuid;
    
    @NotBlank(message = "卡号不能为空")
    @Size(max = 50, message = "卡号长度不能超过50个字符")
    @Column(name = "card_number", unique = true, nullable = false, length = 50)
    private String cardNumber;
    
    @NotBlank(message = "卡等级不能为空")
    @Size(max = 20, message = "卡等级长度不能超过20个字符")
    @Column(name = "card_level", nullable = false, length = 20)
    private String cardLevel;

    @NotBlank(message = "商品类别不能为空")
    @Size(max = 50, message = "商品类别长度不能超过50个字符")
    @Column(name = "product_category", nullable = false, length = 50)
    private String productCategory;

    @NotBlank(message = "产品类型不能为空")
    @Size(max = 30, message = "产品类型长度不能超过30个字符")
    @Column(name = "product_type", nullable = false, length = 30)
    private String productType;

    @NotBlank(message = "产品规格不能为空")
    @Size(max = 50, message = "产品规格长度不能超过50个字符")
    @Column(name = "product_spec", nullable = false, length = 50)
    private String productSpec;
    
    @NotNull(message = "卡状态不能为空")
    @Column(name = "card_status", nullable = false)
    private Integer cardStatus;
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @Column(name = "activate_time")
    private LocalDateTime activateTime;
    
    @Column(name = "use_time")
    private LocalDateTime useTime;
    
    @Column(name = "expire_time")
    private LocalDateTime expireTime;
    
    @Size(max = 50, message = "使用者ID长度不能超过50个字符")
    @Column(name = "user_id", length = 50)
    private String userId;
    
    @Size(max = 50, message = "使用者IP长度不能超过50个字符")
    @Column(name = "user_ip", length = 50)
    private String userIp;
    
    @NotNull(message = "充值次数不能为空")
    @Column(name = "recharge_times", nullable = false)
    private Integer rechargeTimes = 0;
    
    @Column(name = "last_recharge_time")
    private LocalDateTime lastRechargeTime;
    
    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;
    
    @Version
    @Column(name = "version", nullable = false)
    private Integer version = 0;
    
    // 构造函数
    public Card() {
        this.uuid = UUID.randomUUID().toString();
        this.createTime = LocalDateTime.now();
    }
    
    public Card(String cardNumber, String cardLevel, String productCategory, String productType, String productSpec) {
        this();
        this.cardNumber = cardNumber;
        this.cardLevel = cardLevel;
        this.productCategory = productCategory;
        this.productType = productType;
        this.productSpec = productSpec;
        this.cardStatus = 0; // 默认未激活
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUuid() {
        return uuid;
    }
    
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
    
    public String getCardNumber() {
        return cardNumber;
    }
    
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public String getCardLevel() {
        return cardLevel;
    }
    
    public void setCardLevel(String cardLevel) {
        this.cardLevel = cardLevel;
    }
    
    public String getProductCategory() {
        return productCategory;
    }
    
    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }
    
    public Integer getCardStatus() {
        return cardStatus;
    }
    
    public void setCardStatus(Integer cardStatus) {
        this.cardStatus = cardStatus;
    }
    
    public LocalDateTime getCreateTime() {
        return createTime;
    }
    
    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }
    
    public LocalDateTime getActivateTime() {
        return activateTime;
    }
    
    public void setActivateTime(LocalDateTime activateTime) {
        this.activateTime = activateTime;
    }
    
    public LocalDateTime getUseTime() {
        return useTime;
    }
    
    public void setUseTime(LocalDateTime useTime) {
        this.useTime = useTime;
    }
    
    public LocalDateTime getExpireTime() {
        return expireTime;
    }
    
    public void setExpireTime(LocalDateTime expireTime) {
        this.expireTime = expireTime;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getUserIp() {
        return userIp;
    }
    
    public void setUserIp(String userIp) {
        this.userIp = userIp;
    }
    
    public Integer getRechargeTimes() {
        return rechargeTimes;
    }
    
    public void setRechargeTimes(Integer rechargeTimes) {
        this.rechargeTimes = rechargeTimes;
    }
    
    public LocalDateTime getLastRechargeTime() {
        return lastRechargeTime;
    }
    
    public void setLastRechargeTime(LocalDateTime lastRechargeTime) {
        this.lastRechargeTime = lastRechargeTime;
    }
    
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    
    public Integer getVersion() {
        return version;
    }
    
    public void setVersion(Integer version) {
        this.version = version;
    }
    
    // 业务方法
    public void activate() {
        this.cardStatus = 1; // 已激活
        this.activateTime = LocalDateTime.now();
    }
    
    public void use(String userId, String userIp) {
        this.cardStatus = 2; // 已使用
        this.userId = userId;
        this.userIp = userIp;
        this.useTime = LocalDateTime.now();
    }
    
    public void recharge() {
        this.rechargeTimes++;
        this.lastRechargeTime = LocalDateTime.now();
        this.cardStatus = 1; // 重新激活
    }
    
    public void expire() {
        this.cardStatus = 3; // 已过期
    }
    
    public void freeze() {
        this.cardStatus = 4; // 已冻结
    }
    
    public boolean isExpired() {
        return expireTime != null && LocalDateTime.now().isAfter(expireTime);
    }
    
    @Override
    public String toString() {
        return "Card{" +
                "id=" + id +
                ", cardNumber='" + cardNumber + '\'' +
                ", cardLevel='" + cardLevel + '\'' +
                ", cardStatus=" + cardStatus +
                '}';
    }
}