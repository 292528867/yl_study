package com.wonders.xlab.youle.dto.mall;

/**
 * 开始试用商品流程dto。
 *
 */
public class StartTryActivitiProductDto {
    private Long tryActivitiId;
    private Long productId;
    private Integer score;

    /** 收货人 */
    private String receiver;
    /** 收货人电话 */
    private String receiverPhone;
    /** 收货人地址 */
    private String receiverAddress;

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
    public String getReceiver() {
        return receiver;
    }
    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }
    public String getReceiverPhone() {
        return receiverPhone;
    }
    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }
    public String getReceiverAddress() {
        return receiverAddress;
    }
    public void setReceiverAddress(String receiverAddress) {
        this.receiverAddress = receiverAddress;
    }
}
