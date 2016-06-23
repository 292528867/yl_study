package com.wonders.xlab.youle.dto.mall;

import com.wonders.xlab.youle.entity.article.Banner;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 商城banner outside类型对象。
 */
public class MallBannerInsideTypeVo {
    /** bannerId */
    private long bannerId;

    /** 内链商品 */
    private Banner.LinkType type = Banner.LinkType.inside;

    /** 图片url */
    private String pictureUrl = "";

    /** 关联的试用活动id */
    private long activitiId = 0L;
    /** 商品id */
    private long productId = 0L;
    /** 商品名字 */
    private String productName = "";
    /** 商品url */
    private String productUrl = "";
    /** 商品外链url */
    private String productOtherUrl = "";
    /** 试用商品数量 */
    private int count = 0;
    /** 使用商品积分 */
    private int score = 0;
    /** 现价 */
    private double price;

    /** 商品详细url列表 */
    private List<String> pictureUrlList = new ArrayList<>();
    /** 商品html描述 */
    private String productHtmlDesc = "";

    public MallBannerInsideTypeVo() {
    }

    public MallBannerInsideTypeVo(MallActivitiProduct p) {
        this.setActivitiId(p.getPk().getMallActiviti().getId());
        this.setProductId(p.getPk().getMallProduct().getId());
        this.setProductName(p.getPk().getMallProduct().getName());
        this.setProductUrl(p.getPk().getMallProduct().getPictureUrl());
        this.setScore(p.getScore());
        this.setCount(p.getCount());
        this.setPrice(p.getPk().getMallProduct().getCurrentPrice());

        if (p.getPk().getMallProduct().getPictureUrlList() == null)
            this.getPictureUrlList().add(this.getProductUrl());
        else
            this.getPictureUrlList().addAll(Arrays.asList(p.getPk().getMallProduct().getPictureUrlList().split(",")));

        this.setProductHtmlDesc(p.getPk().getMallProduct().getProductDesc());

        this.setPictureUrl(p.getPk().getMallProduct().getPictureUrl());
    }

    public Banner.LinkType getType() {
        return type;
    }

    public void setType(Banner.LinkType type) {
        this.type = type;
    }

    public long getActivitiId() {
        return activitiId;
    }

    public void setActivitiId(long activitiId) {
        this.activitiId = activitiId;
    }

    public long getProductId() {
        return productId;
    }

    public void setProductId(long productId) {
        this.productId = productId;
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

    public String getProductOtherUrl() {
        return productOtherUrl;
    }

    public void setProductOtherUrl(String productOtherUrl) {
        this.productOtherUrl = productOtherUrl;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getPictureUrlList() {
        return pictureUrlList;
    }

    public void setPictureUrlList(List<String> pictureUrlList) {
        this.pictureUrlList = pictureUrlList;
    }

    public String getProductHtmlDesc() {
        return productHtmlDesc;
    }

    public void setProductHtmlDesc(String productHtmlDesc) {
        this.productHtmlDesc = productHtmlDesc;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public long getBannerId() {
        return bannerId;
    }

    public void setBannerId(long bannerId) {
        this.bannerId = bannerId;
    }
}
