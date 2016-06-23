package com.wonders.xlab.youle.dto.recommend;

/**
 * Created by Jeffrey on 15/8/27.
 */
public class TagDto {
    /**
     * 标签名
     */
    private String name;
    /**
     * 标签描述
     */
    private String description;

    /**
     * 标签跳转地址
     */
    private String linkUrl;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }
}
