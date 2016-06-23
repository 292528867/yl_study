package com.wonders.xlab.youle.dto.mall;

import com.wonders.xlab.youle.entity.article.Banner;

/**
 * 商城banner tryout 全部试用 类型对象。
 */
public class MallBannerTryOutTypeVo {
    /** bannerId */
    private long bannerId;

    /** 内链商品 */
    private Banner.LinkType type = Banner.LinkType.tryout;

    /** 图片url */
    private String pictureUrl = "";

    public MallBannerTryOutTypeVo(Banner banner) {
        this.bannerId = banner.getId();
        this.pictureUrl = banner.getIconUrl();
    }

    public long getBannerId() {
        return bannerId;
    }

    public void setBannerId(long bannerId) {
        this.bannerId = bannerId;
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
