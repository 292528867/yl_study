package com.wonders.xlab.youle.dto.article;

import java.util.Set;

/**
 * Created by Jeffrey on 15/8/17.
 */
public class ArticleDto {

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章副标题
     */
    private String subTitle;

    private long momentsId;

    private Long productId;

    private Long activityId;

    private Set<ArticleCellDto> cells;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubTitle() {
        return subTitle;
    }

    public void setSubTitle(String subTitle) {
        this.subTitle = subTitle;
    }

    public long getMomentsId() {
        return momentsId;
    }

    public void setMomentsId(long momentsId) {
        this.momentsId = momentsId;
    }

    public Set<ArticleCellDto> getCells() {
        return cells;
    }

    public void setCells(Set<ArticleCellDto> cells) {
        this.cells = cells;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }
}
