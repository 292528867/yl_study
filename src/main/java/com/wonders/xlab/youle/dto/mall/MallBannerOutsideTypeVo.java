package com.wonders.xlab.youle.dto.mall;

import com.wonders.xlab.youle.entity.article.Banner;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import org.apache.commons.lang3.StringUtils;

/**
 * 商城banner outside类型对象。
 */
public class MallBannerOutsideTypeVo {
    /** bannerId */
    private long bannerId;

    /** 外链商品 */
    private Banner.LinkType type = Banner.LinkType.outside;

    /** 图片url */
    private String pictureUrl = "";
    /** type=1，外链url */
    private String linkUrl = "";
    /** 现价 */
    private double price;

    public MallBannerOutsideTypeVo() {}
    public String getLinkUrl() {
        return linkUrl;
    }

    public MallBannerOutsideTypeVo(MallProduct p) {
        this.linkUrl = p.getProductExternalUrl();
        this.price = p.getCurrentPrice();

        if (StringUtils.isEmpty(p.getPictureUrlList()))
            this.pictureUrl = p.getPictureUrl();
        else
            this.pictureUrl = p.getPictureUrlList().split(",")[0];

    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public Banner.LinkType getType() {
        return type;
    }

    public void setType(Banner.LinkType type) {
        this.type = type;
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
