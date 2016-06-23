package com.wonders.xlab.youle.entity.tags;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.article.ArticleCell;

import javax.persistence.*;

/**
 * 标签
 * Created by Jeffrey on 15/8/12.
 */
@Entity
@Table(name = "YL_TAG")
public class Tag extends AbstractBaseEntity<Long> {

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

    /**
     * 文章单元
     */
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "article_cell_id")
    private ArticleCell articleCell;

    /**
     * 标签相对图片X坐标
     */
    private Double tagX;

    /**
     * 标签相对图片Y坐标
     */
    private Double tagY;

    public Tag() {
    }

    public Tag(String name, String description) {
        this.name = name;
        this.description = description;
    }

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

    public ArticleCell getArticleCell() {
        return articleCell;
    }

    public void setArticleCell(ArticleCell articleCell) {
        this.articleCell = articleCell;
    }

    public Double getTagX() {
        return tagX;
    }

    public void setTagX(Double tagX) {
        this.tagX = tagX;
    }

    public Double getTagY() {
        return tagY;
    }

    public void setTagY(Double tagY) {
        this.tagY = tagY;
    }
}
