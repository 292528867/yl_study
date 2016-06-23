package com.wonders.xlab.youle.entity.article;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by Jeffrey on 15/9/8.
 */
@Entity
@Table(name = "yl_article_product")
public class ArticleMallProduct extends AbstractBaseEntity<Long> {

    private Long mallProductId;

    private Long activityId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "article_id")
    private Article article;

    public ArticleMallProduct() {
    }

    public ArticleMallProduct(Long mallProductId, Long activityId, Article article) {
        this.mallProductId = mallProductId;
        this.activityId = activityId;
        this.article = article;
    }

    public Long getMallProductId() {
        return mallProductId;
    }

    public void setMallProductId(Long mallProductId) {
        this.mallProductId = mallProductId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }
}
