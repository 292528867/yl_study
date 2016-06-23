package com.wonders.xlab.youle.dto.mall;

import com.wonders.xlab.youle.entity.article.Banner;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;
import com.wonders.xlab.youle.entity.mall.MallProduct;

/**
 * 试用商品列表对象。
 *
 */
public class TryActivitiProductVo {
    /** 试用商品 */
    private Banner.LinkType type = Banner.LinkType.inside;
    /** 图片url */
    private String pictureUrl = "";


    /** 商品活动id */
    private Long activitiId = 0L;
    /** 商品id */
    private Long productId = 0L;
    /** 商品名称 */
    private String productName = "";
    /** 商品图片url */
    private String productUrl = "";
    /** 商品外链url */
    private String productOtherUrl = "";
    /** 现价 */
    private double price;
    /** 试用商品数量 */
    private int count = 0;
    /** 试用商品所需积分 */
    private int score = 0;

//    /** 商品详细url列表 */
//    private List<String> pictureUrlList = new ArrayList<>();
//    /** 商品html描述 */
//    private String productHtmlDesc = "";

    public TryActivitiProductVo() {}

    public TryActivitiProductVo(MallActivitiProduct p) {
        this.setActivitiId(p.getPk().getMallActiviti().getId());
        this.setProductId(p.getPk().getMallProduct().getId());
        this.setProductName(p.getPk().getMallProduct().getName());
        this.setProductUrl(p.getPk().getMallProduct().getPictureUrl());
        this.setScore(p.getScore());
        this.setCount(p.getCount());
        this.setPrice(p.getPk().getMallProduct().getCurrentPrice());

//        if (p.getPk().getMallProduct().getPictureUrlList() == null)
//            this.getPictureUrlList().add(this.getProductUrl());
//        else
//            this.getPictureUrlList().addAll(Arrays.asList(p.getPk().getMallProduct().getPictureUrlList().split(",")));
//
//        this.setProductHtmlDesc(p.getPk().getMallProduct().getProductDesc());

        this.setProductOtherUrl(p.getPk().getMallProduct().getProductExternalUrl());

        this.pictureUrl = this.getProductUrl();
    }

    public TryActivitiProductVo(MallProduct p) {
        this.setActivitiId(0L);
        this.setProductId(p.getId());
        this.setProductName(p.getName());
        this.setProductUrl(p.getPictureUrl());
        this.setProductOtherUrl(p.getProductExternalUrl());
        this.setScore(0);
        this.setCount(0);
        this.setPrice(p.getCurrentPrice());

//        if (p.getPictureUrlList() == null)
//            this.getPictureUrlList().add(this.getProductUrl());
//        else
//            this.getPictureUrlList().addAll(Arrays.asList(p.getPictureUrlList().split(",")));
//
//        this.setProductHtmlDesc(p.getProductDesc());
    }


    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        if (productName == null)
            this.productName = "";
        else
            this.productName = productName;
    }
    public String getProductUrl() {
        return productUrl;
    }
    public void setProductUrl(String productUrl) {
        if (productUrl == null)
            this.productUrl = "";
        else
            this.productUrl = productUrl;
    }
    public int getScore() {
        return score;
    }
    public void setScore(int score) {
        this.score = score;
    }
    public Long getActivitiId() {
        return activitiId;
    }
    public void setActivitiId(Long activitiId) {
        if (activitiId == null)
            this.activitiId = 0L;
        else
            this.activitiId = activitiId;
    }
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        if (productId == null)
            this.productId = 0L;
        else
            this.productId = productId;
    }
    public int getCount() {
        return count;
    }
    public void setCount(int count) {
        this.count = count;
    }
    public String getProductOtherUrl() {
        return productOtherUrl;
    }
    public void setProductOtherUrl(String productOtherUrl) {
        if (productOtherUrl == null)
            this.productOtherUrl = "";
        else
            this.productOtherUrl = productOtherUrl;
    }

//    public List<String> getPictureUrlList() {
//        return pictureUrlList;
//    }
//    public void setPictureUrlList(List<String> pictureUrlList) {
//        this.pictureUrlList = pictureUrlList;
//    }
//    public String getProductHtmlDesc() {
//        return productHtmlDesc;
//    }
//    public void setProductHtmlDesc(String productHtmlDesc) {
//        if (productHtmlDesc == null)
//            this.productHtmlDesc = "";
//        else
//            this.productHtmlDesc = productHtmlDesc;
//    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Banner.LinkType getType() {
        return type;
    }

    public void setType(Banner.LinkType type) {
        this.type = type;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }
}
