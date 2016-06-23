package com.wonders.xlab.youle.entity.article;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.moments.Moment;
import com.wonders.xlab.youle.enums.Status;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Jeffrey on 15/8/12.
 */
@Entity
@Table(name = "YL_ARTICLE")
public class Article extends AbstractBaseEntity<Long> {

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章副标题
     */
    private String subTitle;

    @OneToMany(
            fetch = FetchType.EAGER,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    @JoinTable(
            name = "yl_article_cell_relation",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "article_cell_id")
    )
    @OrderBy(value = "cellSort asc")
    private Set<ArticleCell> cells = new HashSet<>();

    private String category = "热门";

    private int sortCategory;

    /**
     * 朋友圈
     */
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "MOMENT_ID")
    private Moment moments;

    /**
     * 文章真实点赞
     */
    private int clickAmount;

    /**
     * 点击计算系数
     */
    @JsonIgnore
    private int coefficient;

    /**
     * 是否推荐
     */
    @JsonIgnore
    private boolean recommend;

    /**
     * 推荐值
     */
    @JsonIgnore
    private int recommendValue;

    @JsonIgnore
    private Double arithmeticValue;

    @Enumerated
    private Status status = Status.effective;

    /**
     * 是否精品
     */
    private boolean hightlight = false;

    /**
     * 是否被删除
     */
    private boolean removed = false;

    /**
     * 是否置顶
     */
    private boolean top = false;

    @JsonIgnore
    private Integer badReport = 0;

    public int getSortCategory() {
        return sortCategory;
    }

    public void setSortCategory(int sortCategory) {
        this.sortCategory = sortCategory;
    }

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

    public Moment getMoments() {
        return moments;
    }

    public void setMoments(Moment moments) {
        this.moments = moments;
    }

    public int getClickAmount() {
        return clickAmount;
    }

    public void setClickAmount(int clickAmount) {
        this.clickAmount = clickAmount;
    }

    public int getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(int coefficient) {
        this.coefficient = coefficient;
    }

    public boolean isRecommend() {
        return recommend;
    }

    public void setRecommend(boolean recommend) {
        this.recommend = recommend;
    }

    public int getRecommendValue() {
        return recommendValue;
    }

    public void setRecommendValue(int recommendValue) {
        this.recommendValue = recommendValue;
    }

    public Set<ArticleCell> getCells() {
        return cells;
    }

    public void setCells(Set<ArticleCell> cells) {
        this.cells = cells;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Double getArithmeticValue() {
        return arithmeticValue;
    }

    public void setArithmeticValue(Double arithmeticValue) {
        this.arithmeticValue = arithmeticValue;
    }

    public boolean isEmpty() {
        return null == this || null == this.getId();
    }

    public Integer getBadReport() {
        return badReport;
    }

    public void setBadReport(Integer badReport) {
        this.badReport = badReport;
    }

    public boolean isHightlight() {
        return hightlight;
    }

    public void setHightlight(boolean hightlight) {
        this.hightlight = hightlight;
    }

    public boolean isTop() {
        return top;
    }

    public void setIsTop(boolean top) {
        this.top = top;
    }

    public boolean isRemoved() {
        return removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }
}
