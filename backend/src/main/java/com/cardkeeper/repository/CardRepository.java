package com.cardkeeper.repository;

import com.cardkeeper.entity.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    
    /**
     * 根据卡号查找卡
     */
    Optional<Card> findByCardNumber(String cardNumber);
    
    /**
     * 根据UUID查找卡
     */
    Optional<Card> findByUuid(String uuid);
    
    /**
     * 根据卡状态查找卡列表
     */
    List<Card> findByCardStatus(Integer cardStatus);
    
    /**
     * 根据卡等级查找卡列表
     */
    List<Card> findByCardLevel(String cardLevel);
    
    /**
     * 根据商品类别查找卡列表
     */
    List<Card> findByProductCategory(String productCategory);
    
    /**
     * 根据产品类型查询
     */
    List<Card> findByProductType(String productType);
    
    /**
     * 根据产品规格查询
     */
    List<Card> findByProductSpec(String productSpec);
    
    /**
     * 根据产品类型和规格查询
     */
    List<Card> findByProductTypeAndProductSpec(String productType, String productSpec);
    
    /**
     * 根据产品类型、规格和状态查询
     */
    List<Card> findByProductTypeAndProductSpecAndCardStatus(String productType, String productSpec, Integer cardStatus);
    
    /**
     * 统计各产品类型的卡数量
     */
    @Query("SELECT c.productType, COUNT(c) FROM Card c GROUP BY c.productType")
    List<Object[]> countByProductType();
    
    /**
     * 统计各产品规格的卡数量
     */
    @Query("SELECT c.productSpec, COUNT(c) FROM Card c GROUP BY c.productSpec")
    List<Object[]> countByProductSpec();
    
    /**
     * 统计各产品类型和规格组合的卡数量
     */
    @Query("SELECT c.productType, c.productSpec, COUNT(c) FROM Card c GROUP BY c.productType, c.productSpec")
    List<Object[]> countByProductTypeAndSpec();
    
    /**
     * 根据多个条件查询卡列表（分页）
     */
    @Query("SELECT c FROM Card c WHERE " +
            "(:cardNumber IS NULL OR c.cardNumber LIKE %:cardNumber%) AND " +
            "(:cardLevel IS NULL OR c.cardLevel = :cardLevel) AND " +
            "(:productCategory IS NULL OR c.productCategory = :productCategory) AND " +
            "(:cardStatus IS NULL OR c.cardStatus = :cardStatus)")
    Page<Card> findByConditions(
            @Param("cardNumber") String cardNumber,
            @Param("cardLevel") String cardLevel,
            @Param("productCategory") String productCategory,
            @Param("cardStatus") Integer cardStatus,
            Pageable pageable
    );
    
    /**
     * 统计不同状态的卡数量
     */
    @Query("SELECT c.cardStatus, COUNT(c) FROM Card c GROUP BY c.cardStatus")
    List<Object[]> countByCardStatus();
    
    /**
     * 统计不同等级的卡数量
     */
    @Query("SELECT c.cardLevel, COUNT(c) FROM Card c GROUP BY c.cardLevel")
    List<Object[]> countByCardLevel();
    
    /**
     * 查找过期的卡
     */
    @Query("SELECT c FROM Card c WHERE c.expireTime IS NOT NULL AND c.expireTime < CURRENT_TIMESTAMP AND c.cardStatus != 3")
    List<Card> findExpiredCards();
    
    /**
     * 检查卡号是否存在
     */
    boolean existsByCardNumber(String cardNumber);
}