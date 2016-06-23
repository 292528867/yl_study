package com.wonders.xlab.youle.dto.mall;

/**
 * 测试商品试用Dto。
 */
public class TestTryActivitiProductDto {
    private Long tryActivitiId;
    private Long productId;
    private Integer score;

    public Long getTryActivitiId() {
        return tryActivitiId;
    }

    public void setTryActivitiId(Long tryActivitiId) {
        this.tryActivitiId = tryActivitiId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
