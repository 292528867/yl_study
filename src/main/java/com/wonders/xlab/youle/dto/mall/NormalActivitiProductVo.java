package com.wonders.xlab.youle.dto.mall;

import com.wonders.xlab.youle.entity.article.Banner;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import org.apache.commons.lang3.StringUtils;

/**
 * 外链商品列表对象。
 */
public class NormalActivitiProductVo {
    /** 外链商品 */
    private Banner.LinkType type = Banner.LinkType.outside;

    /** 图片url */
    private String productUrl = "";
    /** type=1，外链url */
    private String linkUrl = "";
    /** 现价 */
    private double price;
    /** 商品名称 */
    private String productName = "";
    /** 商品外链url */
    private String productOtherUrl = "";

    /** 图片2 */
    private String productUrl2 = "";

    /** 商品id */
    private Long productId;

    public NormalActivitiProductVo(MallProduct p) {
        this.linkUrl = p.getProductExternalUrl();
        this.price = p.getCurrentPrice();
        this.productUrl = p.getPictureUrl();
        this.productName = p.getName();

        this.productOtherUrl = p.getProductExternalUrl();

        if (StringUtils.isEmpty(p.getPictureUrlList()))
            this.productUrl2 = p.getPictureUrlList();
        else
            this.productUrl2 = p.getPictureUrlList().split(",")[0];

        this.productId = p.getId();
    }

    public Banner.LinkType getType() {
        return type;
    }

    public void setType(Banner.LinkType type) {
        this.type = type;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductUrl() {
        return productUrl;
    }

    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl;
    }

    public String getProductUrl2() {
        return productUrl2;
    }

    public void setProductUrl2(String productUrl2) {
        this.productUrl2 = productUrl2;
    }

    public String getProductOtherUrl() {
        return productOtherUrl;
    }

    public void setProductOtherUrl(String productOtherUrl) {
        this.productOtherUrl = productOtherUrl;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
