package com.wonders.xlab.youle.dto.mall;

import java.util.Date;

/**
 * 试用商品订单。
 */
public class TryActivitiOrderVo {
    private Long orderId;
    private Long productId;
    private String productName;
    private String productUrl;
    private int score;
    private Date orderUpdateDate;
    private String orderStatus;
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public int getScore() {
        return score;
    }
    public void setScore(int score) {
        this.score = score;
    }
    public Date getOrderUpdateDate() {
        return orderUpdateDate;
    }
    public void setOrderUpdateDate(Date orderUpdateDate) {
        this.orderUpdateDate = orderUpdateDate;
    }
    public String getOrderStatus() {
        return orderStatus;
    }
    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }
    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    public String getProductUrl() {
        return productUrl;
    }
    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl;
    }
}
